using HousingApp.Application;
using HousingApp.Application.Auth.DTOs;
using HousingApp.Application.Auth.UseCases;
using Microsoft.AspNetCore.Mvc;

namespace HousingApp.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RegisterController(IRegisterUseCase registerUseCase) : ControllerBase
    {
        [HttpPost]
        public async Task<IActionResult> RegisterUser([FromBody] RegisterDto registerDto)
        {
            try
            {
                Result<string> result = await registerUseCase.ExecuteAsync(registerDto);

                if (!result.IsSuccess)
                    return BadRequest(result.Error);

                return Ok(new { userId = result.Value });
            }
            catch (Exception e)
            {
                return BadRequest(new { message = e.Message });
            }
           
        }
        
    }
}