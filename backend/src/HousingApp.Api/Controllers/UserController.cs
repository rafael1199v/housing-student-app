using FluentValidation;
using FluentValidation.Results;
using HousingApp.Application;
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
    IUpdateUserDataUseCase updateUserDataUseCase
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
}
