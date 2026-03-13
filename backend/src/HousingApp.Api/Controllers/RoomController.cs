using HousingApp.Application.Room.UseCases;
using Microsoft.AspNetCore.Mvc;

namespace HousingApp.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RoomController(IGetRoomsUseCase getRoomsUseCase) : ControllerBase
    {
        [HttpGet]
        public async Task<IActionResult> GetRooms()
        {
            return Ok(await getRoomsUseCase.ExecuteAsync());
        }
    }
}