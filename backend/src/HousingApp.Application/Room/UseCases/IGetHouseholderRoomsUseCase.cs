using HousingApp.Application.Room.DTOs;

namespace HousingApp.Application.Room.UseCases;

public interface IGetHouseholderRoomsUseCase
{
    Task<Result<List<RoomHouseholderDto>>> ExecuteAsync(string userId);
}
