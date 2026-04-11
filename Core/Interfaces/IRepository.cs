using System.Collections.Generic;
using System.Threading.Tasks;
using Core.Specifications;

public interface IRepository<T> where T : class
{
    Task AddAsync(T entity);
    Task UpdateAsync(T entity);
    Task DeleteAsync(T entity);
    Task<T> GetAsync(int id);
    Task<IEnumerable<T>> GetAllAsync();
    Task<bool> DoesExistAsync(int id);
    Task SaveAsync();
    Task<IEnumerable<T>> GetWithSpecAsync(BaseSpecification<T> spec);
    Task<int> CountAsync(BaseSpecification<T> spec);
    


}