using HousingApp.Domain.Repositories;

namespace HousingApp.Application.UnitOfWork
{
    public interface IRoomUnitOfWork : IDisposable
    {
        IRoomRepository RoomRepository { get; }
        IPersonRepository PersonRepository { get; }

        Task<int> SaveChangesAsync();
        Task BeginTransactionAsync();
        Task CommitTransactionAsync();
        Task RollbackTransactionAsync();
    }
}
