using HousingApp.Application;
using HousingApp.Application.Dashboard.DTOs;
using HousingApp.Application.Dashboard.UseCases;
using HousingApp.Application.Roles;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace HousingApp.Api.Controllers;

[ApiController]
[Route("api/dashboard")]
public class DashboardController(IGetDashboardSummaryUseCase getDashboardSummaryUseCase) : ControllerBase
{
    [HttpGet("summary")]
    [Authorize(Roles = RolesDescription.Householder)]
    [ProducesResponseType(typeof(DashboardSummaryDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GetSummary()
    {
        string? userId = User.FindFirstValue(JwtRegisteredClaimNames.Sub);
        if (string.IsNullOrWhiteSpace(userId))
        {
            return Unauthorized();
        }

        Result<DashboardSummaryDto> result = await getDashboardSummaryUseCase.ExecuteAsync(userId);

        if (!result.IsSuccess)
        {
            return BadRequest(result.Error);
        }

        return Ok(result.Value);
    }
}
