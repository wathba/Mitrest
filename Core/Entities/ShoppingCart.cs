public class ShoppingCart
{
    public required string Id  { get; set; }
    public required List<CartItem?> Items { get; set; }
    public decimal TotalPrice => Items.Sum(i => i?.Price * i?.Quantity ?? 0);
}