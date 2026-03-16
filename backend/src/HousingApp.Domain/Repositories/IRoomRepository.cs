using HousingApp.Domain.Entities;

namespace HousingApp.Domain.Repositories
{
    public interface IRoomRepository
    {
        Task CreateRoomAsync(Room room);
        Task<List<Room>> GetRoomsAsync(RoomSearchFilters filters, int quantity = 20);
        Task<Room?> GetRoomByIdAsync(int roomId);
        Task<bool> TryMarkAsBookedAsync(int roomId);
        Task<bool> IsRoomAvailable(int roomId);

        Task<List<RoomHouseholder>> GetHouseholderRoomsAsync(string userId);
        Task<RoomHouseholderDetail?> GetHouseholderRoomsDetailsAsync(string householderId, int roomId);
    }
}