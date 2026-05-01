using HousingApp.Application;
using HousingApp.Application.Auth.DTOs;
using HousingApp.Application.Auth.UseCases;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace HousingApp.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(IConfirmEmailUseCase confirmEmailUseCase, ILogoutUseCase logoutUseCase) : ControllerBase
{
    [HttpPatch("confirm-email")]
    public async Task<IActionResult> ConfirmEmail(ConfirmEmailDto confirmEmailDto)
    {
        Result<bool> result = await confirmEmailUseCase.ExecuteAsync(confirmEmailDto.UserId, confirmEmailDto.Token);

        if (!result.IsSuccess)
            return BadRequest(result.Error);

        return NoContent();
    }

    [Authorize]
    [HttpDelete("logout")]
    public async Task<IActionResult> Logout()
    {
        string? userId = User.FindFirstValue(JwtRegisteredClaimNames.Sub);

        if (string.IsNullOrWhiteSpace(userId))
        {
            return Unauthorized();
        }

        Result<bool> result = await logoutUseCase.ExecuteAsync(userId);

        if(!result.IsSuccess)
        {
            return BadRequest(result.Error);
        }

        return NoContent();
    }
}
