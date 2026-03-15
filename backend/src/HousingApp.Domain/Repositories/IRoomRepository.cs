using HousingApp.Domain.Entities;

namespace HousingApp.Domain.Repositories
{
    public interface IRoomRepository
    {
        Task<List<Room>> GetRoomsAsync(RoomSearchFilters filters, int quantity = 20);
    }
}