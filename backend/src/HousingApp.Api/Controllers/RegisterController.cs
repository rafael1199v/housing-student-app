using FluentValidation;
using FluentValidation.Results;
using HousingApp.Application;
using HousingApp.Application.Auth.DTOs;
using HousingApp.Application.Auth.UseCases;
using HousingApp.Application.Services;
using HousingApp.Domain.Error;
using Microsoft.AspNetCore.Mvc;

namespace HousingApp.Api.Controllers;

[ApiController]
[Route("api/register")]
public class RegisterController(IRegisterUseCase registerUseCase, IGoogleRegistrationUseCase googleRegistrationUseCase, IValidator<RegisterDto> validator, IRsaPasswordCipher passwordCipher) : ControllerBase
{
    [HttpPost]
    [ProducesResponseType(typeof(RegisterResponseDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> RegisterUser([FromBody] RegisterDto registerDto)
    {
        try
        {
            registerDto = registerDto with { Password = passwordCipher.Decrypt(registerDto.Password) };
        }
        catch
        {
            return BadRequest(RegisterError.InvalidPayload);
        }

        ValidationResult? validationResult = await validator.ValidateAsync(registerDto);

        if (!validationResult.IsValid)
            return BadRequest(validationResult.Errors);

        Result<string> result = await registerUseCase.ExecuteAsync(registerDto);

        if (!result.IsSuccess)
            return BadRequest(result.Error);

        return Ok(new RegisterResponseDto(result.Value!));
    }

    [HttpPost("google")]
    public async Task<IActionResult> RegisterUserWithGoogle([FromBody] GoogleRegisterDto googleRegisterDto)
    {
        Result<CredentialsDto> result = await googleRegistrationUseCase.ExecuteAsync(googleRegisterDto);

        if (!result.IsSuccess)
            return BadRequest(result.Error);

        return Ok(result.Value!);
    }
}
