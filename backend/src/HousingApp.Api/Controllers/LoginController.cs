using FluentValidation;
using FluentValidation.Results;
using HousingApp.Api.Utils;
using HousingApp.Application;
using HousingApp.Application.Auth.DTOs;
using HousingApp.Application.Auth.UseCases;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;

namespace HousingApp.Api.Controllers;

[ApiController]
[Route("api/login")]
public class LoginController(ILoginUseCase loginUseCase, IConfiguration configuration, ILoginWithRefreshTokenUseCase loginWithRefreshTokenUseCase, IGoogleLoginUseCase googleLoginUseCase, IValidator<LoginDto> validator)
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

        return Ok(TokenHelpers.GenerateCredentials(result.Value!, configuration));
    }

    [HttpPost("refresh-token")]
    public async Task<IActionResult> LoginWithRefreshToken([FromBody] RefreshTokenDto refreshToken)
    {
        Result<UserDto> result = await loginWithRefreshTokenUseCase.ExecuteAsync(refreshToken);

        if (!result.IsSuccess)
        {
            return BadRequest(result.Error);
        }

        return Ok(TokenHelpers.GenerateCredentials(result.Value!, configuration));
    }

    [HttpPost("google")]
    public async Task<IActionResult> LoginWithGoogle([FromBody] GoogleLoginDto googleLoginDto)
    {
        Result<GoogleAuthDto> result = await googleLoginUseCase.ExecuteAsync(googleLoginDto);

        if (!result.IsSuccess)
        {   
            return BadRequest(result.Error);
        }

        return Ok(result.Value!.IsNewUser ?
            new GoogleAuthResponseDto(result.Value!.IsNewUser) : new GoogleAuthResponseDto(result.Value!.IsNewUser, TokenHelpers.GenerateCredentials(result.Value!.UserDto!, configuration)));
    }
}
