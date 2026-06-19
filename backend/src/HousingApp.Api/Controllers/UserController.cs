using FluentValidation;
using FluentValidation.Results;
using HousingApp.Application;
using HousingApp.Application.Auth.DTOs;
using HousingApp.Application.Auth.Upload;
using HousingApp.Application.User.DTOs;
using HousingApp.Application.User.UseCases;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace HousingApp.Api.Controllers;

[ApiController]
[Route("api/user")]
public class UserController(
    IGetUserDataUseCase getUserDataUseCase,
    IUpdateUserDataUseCase updateUserDataUseCase,
    IAssignRoleToUserUseCase assignRoleToUserUseCase,
    IValidator<AssignRoleDto> assignRoleValidator,
    IUpdateAvatarUseCase updateAvatarUseCase
    ) : ControllerBase
{
    [HttpGet]
    [Authorize]
    [ProducesResponseType(typeof(UserDataDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<UserDataDto>> GetUserData()
    {
        string? userId = User.FindFirstValue(JwtRegisteredClaimNames.Sub);
        if (string.IsNullOrWhiteSpace(userId))
        {
            return Unauthorized();
        }
        Result<UserDataDto> result = await getUserDataUseCase.ExecuteAsync(userId);
        if (!result.IsSuccess)
        {
            return BadRequest(result.Error);
        }

        return Ok(result.Value);
    }

    [HttpPut]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UpdateUserData([FromBody] UpdateUserDTO updateUserDto)
    {

        string? userId = User.FindFirstValue(JwtRegisteredClaimNames.Sub);

        if (string.IsNullOrWhiteSpace(userId))
        {
            return Unauthorized();
        }

        Result<bool> result = await updateUserDataUseCase.ExecuteAsync(userId, updateUserDto);

        if (!result.IsSuccess)
        {
            return BadRequest(result.Error);
        }

        return NoContent();
    }

    [HttpPost("roles")]
    [Authorize]
    [ProducesResponseType(typeof(CredentialsDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> AssignRole([FromBody] AssignRoleDto dto)
    {
        string? userId = User.FindFirstValue(JwtRegisteredClaimNames.Sub);
        
        if (string.IsNullOrWhiteSpace(userId))
        {
            return Unauthorized();
        }
        ValidationResult validationResult = await assignRoleValidator.ValidateAsync(dto);

        if (!validationResult.IsValid)
        {
            return BadRequest(validationResult.Errors);
        }

        Result<CredentialsDto> result = await assignRoleToUserUseCase.ExecuteAsync(userId, dto);
        
        if (!result.IsSuccess)
        {
            return BadRequest(result.Error);
        }
        
        return Ok(result.Value);
    }
    [HttpPut("avatar")]
    [Authorize]
    [RequestSizeLimit(5 * 1024 * 1024)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateAvatar(IFormFile? file, CancellationToken cancellationToken)
    {
        string? userId = User.FindFirstValue(JwtRegisteredClaimNames.Sub);
        
        if (string.IsNullOrWhiteSpace(userId))
        {
            return Unauthorized();
        }
        
        if (file is null || file.Length == 0)
        {
            return BadRequest(Domain.Error.AvatarError.FileMissing);
        }

        AvatarUpload upload = new(file.OpenReadStream, file.FileName, file.ContentType);

        Result<string> result = await updateAvatarUseCase.ExecuteAsync(userId, upload, cancellationToken);

        if (!result.IsSuccess)
        {
            return BadRequest(result.Error);
        }
        
        return Ok(new { url = result.Value });
    }
}
