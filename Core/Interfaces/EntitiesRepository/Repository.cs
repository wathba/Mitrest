using System;
using Core.Entities;

namespace Core.Interfaces.EntitiesRepository;

public class IRepository<T> where T : class
{
    public void Add(T entity)
    {
        throw new NotImplementedException();
    }

    public void Delete(T entity)
    {
        throw new NotImplementedException();
    }

    public void DoesExist(int id)
    {
        throw new NotImplementedException();
    }

    public T Get(int id)
    {
        throw new NotImplementedException();
    }

    public IEnumerable<T> GetAll()
    {
        throw new NotImplementedException();
    }

    public void Save()
    {
        throw new NotImplementedException();
    }

    public void Update(T entity)
    {
        throw new NotImplementedException();
    }
}
