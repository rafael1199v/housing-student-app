using HousingApp.Application.Auth.DTOs;
using HousingApp.Application.Auth.UseCases;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;

namespace HousingApp.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoginController(ILoginUseCase loginUseCase, IConfiguration configuration): ControllerBase
    {
        [HttpPost]
        public async Task<IActionResult> Login([FromBody] LoginDto user)
        {
            try
            {
                UserDto userDto = await loginUseCase.Login(user);
                return Ok(new { token = GenerateToken(userDto) });
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
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
                ..user.Roles.Select(r => new Claim(ClaimTypes.Role, r))
            ];

            SecurityTokenDescriptor tokenDescriptor = new()
            {
                Subject =  new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(configuration.GetValue<int>("Jwt:ExpirationInMinutes")),
                SigningCredentials = credentials,
                Audience = configuration["Jwt:Audience"],
                Issuer = configuration["Jwt:Issuer"],
            };
            
            JsonWebTokenHandler tokenHandler = new();
            string accessToken = tokenHandler.CreateToken(tokenDescriptor);

            return accessToken;
        }
    }
}