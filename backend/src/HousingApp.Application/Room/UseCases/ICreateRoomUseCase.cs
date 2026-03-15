using HousingApp.Application.Room.DTO;

namespace HousingApp.Application.Room.UseCases
{
    public interface ICreateRoomUseCase
    {
        Task<Result<CreatedRoomDto>> ExecuteAsync(string userId, CreateRoomDto createRoomDto);
    }
}
