using HousingApp.Application.Room.DTO;
using HousingApp.Domain.Entities;
using HousingApp.Domain.Error;
using HousingApp.Domain.Repositories;

namespace HousingApp.Application.Room.UseCases
{
    public class GetHouseholderRoomDetailUseCase(IRoomRepository roomRepository) : IGetHouseholderRoomDetailUseCase
    {
        public async Task<Result<RoomHouseholderDetailDto>> ExecuteAsync(int roomId, string userId)
        {
            RoomHouseholderDetail? roomDetail = await roomRepository.GetHouseholderRoomsDetailsAsync(userId, roomId);
            
            if (roomDetail == null)
            {
                return Result<RoomHouseholderDetailDto>.Failure(RoomError.RoomNotFound);
            }

            RoomHouseholderDetailDto roomHouseholderDetail = new(
                Id: roomDetail.Id,
                Name: roomDetail.Name,
                Latitude: roomDetail.Latitude,
                Longitude: roomDetail.Longitude,
                Description: roomDetail.Description,
                Price: (decimal)roomDetail.Price,
                RoomStatus: roomDetail.Status.ToString(),
                ImageRoomUrls: roomDetail.ImageRoomUrls,
                Bookings: [..roomDetail.Bookings.Select(b => new BookingDto(
                    Id: b.Id,
                    BookerId: b.BookerId,
                    BookerName: $"{b.Booker!.FirstName} {b.Booker!.LastName}",
                    BookerEmail: b.Booker!.Email,
                    BookingStatus: b.BookingStatus.ToString(),
                    RoomId: b.RoomId
                ))]
            );

            return Result<RoomHouseholderDetailDto>.Success(roomHouseholderDetail);
        }
    }
}