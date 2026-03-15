using HousingApp.Application;
using HousingApp.Application.Booking.DTO;
using HousingApp.Application.Booking.UseCases;
using HousingApp.Application.Roles;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.JsonWebTokens;
using System.Security.Claims;

namespace HousingApp.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookingController(ICreateBookingUseCase createBookingUseCase) : ControllerBase
    {
        [HttpPost]
        public async Task<IActionResult> CreateBooking([FromBody] CreateBookingDto createBookingDto)
        {
            string? userId = User.FindFirstValue(JwtRegisteredClaimNames.Sub);
            
            if (string.IsNullOrWhiteSpace(userId))
                return Unauthorized();
            
            try
            {
                Result<CreatedBookingDto> result = await createBookingUseCase.ExecuteAsync(userId, createBookingDto);
            
                if (!result.IsSuccess)
                    return BadRequest(result.Error);
            
                return Ok(result.Value);
            }
            catch
            {
                return BadRequest(new { message = "Hubo un error al crear la reservacion. Intentalo otra vez" });
            }
        }
    }
}
