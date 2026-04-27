using HousingApp.Application;
using HousingApp.Application.Auth.DTOs;
using HousingApp.Application.Auth.UseCases;
using Microsoft.AspNetCore.Mvc;

namespace HousingApp.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(IConfirmEmailUseCase confirmEmailUseCase) : ControllerBase
{
    [HttpPatch("confirm-email")]
    public async Task<IActionResult> ConfirmEmail(ConfirmEmailDto confirmEmailDto)
    {
        Result<bool> result = await confirmEmailUseCase.ExecuteAsync(confirmEmailDto.UserId, confirmEmailDto.Token);

        if (!result.IsSuccess)
            return BadRequest(result.Error);

        return NoContent();
    }
}
