using FluentValidation;
using FluentValidation.Results;
using HousingApp.Application;
using HousingApp.Application.Auth.DTOs;
using HousingApp.Application.Auth.UseCases;
using Microsoft.AspNetCore.Mvc;

namespace HousingApp.Api.Controllers;

[ApiController]
[Route("api/login")]
public class LoginController(ILoginUseCase loginUseCase, ILoginWithRefreshTokenUseCase loginWithRefreshTokenUseCase, IGoogleLoginUseCase googleLoginUseCase, IValidator<LoginDto> validator)
    : ControllerBase
{
    [HttpPost]
    [ProducesResponseType(typeof(CredentialsDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> Login([FromBody] LoginDto user)
    {
        ValidationResult? validationResult = await validator.ValidateAsync(user);

        if (!validationResult.IsValid)
            return BadRequest(validationResult.Errors);

        Result<CredentialsDto> result = await loginUseCase.Login(user);

        if (!result.IsSuccess)
            return BadRequest(result.Error);

        return Ok(result.Value!);
    }

    [HttpPost("refresh-token")]
    public async Task<IActionResult> LoginWithRefreshToken([FromBody] RefreshTokenDto refreshToken)
    {
        Result<CredentialsDto> result = await loginWithRefreshTokenUseCase.ExecuteAsync(refreshToken);

        if (!result.IsSuccess)
            return BadRequest(result.Error);

        return Ok(result.Value!);
    }

    [HttpPost("google")]
    public async Task<IActionResult> LoginWithGoogle([FromBody] GoogleLoginDto googleLoginDto)
    {
        Result<GoogleAuthDto> result = await googleLoginUseCase.ExecuteAsync(googleLoginDto);

        if (!result.IsSuccess)
            return BadRequest(result.Error);

        return Ok(result.Value!.IsNewUser
            ? new GoogleAuthResponseDto(result.Value!.IsNewUser)
            : new GoogleAuthResponseDto(result.Value!.IsNewUser, result.Value!.Credentials));
    }
}
