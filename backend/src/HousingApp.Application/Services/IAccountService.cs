namespace HousingApp.Application.Services;

public interface IAccountService
{
    string GenerateEmailConfirmationLinkAsync(string userId, string token);
}
