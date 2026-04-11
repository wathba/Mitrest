using System;
using Core.Entities;
using Core.Helpers;

namespace Core.Specifications;

public class MenuItemCountSpecification : BaseSpecification<MenuItem>
{
    public MenuItemCountSpecification(MenuItemParams param)
        : base(x =>
            (string.IsNullOrEmpty(param.Category) || x.Category == param.Category) &&
            
            (string.IsNullOrEmpty(param.Search) || x.Name.Contains(param.Search))
        )
    {
    }
}
