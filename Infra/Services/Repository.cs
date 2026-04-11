using Core.Specifications;
using Infra.Data;
using Microsoft.EntityFrameworkCore;

public class Repository<T> : IRepository<T> where T : class
{
    private readonly AppDbContext _context;
    private readonly DbSet<T> _dbSet;

    public Repository(AppDbContext context)
    {
        _context = context;
        _dbSet = context.Set<T>();
    }

    public async Task AddAsync(T entity)
    {
        await _dbSet.AddAsync(entity);
    }

    public async Task UpdateAsync(T entity)
    {
        _dbSet.Update(entity);
        await Task.CompletedTask;
    }

    public async Task DeleteAsync(T entity)
    {
        _dbSet.Remove(entity);
        await Task.CompletedTask;
    }

    public async Task<T> GetAsync(int id)
    {
        return await _dbSet.FindAsync(id) ?? throw new KeyNotFoundException();
    }

    public async Task<IEnumerable<T>> GetAllAsync()
    {
        return await _dbSet.ToListAsync();
    }

    public async Task<bool> DoesExistAsync(int id)
    {
        return await _dbSet.FindAsync(id) != null;
    }

    public async Task SaveAsync()
    {
        await _context.SaveChangesAsync();
    }
    public async Task<IEnumerable<T>> GetWithSpecAsync(BaseSpecification<T> spec)
    {
        return await SpecificationEvaluator<T>
            .GetQuery(_context.Set<T>().AsQueryable(), spec)
            .ToListAsync();
    }
    public async Task<int> CountAsync(BaseSpecification<T> spec)
    {
        var query = SpecificationEvaluator<T>.GetQuery(
            _context.Set<T>().AsQueryable(),
            spec
        );

        return await query.CountAsync();
    }
}