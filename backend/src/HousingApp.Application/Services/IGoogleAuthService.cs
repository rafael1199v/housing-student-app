using HousingApp.Application.Auth.DTOs;

namespace HousingApp.Application.Services;

public interface IGoogleAuthService
{
    Task<GoogleUserInfoDto?> ValidateAsync(string idToken);
}
