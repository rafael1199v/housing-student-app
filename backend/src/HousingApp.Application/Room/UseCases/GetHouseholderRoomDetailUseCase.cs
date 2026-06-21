using HousingApp.Application.Repositories;
using HousingApp.Application.Room.DTOs;
using HousingApp.Application.Storage;
using HousingApp.Domain.Entities;
using HousingApp.Domain.Error;

namespace HousingApp.Application.Room.UseCases;

public class GetHouseholderRoomDetailUseCase(IRoomRepository roomRepository, IStorageService storageService)
    : IGetHouseholderRoomDetailUseCase
{
    public async Task<Result<RoomHouseholderDetailDto>> ExecuteAsync(int roomId, string userId)
    {
        RoomHouseholderDetail? roomDetail = await roomRepository.GetHouseholderRoomsDetailsAsync(userId, roomId);

        if (roomDetail == null)
        {
            return Result<RoomHouseholderDetailDto>.Failure(RoomError.RoomNotFound);
        }

        List<RoomImageDto> images =
            [.. roomDetail.Images.Select(image => new RoomImageDto(image.Id, storageService.GeneratePresignedDownloadUrl(image.Key)))];

        RoomHouseholderDetailDto roomHouseholderDetail = new(
            roomDetail.Id,
            roomDetail.Name,
            roomDetail.Latitude,
            roomDetail.Longitude,
            roomDetail.Description,
            (decimal)roomDetail.Price,
            roomDetail.Status.ToString(),
            [.. images.Select(image => image.Url)],
            images,
            [.. roomDetail.ServiceCodes],
            [.. roomDetail.Policies.Select(policy => new RoomPolicyDto(policy.Code, policy.Description))],
            [
                ..roomDetail.Bookings.Select(b => new BookingDto(
                    b.Id,
                    b.BookerId,
                    $"{b.Booker!.FirstName} {b.Booker!.LastName}",
                    b.Booker!.Email,
                    b.Booker!.PhoneNumber ?? "",
                    b.BookingStatus.ToString(),
                    b.RoomId,
                    string.IsNullOrEmpty(b.Booker!.ImageUrl)
                        ? ""
                        : storageService.GeneratePresignedDownloadUrl(b.Booker!.ImageUrl)
                ))
            ]
        );

        return Result<RoomHouseholderDetailDto>.Success(roomHouseholderDetail);
    }
}
