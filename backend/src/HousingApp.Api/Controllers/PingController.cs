using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HousingApp.Api.Controllers
{
    [Route("api/ping")]
    [ApiController]
    public class PingController : ControllerBase
    {
        [HttpGet]
        public IActionResult Ping()
        {
            return Ok("Pong");
        }
    }
}