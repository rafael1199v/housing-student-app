using FluentValidation;
using FluentValidation.Results;
using HousingApp.Api.Utils;
using HousingApp.Application;
using HousingApp.Application.Auth.DTOs;
using HousingApp.Application.Auth.UseCases;
using Microsoft.AspNetCore.Mvc;

namespace HousingApp.Api.Controllers;

[ApiController]
[Route("api/register")]
public class RegisterController(IRegisterUseCase registerUseCase, IGoogleRegistrationUseCase googleRegistrationUseCase, IValidator<RegisterDto> validator, IConfiguration configuration) : ControllerBase
{
    [HttpPost]
    [ProducesResponseType(typeof(RegisterResponseDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> RegisterUser([FromBody] RegisterDto registerDto)
    {
        ValidationResult? validationResult = await validator.ValidateAsync(registerDto);

        if (!validationResult.IsValid)
        {
            return BadRequest(validationResult.Errors);
        }

        Result<string> result = await registerUseCase.ExecuteAsync(registerDto);

        if (!result.IsSuccess)
        {
            return BadRequest(result.Error);
        }

        return Ok(new RegisterResponseDto(result.Value!));
    }


    [HttpPost("google")]
    public async Task<IActionResult> RegisterUserWithGoogle([FromBody] GoogleRegisterDto googleRegisterDto)
    {
        Result<UserDto> result = await googleRegistrationUseCase.ExecuteAsync(googleRegisterDto);

        if (!result.IsSuccess)
        {
            return BadRequest(result.Error);
        }

        return Ok(TokenHelpers.GenerateCredentials(result.Value!, configuration));
    }
}
