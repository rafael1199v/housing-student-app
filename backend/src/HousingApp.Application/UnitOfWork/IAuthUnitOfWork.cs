using HousingApp.Domain.Repositories;

namespace HousingApp.Application.UnitOfWork
{
    public interface IAuthUnitOfWork : IDisposable
    {
        IUserRepository UserRepository { get; }
        IPersonRepository PersonRepository { get; }

        Task<int> SaveChangesAsync();
        Task BeginTransactionAsync();
        Task CommitTransactionAsync();
        Task RollbackTransactionAsync();
    }
}