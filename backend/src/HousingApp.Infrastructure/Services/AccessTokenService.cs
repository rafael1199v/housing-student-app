using HousingApp.Application.Auth.DTOs;
using HousingApp.Application.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;

namespace HousingApp.Infrastructure.Services;

public class AccessTokenService(IConfiguration configuration) : IAccessTokenService
{
    public string GenerateAccessToken(UserDto user)
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
        return tokenHandler.CreateToken(tokenDescriptor);
    }
}
