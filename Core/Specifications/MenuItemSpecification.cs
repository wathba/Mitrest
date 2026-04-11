using System;
using Core.Entities;
using Core.Helpers;

namespace Core.Specifications;

public class MenuItemSpecification : BaseSpecification<MenuItem>
{
    public MenuItemSpecification(MenuItemParams param)
        : base(x =>
            (string.IsNullOrEmpty(param.Category) || x.Category.ToLower() == param.Category.ToLower()) &&
            (string.IsNullOrEmpty(param.Search) || x.Name.ToLower().Contains(param.Search.ToLower()))
        )
    {
        
        ApplyPaging(
            (param.PageIndex - 1) * param.PageSize,
            param.PageSize
        );

       
        if (!string.IsNullOrEmpty(param.Sort))
        {
            switch (param.Sort)
            {
                case "priceAsc":
                    AddOrderBy(x => x.Price);
                    break;

                case "priceDesc":
                    AddOrderByDescending(x => x.Price);
                    break;

                default:
                    AddOrderBy(x => x.Name);
                    break;
            }
        }
        else
        {
            AddOrderBy(x => x.Name);
        }
    }
}