using System.Globalization;
using HousingApp.Application;
using HousingApp.Application.Roles;
using HousingApp.Application.Room.DTO;
using HousingApp.Application.Room.UseCases;
using HousingApp.Domain.Error;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace HousingApp.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RoomController(IGetRoomsUseCase getRoomsUseCase,
        IGetRoomDetailUseCase getRoomDetailUseCase,
        IGetHouseholderRoomsUseCase getHouseholderRoomsUseCase) : ControllerBase
    {
        [HttpGet]
        public async Task<IActionResult> GetRooms([FromQuery] string? name, [FromQuery] string? minPrice, [FromQuery] string? maxPrice)
        {
            HashSet<string> supportedFilters = new(StringComparer.OrdinalIgnoreCase)
            {
                "name",
                "minPrice",
                "maxPrice"
            };

            string? unknownFilter = Request.Query.Keys.FirstOrDefault(key => !supportedFilters.Contains(key));
            if (!string.IsNullOrWhiteSpace(unknownFilter))
                return BadRequest(RoomError.FilterDoesNotExist(unknownFilter));

            if (!TryParseNullableDouble(minPrice, out double? parsedMinPrice))
                return BadRequest(RoomError.InvalidFilterValue("minPrice"));

            if (!TryParseNullableDouble(maxPrice, out double? parsedMaxPrice))
                return BadRequest(RoomError.InvalidFilterValue("maxPrice"));

            SearchRoomsFiltersDto filters = new(
                Name: name,
                MinPrice: parsedMinPrice,
                MaxPrice: parsedMaxPrice
            );

            Result<List<RoomDto>> result = await getRoomsUseCase.ExecuteAsync(filters);

            if (!result.IsSuccess)
                return BadRequest(result.Error);

            return Ok(result.Value);
        }

        private static bool TryParseNullableDouble(string? value, out double? result)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                result = null;
                return true;
            }

            if (double.TryParse(value, NumberStyles.Float, CultureInfo.InvariantCulture, out double parsedValue))
            {
                result = parsedValue;
                return true;
            }

            result = null;
            return false;
        }

        [HttpGet("{roomId}")]
        public async Task<IActionResult> GetRoomById(int roomId)
        {
            Result<RoomDto> result = await getRoomDetailUseCase.ExecuteAsync(roomId);

            if(!result.IsSuccess) {
                return BadRequest(result.Error);
            }

            return Ok(result.Value);
        }


        [HttpGet("householder")]
        [Authorize(Roles = RolesDescription.Householder)]
        public async Task<IActionResult> GetHouseholderRooms()
        {
            string? userId = User.FindFirstValue(JwtRegisteredClaimNames.Sub);
            if (string.IsNullOrWhiteSpace(userId))
                return Unauthorized();
            
            try
            {
                Result<List<RoomHouseholderDto>> result = await getHouseholderRoomsUseCase.ExecuteAsync(userId);
                
                if (!result.IsSuccess)
                    return BadRequest(result.Error);
                
                return Ok(result.Value);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

    }
}