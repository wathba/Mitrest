public class Order
{
    public int Id { get; set; }

    public string BuyerId { get; set; } = string.Empty;
    public string? PaymentIntentId { get; set; }
    public DateTime OrderDate { get; set; } = DateTime.UtcNow;

    public decimal Subtotal { get; set; }
    public required string Status { get; set; }

    public decimal Tax { get; set; }

    public decimal Total { get; set; }

    public List<OrderItem> Items { get; set; } = new();
}

