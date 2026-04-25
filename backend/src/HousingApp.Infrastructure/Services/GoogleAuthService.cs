using Google.Apis.Auth;
using HousingApp.Application.Auth.DTOs;
using HousingApp.Application.Services;
using Microsoft.Extensions.Configuration;

namespace HousingApp.Infrastructure.Services;

public class GoogleAuthService(IConfiguration configuration) : IGoogleAuthService
{
    public async Task<GoogleUserInfoDto?> ValidateAsync(string idToken)
    {
        try
        {
            GoogleJsonWebSignature.ValidationSettings settings = new()
            {
                Audience =
                [
                    configuration["Google:ClientId"] ??
                    throw new Exception("The google client Id is not configured")
                ]
            };

            GoogleJsonWebSignature.Payload payload = await GoogleJsonWebSignature.ValidateAsync(idToken, settings);

            return new GoogleUserInfoDto(
                Email: payload.Email,
                FullName: payload.Name,
                GivenName: payload.GivenName,
                FamilyName: payload.FamilyName,
                Picture: payload.Picture,
                GoogleId: payload.Subject
            );
        }
        catch
        {
            return null;
        }
    }
}
