using HousingApp.Application.Room.DTOs;

namespace HousingApp.Application.Room.UseCases;

public interface IGetRoomServicesUseCase
{
    Task<Result<List<RoomServiceDto>>> ExecuteAsync();
}