using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Core.Entities;

public class OrderItemConfiguration : IEntityTypeConfiguration<OrderItem>
{
    public void Configure(EntityTypeBuilder<OrderItem> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.ItemId)
               .IsRequired()
               .HasMaxLength(100);

        builder.Property(x => x.Price)
               .HasColumnType("decimal(18,2)");

   
    }
}