using Infra.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stripe;
using Stripe.Events;



[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly ICartService _cartService;
    private readonly AppDbContext _context;
    private readonly IConfiguration _config;

    public OrdersController(ICartService cartService, AppDbContext context, IConfiguration config)
    {
        _cartService = cartService;
        _context = context;
        _config = config;
    }
    [HttpGet("status/{paymentIntentId}")]
    public async Task<ActionResult<Order>> GetOrderStatus(string paymentIntentId)
    {
        var order = await _context.Orders.FirstOrDefaultAsync(o => o.PaymentIntentId == paymentIntentId);

        if (order == null)
            return NotFound();

        return Ok(new { status = order.Status });
    }
    [HttpPost("checkout")]
    public async Task<ActionResult> Checkout(CheckoutDto dto)
    {
        var cart = await _cartService.GetCartAsync(dto.CartId);

        if (cart == null || cart.Items == null || !cart.Items.Any())
            return BadRequest("Cart is empty");

        var subtotal = cart.Items.Sum(i => i!.Price * i.Quantity);
        var tax = subtotal * 0.08m;
        var total = subtotal + tax;


        return Ok("Checkout successful");
    }
    [HttpPost("create-payment-intent")]
    public async Task<ActionResult> CreatePaymentIntent([FromBody] CheckoutDto dto)
    {
        var cart = await _cartService.GetCartAsync(dto.CartId);

        if (cart == null || !cart.Items.Any())
            return BadRequest("Cart is empty");

        var subtotal = cart.Items.Sum(i => i!.Price * i.Quantity);
        var tax = subtotal * 0.08m;
        var total = subtotal + tax;

        var options = new PaymentIntentCreateOptions
        {
            Amount = (long)(total * 100), // cents
            Currency = "usd",
            PaymentMethodTypes = new List<string> { "card" },
            Metadata = new Dictionary<string, string>{
                { "cartId", dto.CartId }
            }

        };

        var service = new PaymentIntentService();
        var paymentIntent = await service.CreateAsync(options);
        var order = new Order
        {
            BuyerId = dto.CartId,
            Subtotal = subtotal,
            Tax = tax,
            Total = total,
            Status = "Pending",
            PaymentIntentId = paymentIntent.Id,
            Items = cart.Items.Select(i => new OrderItem
            {
                ItemId = i!.ItemId,
                Name = i.Name,
                Price = i.Price,
                Quantity = i.Quantity
            }).ToList()
        };
        await _context.Orders.AddAsync(order);
        await _context.SaveChangesAsync();
        return Ok(new { clientSecret = paymentIntent.ClientSecret });
    }


    [HttpPost("webhook")]
    public async Task<IActionResult> Webhook()
    {
        var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();

        var signatureHeader = Request.Headers["Stripe-Signature"];

        Event stripeEvent;

        try
        {
            stripeEvent = EventUtility.ConstructEvent(
                json,
                signatureHeader,
                _config["Stripe:WebhookSecret"] 
                , throwOnApiVersionMismatch: false
            );
        }
        catch (Exception e)
        {
            Console.WriteLine($"Webhook error: {e.Message}");
            return BadRequest();
        }

        //  Handle events
        switch (stripeEvent.Type)

        {
            case EventTypes.PaymentIntentSucceeded:
                {
                    var paymentIntent = stripeEvent.Data.Object as PaymentIntent;

                    if (paymentIntent == null)
                        return BadRequest();

                    Console.WriteLine($"✅ Payment success: {paymentIntent.Id}");

                    var order = _context.Orders.FirstOrDefault(o => o.PaymentIntentId == paymentIntent.Id);
                    Console.WriteLine($"Found order for payment intent {paymentIntent.Amount}");
                    if (order != null)
                    {
                        _context.Orders.FirstOrDefault(o => o.PaymentIntentId == paymentIntent.Id)!.Status = "Paid";
                        await _context.SaveChangesAsync();
                        await _cartService.DeleteCartAsync(order.BuyerId);
                    }

                    break;
                }

            case EventTypes.PaymentIntentPaymentFailed:
                {
                    var paymentIntent = stripeEvent.Data.Object as PaymentIntent;

                    Console.WriteLine($"Payment failed: {paymentIntent?.Id}");


                    var order = _context.Orders.FirstOrDefault(o => o.PaymentIntentId == paymentIntent!.Id);
                    if (order != null)
                    {
                        _context.Orders.FirstOrDefault(o => o.PaymentIntentId == paymentIntent!.Id)!.Status = "Failed";
                        await _context.SaveChangesAsync();
                    }
                    break;
                }

            default:
                Console.WriteLine($"Unhandled event: {stripeEvent.Type}");
                break;
        }

        return Ok();
    }
}

