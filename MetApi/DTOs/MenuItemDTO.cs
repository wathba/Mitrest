using System;
using System.ComponentModel.DataAnnotations;

namespace MetApi.DTOs;

public class MenuItemDTO
{
    [Required]
    [StringLength(80)]
    public required string Name { get; set; }
    [Required]
    [StringLength(250)]
    public required string Description { get; set; }
    [Required]
    [Range(0.01, double.MaxValue)]
    [DataType(DataType.Currency)]
    public decimal Price { get; set; }
    [Required]
    public required string PictureUrl { get; set; }
    [Required]
    public required string Category { get; set; }

}

