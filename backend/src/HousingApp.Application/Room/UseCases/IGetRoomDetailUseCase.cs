using HousingApp.Application.Room.DTOs;

namespace HousingApp.Application.Room.UseCases;

public interface IGetRoomDetailUseCase
{
    Task<Result<RoomDto>> ExecuteAsync(int roomId);
}
