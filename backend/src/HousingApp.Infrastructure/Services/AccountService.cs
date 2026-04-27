using HousingApp.Application.Services;
using Microsoft.Extensions.Configuration;

namespace HousingApp.Infrastructure.Services;

public class AccountService(IConfiguration configuration) : IAccountService
{
    public string GenerateEmailConfirmationLinkAsync(string userId, string token)
    {
        string clientBaseUrl = configuration["Frontend:Origin"] ?? throw new Exception("Frontend:Origin not found in configuration");
        return $"{clientBaseUrl}/confirm-email?userId={userId}&token={token}";
    }
}
