using HousingApp.Application;
using HousingApp.Application.Auth.DTOs;
using HousingApp.Application.Auth.UseCases;
using Microsoft.AspNetCore.Mvc;

namespace HousingApp.Api.Controllers
{
    [ApiController]
    [Route("api/register")]
    public class RegisterController(IRegisterUseCase registerUseCase) : ControllerBase
    {
        [HttpPost]
        [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
        public async Task<IActionResult> RegisterUser([FromBody] RegisterDto registerDto)
        {
            Result<string> result = await registerUseCase.ExecuteAsync(registerDto);

            if (!result.IsSuccess)
                return BadRequest(result.Error);

            return Ok(new RegisterResponseDto(result.Value!));
        }

    }
}