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
                return Ok(await registerUseCase.ExecuteAsync(registerDto));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        
    }
}