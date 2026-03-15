using HousingApp.Application.Room.DTO;
using HousingApp.Domain.Entities;
using HousingApp.Domain.Repositories;

namespace HousingApp.Application.Room.UseCases
{
    public class GetHouseholderRoomsUseCase(IRoomRepository roomRepository) : IGetHouseholderRoomsUseCase
    {
        public async Task<Result<List<RoomHouseholderDto>>> ExecuteAsync(string userId)
        {
            List<RoomHouseholder> roomHouseholderEntities = await roomRepository.GetHouseholderRoomsAsync(userId);

            List<RoomHouseholderDto> roomHouseholderDtoList = [.. roomHouseholderEntities.Select(r => new RoomHouseholderDto(
                Id: r.Id,
                Name: r.Name,
                Description: r.Description,
                Latitude: r.Latitude,
                Longitude: r.Longitude,
                Price: r.Price,
                RoomStatus: r.Status.ToString(),
                BookingRequests: r.BookingRequests,
                ImageRoomUrls: r.ImageRoomUrls
            ))];

            return Result<List<RoomHouseholderDto>>.Success(roomHouseholderDtoList);
        }
    }
}