using FluentValidation;
using FluentValidation.Results;
using HousingApp.Api.Requests;
using HousingApp.Application;
using HousingApp.Application.Roles;
using HousingApp.Application.Room.DTOs;
using HousingApp.Application.Room.Upload;
using HousingApp.Application.Room.UseCases;
using HousingApp.Domain.Error;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace HousingApp.Api.Controllers;

[ApiController]
[Route("api/rooms")]
public class RoomController(
    IGetRoomsUseCase getRoomsUseCase,
    IGetRoomDetailUseCase getRoomDetailUseCase,
    IGetHouseholderRoomsUseCase getHouseholderRoomsUseCase,
    ICreateRoomUseCase createRoomUseCase,
    IUpdateRoomUseCase updateRoomUseCase,
    IGetHouseholderRoomDetailUseCase getHouseholderRoomDetailUseCase,
    IValidator<CreateRoomRequest> validator,
    IValidator<UpdateRoomRequest> updateValidator) : ControllerBase
{
    [HttpGet]
    [Authorize(Roles = RolesDescription.Student + "," + RolesDescription.Householder)]
    [ProducesResponseType(typeof(List<RoomDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<RoomDto>> GetRooms([FromQuery] string? name, [FromQuery] string? minPrice,
        [FromQuery] string? maxPrice, [FromQuery] int[]? services)
    {
        HashSet<string> supportedFilters = new(StringComparer.OrdinalIgnoreCase) { "name", "minPrice", "maxPrice", "services" };

        string? unknownFilter = Request.Query.Keys.FirstOrDefault(key => !supportedFilters.Contains(key));
        if (!string.IsNullOrWhiteSpace(unknownFilter))
        {
            return BadRequest(RoomError.FilterDoesNotExist(unknownFilter));
        }

        if (!TryParseNullableDouble(minPrice, out double? parsedMinPrice))
        {
            return BadRequest(RoomError.InvalidFilterValue("minPrice"));
        }

        if (!TryParseNullableDouble(maxPrice, out double? parsedMaxPrice))
        {
            return BadRequest(RoomError.InvalidFilterValue("maxPrice"));
        }

        SearchRoomsFiltersDto filters = new(
            name,
            parsedMinPrice,
            parsedMaxPrice,
            services
        );

        Result<List<RoomDto>> result = await getRoomsUseCase.ExecuteAsync(filters);

        if (!result.IsSuccess)
        {
            return BadRequest(result.Error);
        }

        return Ok(result.Value);
    }

    [HttpPost]
    [Authorize(Roles = RolesDescription.Householder)]
    [Consumes("multipart/form-data")]
    [ProducesResponseType(typeof(CreatedRoomDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> CreateRoom([FromForm] CreateRoomRequest request,
        CancellationToken cancellationToken)
    {
        ValidationResult? validationResult = await validator.ValidateAsync(request, cancellationToken);

        if (!validationResult.IsValid)
        {
            return BadRequest(validationResult.Errors);
        }

        string? userId = User.FindFirstValue(JwtRegisteredClaimNames.Sub);
        if (string.IsNullOrWhiteSpace(userId))
        {
            return Unauthorized();
        }

        CreateRoomDto createRoomDto = GetCreateRoomDto(request);
        Result<CreatedRoomDto> result = await createRoomUseCase.ExecuteAsync(userId, createRoomDto, cancellationToken);

        if (!result.IsSuccess)
        {
            return BadRequest(result.Error);
        }

        return Ok(result.Value);
    }

    [HttpPut("{roomId:int}")]
    [Authorize(Roles = RolesDescription.Householder)]
    [Consumes("multipart/form-data")]
    [ProducesResponseType(typeof(CreatedRoomDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateRoom(int roomId, [FromForm] UpdateRoomRequest request,
        CancellationToken cancellationToken)
    {
        ValidationResult? validationResult = await updateValidator.ValidateAsync(request, cancellationToken);

        if (!validationResult.IsValid)
        {
            return BadRequest(validationResult.Errors);
        }

        string? userId = User.FindFirstValue(JwtRegisteredClaimNames.Sub);
        if (string.IsNullOrWhiteSpace(userId))
        {
            return Unauthorized();
        }

        UpdateRoomDto updateRoomDto = GetUpdateRoomDto(roomId, request);
        Result<CreatedRoomDto> result = await updateRoomUseCase.ExecuteAsync(userId, updateRoomDto, cancellationToken);

        if (!result.IsSuccess)
        {
            return BadRequest(result.Error);
        }

        return Ok(result.Value);
    }

    [HttpGet("{roomId}")]
    [Authorize(Roles = RolesDescription.Student)]
    [ProducesResponseType(typeof(RoomDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetRoomById(int roomId)
    {
        Result<RoomDto> result = await getRoomDetailUseCase.ExecuteAsync(roomId);

        if (!result.IsSuccess)
        {
            return BadRequest(result.Error);
        }

        return Ok(result.Value);
    }


    [HttpGet("householder")]
    [Authorize(Roles = RolesDescription.Householder)]
    [ProducesResponseType(typeof(List<RoomHouseholderDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetHouseholderRooms()
    {
        string? userId = User.FindFirstValue(JwtRegisteredClaimNames.Sub);
        if (string.IsNullOrWhiteSpace(userId))
        {
            return Unauthorized();
        }

        Result<List<RoomHouseholderDto>> result = await getHouseholderRoomsUseCase.ExecuteAsync(userId);

        if (!result.IsSuccess)
        {
            return BadRequest(result.Error);
        }

        return Ok(result.Value);
    }

    [HttpGet("householder/{roomId:int}")]
    [Authorize(Roles = RolesDescription.Householder)]
    [ProducesResponseType(typeof(RoomHouseholderDetailDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetHouseholderRoomDetail(int roomId)
    {
        string? userId = User.FindFirstValue(JwtRegisteredClaimNames.Sub);

        if (string.IsNullOrWhiteSpace(userId))
        {
            return Unauthorized();
        }

        Result<RoomHouseholderDetailDto> result = await getHouseholderRoomDetailUseCase.ExecuteAsync(roomId, userId);

        if (!result.IsSuccess)
        {
            return BadRequest(result.Error);
        }

        return Ok(result.Value);
    }

    private static CreateRoomDto GetCreateRoomDto(CreateRoomRequest request)
    {
        CreateRoomDto createRoomDto = new(
            request.Name,
            request.Description,
            request.Latitude,
            request.Longitude,
            request.Price,
            request.RoomStatusId,
            [
                .. request.Images.Select(image =>
                    new ImageRoomUpload(image.OpenReadStream, image.FileName, image.ContentType))
            ],
            Policies: request.Policies,
            Services: request.Services
        );

        return createRoomDto;
    }

    private static UpdateRoomDto GetUpdateRoomDto(int roomId, UpdateRoomRequest request)
    {
        UpdateRoomDto updateRoomDto = new(
            roomId,
            request.Name,
            request.Description,
            request.Latitude,
            request.Longitude,
            request.Price,
            request.RoomStatusId,
            [
                .. request.Images.Select(image =>
                    new ImageRoomUpload(image.OpenReadStream, image.FileName, image.ContentType))
            ],
            KeptImageIds: request.KeptImageIds,
            Policies: request.Policies,
            Services: request.Services
        );

        return updateRoomDto;
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
}
