using HousingApp.Domain.Entities;

namespace HousingApp.Domain.Repositories
{
    public interface IRoomRepository
    {
        Task<List<Room>> GetRoomsAsync(RoomSearchFilters filters, int quantity = 20);
        Task<Room?> GetRoomByIdAsync(int roomId);
        Task<bool> TryMarkAsBookedAsync(int roomId);
        Task<bool> IsRoomAvailable(int roomId);
    }
}