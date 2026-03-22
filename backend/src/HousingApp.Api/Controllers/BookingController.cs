using HousingApp.Application;
using HousingApp.Application.Booking.DTO;
using HousingApp.Application.Booking.UseCases;
using HousingApp.Application.Roles;
using HousingApp.Application.Room.UseCases;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.JsonWebTokens;
using System.Security.Claims;

namespace HousingApp.Api.Controllers
{
    [ApiController]
    [Route("api/bookings")]
    public class BookingController(ICreateBookingUseCase createBookingUseCase, IApproveBookingUseCase approveBookingUseCase, IRoomAlreadyBookedUseCase roomAlreadyBookedUseCase, IDeleteBookingUseCase deleteBookingUseCase) : ControllerBase
    {
        [HttpPost]
        [Authorize(Roles = RolesDescription.Student)]
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

        [HttpPut("approve/{bookingId:int}")]
        [Authorize(Roles = RolesDescription.Householder)]
        public async Task<IActionResult> ApproveBooking(int bookingId)
        {
            try
            {
                Result<bool> result = await approveBookingUseCase.ExecuteAsync(bookingId);

                if (!result.IsSuccess)
                    return BadRequest(result.Error);

                return Ok(result.Value);
            }
            catch
            {
                return BadRequest(new { message = "Hubo un error al aprobar la reservacion. Intentalo otra vez." });
            }
        }


        [HttpGet("{roomId:int}")]
        [Authorize(Roles = RolesDescription.Student)]
        public async Task<IActionResult> GetUserHasAlreadyBooked(int roomId)
        {
            string? userId = User.FindFirstValue(JwtRegisteredClaimNames.Sub);

            if (string.IsNullOrWhiteSpace(userId))
                return Unauthorized();

            return Ok(await roomAlreadyBookedUseCase.ExecuteAsync(roomId, userId));
        }

        [HttpDelete("{roomId:int}")]
        [Authorize(Roles = RolesDescription.Student)]
        public async Task<IActionResult> DeleteBooking(int roomId)
        {
            string? userId = User.FindFirstValue(JwtRegisteredClaimNames.Sub);

            if (string.IsNullOrWhiteSpace(userId))
                return Unauthorized();

            Result<bool> result = await deleteBookingUseCase.ExecuteAsync(roomId, userId);

            if (!result.IsSuccess)
                return BadRequest(result.Error);

            return NoContent();
        }
    }
}