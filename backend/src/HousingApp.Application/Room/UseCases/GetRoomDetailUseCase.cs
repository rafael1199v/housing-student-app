using HousingApp.Application.Room.DTO;
using HousingApp.Application.Storage;
using HousingApp.Domain.Error;
using HousingApp.Domain.Repositories;
using System;

namespace HousingApp.Application.Room.UseCases;

public class GetRoomDetailUseCase(IRoomRepository roomRepository, IStorageService storageService) : IGetRoomDetailUseCase
{
    public async Task<Result<RoomDto>> ExecuteAsync(int roomId)
    {
        Domain.Entities.Room? room = await roomRepository.GetRoomByIdAsync(roomId);

        if (room is null)
            return Result<RoomDto>.Failure(RoomError.RoomNotFound);

        RoomDto roomDto = new RoomDto
            (
                Id: room.Id,
                Name: room.Name,
                Latitude: room.Latitude,
                Longitude: room.Longitude,
                Description: room.Description,
                Price: room.Price,
                PersonId: room.PersonId,
                RoomStatus: room.RoomStatus.ToString(),
                FirstName: room.Person!.FirstName,
                LastName: room.Person!.LastName,
                Email: room.Person!.Email,
                PhoneNumber: room.Person!.PhoneNumber,
                Nationality: room.Person!.Nationality,
                Age: room.Person!.Age,
                Gender: room.Person!.Gender,
                ImageUrl: room.Person!.ImageUrl ?? "",
                ImageRoomUrls: [.. room.ImageUrls.Select(imageKey => storageService.GeneratePresignedDownloadUrl(imageKey))]
            );

        return Result<RoomDto>.Success(roomDto);
    }
}