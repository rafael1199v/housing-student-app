using HousingApp.Application.Room.DTOs;

namespace HousingApp.Application.Room.UseCases;

public interface ICreateRoomUseCase
{
    Task<Result<CreatedRoomDto>> ExecuteAsync(string userId, CreateRoomDto createRoomDto,
        CancellationToken cancellationToken);
}
