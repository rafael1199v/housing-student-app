namespace HousingApp.Application.Services;

public interface IAccountService
{
    string GenerateEmailConfirmationLinkAsync(string email, string token);
}
