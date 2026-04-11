using System;
using System.Reflection;
using System.Text.Json;
using Core.Entities;
using Microsoft.AspNetCore.Identity;

namespace Infra.Data.DataSeeds;

public class SeedingData
{
    public static async Task SeedDataAsync(AppDbContext context, UserManager<AppUser> userManager)
    {
         var path = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);
        if (!context.Users.Any(u => u.UserName == "admin@mitret.com"))
        {
            var user = new AppUser
            {
                UserName = "admin@mitret.com",
                Email = "admin@mitret.com",
                FirstName = "Mohammed",
                LastName = "Jabeer",
            };

            await userManager.CreateAsync(user, "Password1!");
            await userManager.AddToRoleAsync(user, "Admin");
        }
        if (!context.MenuItems.Any())
        {
            var menu = JsonSerializer.Deserialize<List<MenuItem>>(File.ReadAllText("../Infra/Data/DataSeeds/Menu.json"));
            if (menu == null) return;
            context.MenuItems.AddRange(menu);
            await context.SaveChangesAsync();
        }
    }

}
