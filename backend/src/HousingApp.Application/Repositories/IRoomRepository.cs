using HousingApp.Domain.Entities;

namespace HousingApp.Application.Repositories;

public interface IRoomRepository
{
    Task<int> CreateRoomAsync(Domain.Entities.Room room);
    Task<List<Domain.Entities.Room>> GetRoomsAsync(RoomSearchFilters filters, int quantity = 20);
    Task<Domain.Entities.Room?> GetRoomByIdAsync(int roomId);
    Task<List<PolicyRaw>> GetPoliciesAsync();
    Task<List<ServiceRaw>> GetServicesAsync();
    Task<bool> TryMarkAsBookedAsync(int roomId);
    Task<bool> IsRoomAvailable(int roomId);

    Task AddImagesAsync(int roomId, List<string> imageKeys);

    Task<List<RoomHouseholder>> GetHouseholderRoomsAsync(string userId);
    Task<RoomHouseholderDetail?> GetHouseholderRoomsDetailsAsync(string householderId, int roomId);
}
