using System;
using System.ComponentModel.DataAnnotations;

namespace MetApi.DTOs;

public class MenuItemUpdateDTO
{
    public int Id { get; set; }
    [Required]
    [StringLength(80)]
    public required string Name { get; set; }

    [StringLength(250)]
    public string? Description { get; set; }

    [Range(0.01, double.MaxValue)]
    [DataType(DataType.Currency)]
    public decimal? Price { get; set; }

    public string? PictureUrl { get; set; }

    public string? Category { get; set; }

}
