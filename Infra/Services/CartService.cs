using System.Text.Json;
using StackExchange.Redis;

public class CartService: ICartService
{
    private readonly IDatabase _database;

    public CartService(IConnectionMultiplexer redis)
    {
        _database = redis.GetDatabase();
    }

    public async Task<ShoppingCart?> GetCartAsync(string cartId)
    {
        var data = await _database.StringGetAsync(cartId);

        

        return data.IsNullOrEmpty ? null : JsonSerializer.Deserialize<ShoppingCart>(data!);
    }

    public async Task<ShoppingCart?> SetCartAsync(ShoppingCart cart)
    {
        var created = await _database.StringSetAsync(
            cart.Id,
            JsonSerializer.Serialize(cart),
            TimeSpan.FromDays(7)
        );

        if (!created) return null;

        return await GetCartAsync(cart.Id);
    }

    public async Task<bool> DeleteCartAsync(string cartId)
    {
        return await _database.KeyDeleteAsync(cartId);
    }
}