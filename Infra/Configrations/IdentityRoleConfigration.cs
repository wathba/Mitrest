using System;
using Core.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infra.Configrations;

public class RoleConfiguration : IEntityTypeConfiguration<IdentityRole>
{
    public void Configure(EntityTypeBuilder<IdentityRole> builder)
    {
        builder.HasData(
            new IdentityRole
            {
                Id = "1",
                Name = "Admin",
                NormalizedName = "ADMIN",

            },
            new IdentityRole
            {
                Id = "2",
                Name = "Moderator",
                NormalizedName = "MODERATOR",

            }
            ,
            new IdentityRole
            {
                Id = "3",
                Name = "Member",
                NormalizedName = "MEMBER"
            }

        );
        
    }
}
