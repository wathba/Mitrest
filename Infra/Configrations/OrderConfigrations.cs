using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Core.Entities;

public class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.BuyerId)
               .IsRequired()
               .HasMaxLength(100);

        builder.Property(x => x.Subtotal)
               .HasColumnType("decimal(18,2)");

        builder.Property(x => x.Tax)
               .HasColumnType("decimal(18,2)");

        builder.Property(x => x.Total)
               .HasColumnType("decimal(18,2)");
    }
}