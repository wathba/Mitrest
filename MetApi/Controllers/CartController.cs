using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/cart")]
public class CartController : ControllerBase
{
    private readonly ICartService _cartService;

    public CartController(ICartService cartService)
    {
        _cartService = cartService;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ShoppingCart>> GetCart(string id)
    {
        var cart = await _cartService.GetCartAsync(id);
        return Ok(cart ?? new ShoppingCart {
            Id = id,
            Items = new List<CartItem?>()
        });
    }

    [HttpPost]
    public async Task<ActionResult<ShoppingCart>> UpdateCart([FromBody] ShoppingCart cart)
    {
        return Ok(await _cartService.SetCartAsync(cart));
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteCart(string id)
    {
        await _cartService.DeleteCartAsync(id);
        return NoContent();
    }
}