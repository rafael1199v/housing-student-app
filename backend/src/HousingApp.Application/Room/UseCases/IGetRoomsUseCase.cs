using HousingApp.Application.Room.DTO;

namespace HousingApp.Application.Room.UseCases
{
    public interface IGetRoomsUseCase
    {
        Task<List<RoomDto>> ExecuteAsync();
    }
}