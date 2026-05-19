using HousingApp.Application.Room.DTOs;

namespace HousingApp.Application.Room.UseCases;

public interface IGetHouseholderRoomDetailUseCase
{
    Task<Result<RoomHouseholderDetailDto>> ExecuteAsync(int roomId, string userId);
}
