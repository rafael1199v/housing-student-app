using HousingApp.Application.Room.DTO;

namespace HousingApp.Application.Room.UseCases;

public interface IGetRoomDetailUseCase
{
    Task<Result<RoomDto>> ExecuteAsync(int roomId);
}
