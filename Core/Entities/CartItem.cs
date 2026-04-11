using Core.Entities;

public class CartItem
{
  
    public int ItemId { get; set; }
    public required string Name { get; set; }
    public decimal Price { get; set; }
    public required string PictureUrl { get; set; }
    
    public int Quantity { get; set; }
    
   
}