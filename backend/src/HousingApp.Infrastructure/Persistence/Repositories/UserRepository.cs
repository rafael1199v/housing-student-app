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
            
            IdentityResult identityResult = await userManager.CreateAsync(user,  newUser.Password);
            
            if (!identityResult.Succeeded)
            {
                throw new Exception("Error al crear el usuario");
            }
            
            IdentityResult addToRolResult = await userManager.AddToRoleAsync(user, role.ToString());
            
            return !addToRolResult.Succeeded ? throw new Exception("Error al crear el rol") : user.Id;
        }

        public async Task<User?> FindUserByEmailAsync(string email)
        {
            IdentityUser? user = await userManager.FindByEmailAsync(email);
            
            if (user == null)
                return null;
            
            List<string> roles = [..(await userManager.GetRolesAsync(user))];
            return ToDomain(user, roles);
        }

        public async Task<bool> CheckPassword(string email, string password)
        {
            IdentityUser? user = await userManager.FindByEmailAsync(email) ?? throw new NullReferenceException("No se encontro el usuario");
            return await userManager.CheckPasswordAsync(user, password);
        }


        private static User ToDomain(IdentityUser user, List<string> roles)
        {
            return User.CreateUser(
                uuid: user.Id,
                email: user.Email!,
                password: user.PasswordHash!,
                roles: roles
            );
        }
    }
}