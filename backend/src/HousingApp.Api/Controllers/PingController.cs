using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HousingApp.Api.Controllers
{
    [Route("api/ping")]
    [ApiController]
    public class PingController : ControllerBase
    {
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult Ping()
        {
            return Ok("Pong");
        }
    }
}