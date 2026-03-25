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
    public class BookingController(ICreateBookingUseCase createBookingUseCase, IApproveBookingUseCase approveBookingUseCase, IRoomAlreadyBookedUseCase roomAlreadyBookedUseCase, IDeleteBookingUseCase deleteBookingUseCase, IGetStudentBookingsUseCase getStudentBookingsUseCase) : ControllerBase
    {

        [HttpGet]
        [Authorize(Roles = RolesDescription.Student)]
        [ProducesResponseType(typeof(List<BookingStudentDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetStudentBookings()
        {
            string? userId = User.FindFirstValue(JwtRegisteredClaimNames.Sub);

            if (string.IsNullOrWhiteSpace(userId))
                return Unauthorized();

            Result<List<BookingStudentDto>> bookings = await getStudentBookingsUseCase.ExecuteAsync(userId);

            if (!bookings.IsSuccess)
                return BadRequest(bookings.Error);

            return Ok(bookings.Value);
        }

        [HttpPost]
        [Authorize(Roles = RolesDescription.Student)]
        [ProducesResponseType(typeof(CreatedBookingDto), StatusCodes.Status200OK)]
        public async Task<IActionResult> CreateBooking([FromBody] CreateBookingDto createBookingDto)
        {
            string? userId = User.FindFirstValue(JwtRegisteredClaimNames.Sub);

            if (string.IsNullOrWhiteSpace(userId))
                return Unauthorized();

            Result<CreatedBookingDto> result = await createBookingUseCase.ExecuteAsync(userId, createBookingDto);

            if (!result.IsSuccess)
                return BadRequest(result.Error);

            return Ok(result.Value);
        }

        [HttpPut("approve/{bookingId:int}")]
        [Authorize(Roles = RolesDescription.Householder)]
        [ProducesResponseType(typeof(bool), StatusCodes.Status200OK)]
        public async Task<IActionResult> ApproveBooking(int bookingId)
        {

            Result<bool> result = await approveBookingUseCase.ExecuteAsync(bookingId);

            if (!result.IsSuccess)
                return BadRequest(result.Error);

            return Ok(result.Value);
        }


        [HttpGet("{roomId:int}")]
        [Authorize(Roles = RolesDescription.Student)]
        [ProducesResponseType(typeof(bool), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetUserHasAlreadyBooked(int roomId)
        {
            string? userId = User.FindFirstValue(JwtRegisteredClaimNames.Sub);

            if (string.IsNullOrWhiteSpace(userId))
                return Unauthorized();

            return Ok(await roomAlreadyBookedUseCase.ExecuteAsync(roomId, userId));
        }

        [HttpDelete("{roomId:int}")]
        [Authorize(Roles = RolesDescription.Student)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
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