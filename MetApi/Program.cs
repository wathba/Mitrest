using Infra.Data;
using Infra.Data.DataSeeds;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.EntityFrameworkCore;
using StackExchange.Redis;
using Stripe;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Core.Entities;
using Microsoft.AspNetCore.Identity;

var builder = WebApplication.CreateBuilder(args);


// Add services to the ontainer.

builder.Services.AddControllers();
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddAuthorization();


builder.Services.AddIdentityApiEndpoints<AppUser>().AddRoles<IdentityRole>().AddEntityFrameworkStores<AppDbContext>();

 
builder.Services.AddSingleton<IConnectionMultiplexer>(config =>
{
    var connectingString = builder.Configuration.GetConnectionString("Redis") ?? throw new Exception("Redis connection string not found");
    Console.WriteLine($"Connecting to Redis with: {connectingString}");
    var configuration = ConfigurationOptions.Parse(connectingString, true);
    configuration.AbortOnConnectFail = false;
    return ConnectionMultiplexer.Connect(configuration);
});
var stripeSettings = builder.Configuration.GetSection("Stripe");
StripeConfiguration.ApiKey = stripeSettings["SecretKey"];
builder.Services.AddSingleton<ICartService, CartService>(); 
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
builder.Services.AddCors();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi


var app = builder.Build();

// Configure the HTTP request pipeline.



app.UseCors(option =>
{
    option.AllowAnyHeader().AllowCredentials().AllowAnyMethod().WithOrigins("https://localhost:3000", "http://localhost:3000");
});
app.MapControllers();
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<AppDbContext>();
        var userManager = services.GetRequiredService<UserManager<AppUser>>();
        await context.Database.MigrateAsync();
        await SeedingData.SeedDataAsync(context, userManager);
    }
    catch (Exception ex)
    {
        // Handle exceptions (e.g., log them)
        Console.WriteLine($"An error occurred during migration: {ex.Message}");
    }
}

app.UseAuthorization();
app.MapGroup("/api").MapIdentityApi<AppUser>();
app.Run();
