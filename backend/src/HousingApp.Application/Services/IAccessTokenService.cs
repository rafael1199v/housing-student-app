using HousingApp.Application.Auth.DTOs;

namespace HousingApp.Application.Services;

public interface IAccessTokenService
{
    string GenerateAccessToken(UserDto user);
}
