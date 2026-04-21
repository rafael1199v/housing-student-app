using FluentValidation;
using FluentValidation.Results;
using HousingApp.Api.Utils;
using HousingApp.Application;
using HousingApp.Application.Auth.DTOs;
using HousingApp.Application.Auth.UseCases;
using Microsoft.AspNetCore.Mvc;

namespace HousingApp.Api.Controllers;

[ApiController]
[Route("api/login")]
public class LoginController(ILoginUseCase loginUseCase, IConfiguration configuration, ILoginWithRefreshTokenUseCase loginWithRefreshTokenUseCase, IValidator<LoginDto> validator)
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

    [HttpPost("refresh-token")]
    public async Task<IActionResult> LoginWithRefreshToken([FromBody] RefreshTokenDto refreshToken)
    {
        Result<UserDto> result = await loginWithRefreshTokenUseCase.ExecuteAsync(refreshToken);

        if (!result.IsSuccess)
        {
            return BadRequest(result.Error);
        }

        CredentialsDto credentials = new(TokenHelpers.GenerateAccessToken(result.Value!, configuration), result.Value!.RefreshToken);
        return Ok(credentials);
    }

    [HttpPost("google")]
    public async Task<IActionResult> LoginWithGoogle([FromBody] GoogleLoginDto googleLoginDto)
    {
        Console.WriteLine(googleLoginDto);
        return Ok();
    }
}
