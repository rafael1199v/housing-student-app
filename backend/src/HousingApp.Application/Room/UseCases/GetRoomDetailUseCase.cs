using HousingApp.Application.Repositories;
using HousingApp.Application.Room.DTOs;
using HousingApp.Application.Storage;
using HousingApp.Domain.Error;

namespace HousingApp.Application.Room.UseCases;

public class GetRoomDetailUseCase(IRoomRepository roomRepository, IStorageService storageService)
    : IGetRoomDetailUseCase
{
    public async Task<Result<RoomDto>> ExecuteAsync(int roomId)
    {
        Domain.Entities.Room? room = await roomRepository.GetRoomByIdAsync(roomId);

        if (room is null)
        {
            return Result<RoomDto>.Failure(RoomError.RoomNotFound);
        }

        RoomDto roomDto = new(
            room.Id,
            room.Name,
            room.Latitude,
            room.Longitude,
            room.Description,
            room.Price,
            room.PersonId,
            room.RoomStatus.ToString(),
            room.Person!.FirstName,
            room.Person!.LastName ?? "",
            room.Person!.Email,
            room.Person!.PhoneNumber ?? "",
            room.Person!.Nationality ?? "",
            room.Person!.Gender ?? "",
            room.Person!.ImageUrl ?? "",
            [.. room.ImageUrls.Select(imageKey => storageService.GeneratePresignedDownloadUrl(imageKey))]
        );

        return Result<RoomDto>.Success(roomDto);
    }
}
