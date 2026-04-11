using System;

namespace Core.Specifications;

using System.Linq.Expressions;

public class BaseSpecification<T>
{
    public Expression<Func<T, bool>> Criteria { get; }

    public Expression<Func<T, object>>? OrderBy { get; private set; }
    public Expression<Func<T, object>>? OrderByDescending { get; private set; }
    
    public int Skip { get; set; }
    public int Take { get; set; }
    public bool IsPagingEnabled { get; set; }

    public BaseSpecification(Expression<Func<T, bool>> criteria)
    {
        Criteria = criteria;
    }

    protected void AddOrderBy(Expression<Func<T, object>> orderByExpression)
    {
        OrderBy = orderByExpression;
    }

    protected void AddOrderByDescending(Expression<Func<T, object>> orderByDescExpression)
    {
        OrderByDescending = orderByDescExpression;
    }


    protected void ApplyPaging(int skip, int take, bool isPagingEnabled = true)
    {
        Skip = skip;
        Take = take;
        IsPagingEnabled = isPagingEnabled;
    }
}
