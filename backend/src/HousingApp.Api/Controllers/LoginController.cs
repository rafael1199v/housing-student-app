using FluentValidation;
using FluentValidation.Results;
using HousingApp.Application;
using HousingApp.Application.Auth.DTOs;
using HousingApp.Application.Auth.UseCases;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;

namespace HousingApp.Api.Controllers;

[ApiController]
[Route("api/login")]
public class LoginController(ILoginUseCase loginUseCase, IConfiguration configuration, IValidator<LoginDto> validator)
    : ControllerBase
{
    [HttpPost]
    [ProducesResponseType(typeof(CredentialsDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> Login([FromBody] LoginDto user)
    {
        ValidationResult? validationResult = await validator.ValidateAsync(user);

        if (!validationResult.IsValid)
        {
            return BadRequest(validationResult.Errors);
        }

        Result<UserDto> result = await loginUseCase.Login(user);

        if (!result.IsSuccess)
        {
            return BadRequest(result.Error);
        }

        CredentialsDto credentials = new(GenerateToken(result.Value!));
        return Ok(credentials);
    }

    private string GenerateToken(UserDto user)
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
}
