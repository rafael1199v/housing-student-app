using HousingApp.Application.UnitOfWork;
using HousingApp.Domain.Repositories;
using HousingApp.Infrastructure.Persistence.Context;
using HousingApp.Infrastructure.Persistence.Repositories;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore.Storage;

namespace HousingApp.Infrastructure.Persistence.UnitOfWork
{
    public class AuthUnitOfWork(HousingApplicationDbContext context, UserManager<IdentityUser> userManager): IAuthUnitOfWork
    {
        public IPersonRepository PersonRepository { get; } = new PersonRepository(context);
        public IUserRepository UserRepository { get; } = new UserRepository(userManager, context);
        private IDbContextTransaction? _transaction = null;
        
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
            {
                throw new NullReferenceException("There is no active transaction");
            }
            await this.SaveChangesAsync();
            await _transaction.CommitAsync();
        }

        public async Task RollbackTransactionAsync()
        {
            if (_transaction == null)
            {
                throw new NullReferenceException("There is no active transaction");
            }

            await _transaction.RollbackAsync();
            _transaction.Dispose();
            _transaction = null;
        }

        public void Dispose()
        {
            context.Dispose();
            GC.SuppressFinalize(this);
        }
    }
}