using HousingApp.Application.Room.DTOs;

namespace HousingApp.Application.Room.UseCases;

public interface IGetRoomsUseCase
{
    Task<Result<List<RoomDto>>> ExecuteAsync(SearchRoomsFiltersDto filters);
}
