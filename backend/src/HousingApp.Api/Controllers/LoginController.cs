using FluentValidation;
using FluentValidation.Results;
using HousingApp.Api.Utils;
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

        CredentialsDto credentials = new(TokenHelpers.GenerateAccessToken(result.Value!, configuration), result.Value!.RefreshToken);
        return Ok(credentials);
    }

    [HttpPost]
    public async Task<IActionResult> LoginWithRefreshToken([FromBody] RefreshTokenDto refreshToken)
    {
        return Ok();
    }
}
