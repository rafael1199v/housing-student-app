using HousingApp.Application.Room.DTO;

namespace HousingApp.Application.Room.UseCases
{
    public interface IGetRoomsUseCase
    {
        Task<Result<List<RoomDto>>> ExecuteAsync(SearchRoomsFiltersDto filters);
    }
}