using HousingApp.Application.Room.DTOs;

namespace HousingApp.Application.Room.UseCases;

public interface IUpdateRoomUseCase
{
    Task<Result<CreatedRoomDto>> ExecuteAsync(string userId, UpdateRoomDto updateRoomDto,
        CancellationToken cancellationToken);
}
