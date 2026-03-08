using HousingApp.Application.Roles;
using HousingApp.Domain.Entities;
using HousingApp.Domain.Enums;
using HousingApp.Domain.Repositories;
using HousingApp.Infrastructure.Persistence.Context;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore.Storage;

namespace HousingApp.Infrastructure.Persistence.Repositories
{
    public class UserRepository(UserManager<IdentityUser> userManager, HousingApplicationDbContext context) : IUserRepository
    {
        public async Task<string> RegisterUser(User newUser, Roles role)
        {
            IdentityUser user = new() { UserName = newUser.Email, Email = newUser.Email, };

            //await using IDbContextTransaction transaction = await context.Database.BeginTransactionAsync();
            
            IdentityResult identityResult = await userManager.CreateAsync(user,  newUser.Password);

            if (!identityResult.Succeeded)
            {
                throw new Exception("Error al crear el usuario");
            }
            
            IdentityResult addToRolResult = await userManager.AddToRoleAsync(user, role.ToString());
    
            //await transaction.CommitAsync();
            
            return !addToRolResult.Succeeded ? throw new Exception("Error al crear el rol") : user.Id;
        }
    }
}