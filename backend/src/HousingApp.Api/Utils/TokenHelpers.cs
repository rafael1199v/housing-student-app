using HousingApp.Application.Auth.DTOs;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace HousingApp.Api.Utils;

public static class TokenHelpers
{
    public static string GenerateAccessToken(UserDto user, IConfiguration configuration)
    {
        SymmetricSecurityKey signInKey =
            new(Encoding.UTF8.GetBytes(configuration["Jwt:SecretKey"]!));

        SigningCredentials credentials = new(signInKey, SecurityAlgorithms.HmacSha256);

        List<Claim> claims =
        [
            new(JwtRegisteredClaimNames.Sub, user.Id),
            new(JwtRegisteredClaimNames.Email, user.Email),
            ..user.Roles.Select(r => new Claim("role", r))
        ];

        SecurityTokenDescriptor tokenDescriptor = new()
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddMinutes(configuration.GetValue<int>("Jwt:ExpirationInMinutes")),
            SigningCredentials = credentials,
            Audience = configuration["Jwt:Audience"],
            Issuer = configuration["Jwt:Issuer"]
        };

        JsonWebTokenHandler tokenHandler = new();
        string accessToken = tokenHandler.CreateToken(tokenDescriptor);

        return accessToken;
    }

    public static string GenerateRefreshToken()
    {
        return Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
    }

}
