using HousingApp.Application.Repositories;

namespace HousingApp.Application.UnitOfWork;

public interface IChatUnitOfWork : IDisposable
{
    IChatRepository ChatRepository { get; }
    IPersonRepository PersonRepository { get; }

    Task<int> SaveChangesAsync();
    Task BeginTransactionAsync();
    Task CommitTransactionAsync();
    Task RollbackTransactionAsync();
}
