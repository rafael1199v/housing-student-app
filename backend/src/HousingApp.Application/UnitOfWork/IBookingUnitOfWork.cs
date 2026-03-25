using HousingApp.Application.Repositories;

namespace HousingApp.Application.UnitOfWork
{
    public interface IBookingUnitOfWork : IDisposable
    {
        IRoomRepository RoomRepository { get; }
        IBookingRepository BookingRepository { get; }
        IPersonRepository PersonRepository { get; }

        Task<int> SaveChangesAsync();
        Task BeginTransactionAsync();
        Task CommitTransactionAsync();
        Task RollbackTransactionAsync();
    }
}