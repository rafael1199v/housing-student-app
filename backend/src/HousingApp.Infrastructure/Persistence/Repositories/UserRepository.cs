using HousingApp.Application.Repositories;
using HousingApp.Domain.Entities;
using HousingApp.Domain.Enums;
using Microsoft.AspNetCore.Identity;
using System.Buffers.Text;
using System.Text;

namespace HousingApp.Infrastructure.Persistence.Repositories;

public class UserRepository(UserManager<IdentityUser> userManager) : IUserRepository
{
    public async Task<string> RegisterUser(User newUser, Roles role)
    {
        IdentityUser user = ToModel(newUser);

        IdentityResult identityResult = await userManager.CreateAsync(user, newUser.Password!);

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
        {
            return null;
        }

        List<string> roles = [.. await userManager.GetRolesAsync(user)];
        return ToDomain(user, roles);
    }

    public async Task<bool> CheckPassword(string email, string password)
    {
        IdentityUser? user = await userManager.FindByEmailAsync(email) ??
                             throw new NullReferenceException("No se encontro el usuario");
        return await userManager.CheckPasswordAsync(user, password);
    }

    public async Task<User?> GetUserByIdAsync(string userId)
    {
        IdentityUser? user = await userManager.FindByIdAsync(userId);

        if (user == null)
        {
            return null;
        }

        List<string> roles = [.. await userManager.GetRolesAsync(user)];
        return ToDomain(user, roles);
    }

    public async Task<string> RegisterExternalUser(User newUser, Roles role)
    {
        IdentityUser user = ToModel(newUser);
        user.EmailConfirmed = true;

        IdentityResult identityResult = await userManager.CreateAsync(user);

        if (!identityResult.Succeeded)
        {
            throw new Exception("Error al crear el usuario");
        }

        IdentityResult addToRolResult = await userManager.AddToRoleAsync(user, role.ToString());

        return !addToRolResult.Succeeded ? throw new Exception("Error al crear el rol") : user.Id;
    }

    public async Task<string> GenerateEmailConfirmationToken(string userId)
    {
        IdentityUser identityUser = await userManager.FindByIdAsync(userId) ?? throw new InvalidOperationException("User not found.");
        string token = await userManager.GenerateEmailConfirmationTokenAsync(identityUser);
        return Base64Url.EncodeToString(Encoding.UTF8.GetBytes(token));
    }

    public async Task<bool> ConfirmEmail(string userId, string token)
    {
        IdentityUser identityUser = await userManager.FindByIdAsync(userId) ?? throw new InvalidOperationException("User not found.");
        string decodedToken = Encoding.UTF8.GetString(Base64Url.DecodeFromChars(token));
        IdentityResult result = await userManager.ConfirmEmailAsync(identityUser, decodedToken);

        return result.Succeeded;
    }


    private static User ToDomain(IdentityUser user, List<string> roles)
    {
        return User.CreateUser(
            user.Id,
            user.Email!,
            user.PasswordHash!,
            roles
        );
    }

    private static IdentityUser ToModel(User user)
    {
        return new IdentityUser { UserName = user.Email, Email = user.Email };
    }
}
