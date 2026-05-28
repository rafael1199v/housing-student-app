using HousingApp.Application.RoomService.DTOs;

namespace HousingApp.Application.Repositories;

public interface IServiceRepository
{
    Task<List<RoomServiceDto>> GetAllAsync();
}
