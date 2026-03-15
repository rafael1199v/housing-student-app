using HousingApp.Application.UnitOfWork;
using HousingApp.Domain.Repositories;
using HousingApp.Infrastructure.Persistence.Context;
using HousingApp.Infrastructure.Persistence.Repositories;
using Microsoft.EntityFrameworkCore.Storage;

namespace HousingApp.Infrastructure.Persistence.UnitOfWork
{
    public class RoomUnitOfWork(HousingApplicationDbContext context) : IRoomUnitOfWork
    {
        public IRoomRepository RoomRepository { get; } = new RoomRepository(context);
        public IPersonRepository PersonRepository { get; } = new PersonRepository(context);

        private IDbContextTransaction? _transaction;

        public async Task<int> SaveChangesAsync()
        {
            return await context.SaveChangesAsync();
        }

        public async Task BeginTransactionAsync()
        {
            _transaction = await context.Database.BeginTransactionAsync();
        }

        public async Task CommitTransactionAsync()
        {
            if (_transaction == null)
                throw new NullReferenceException("There is no active transaction");

            await SaveChangesAsync();
            await _transaction.CommitAsync();
        }

        public async Task RollbackTransactionAsync()
        {
            if (_transaction == null)
                return;

            await _transaction.RollbackAsync();
            await _transaction.DisposeAsync();
            _transaction = null;
        }

        public void Dispose()
        {
            context.Dispose();
            GC.SuppressFinalize(this);
        }
    }
}
