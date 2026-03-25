using HousingApp.Application.Repositories;
using HousingApp.Application.Room.DTO;
using HousingApp.Application.Storage;
using HousingApp.Domain.Entities;

namespace HousingApp.Application.Room.UseCases
{
    public class GetHouseholderRoomsUseCase(IRoomRepository roomRepository, IStorageService storageService) : IGetHouseholderRoomsUseCase
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
                ImageRoomUrls: [.. r.ImageRoomUrls.Select(imageKey => storageService.GeneratePresignedDownloadUrl(imageKey))]
            ))];

            return Result<List<RoomHouseholderDto>>.Success(roomHouseholderDtoList);
        }
    }
}