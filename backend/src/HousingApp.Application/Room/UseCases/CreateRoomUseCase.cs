using HousingApp.Application.Room.DTOs;
using HousingApp.Application.Room.Upload;
using HousingApp.Application.Storage;
using HousingApp.Application.UnitOfWork;
using HousingApp.Domain.Entities;
using HousingApp.Domain.Enums;
using HousingApp.Domain.Error;

namespace HousingApp.Application.Room.UseCases;

public class CreateRoomUseCase(IRoomUnitOfWork unitOfWork, IStorageService storageService) : ICreateRoomUseCase
{
    public async Task<Result<CreatedRoomDto>> ExecuteAsync(string userId, CreateRoomDto createRoomDto,
        CancellationToken cancellationToken)
    {

        if (!await unitOfWork.PersonRepository.ExistsByUserIdAsync(userId))
            return Result<CreatedRoomDto>.Failure(RoomError.HouseholderNotFound);

        if (string.IsNullOrWhiteSpace(createRoomDto.Name))
            return Result<CreatedRoomDto>.Failure(RoomError.InvalidName);

        if (string.IsNullOrWhiteSpace(createRoomDto.Description))
            return Result<CreatedRoomDto>.Failure(RoomError.InvalidDescription);

        if (createRoomDto.Price <= 0)
            return Result<CreatedRoomDto>.Failure(RoomError.InvalidPrice);

        if (createRoomDto.Latitude is < -90 or > 90)
            return Result<CreatedRoomDto>.Failure(RoomError.InvalidLatitude);

        if (createRoomDto.Longitude is < -180 or > 180)
            return Result<CreatedRoomDto>.Failure(RoomError.InvalidLongitude);

        if (!Enum.IsDefined(typeof(RoomStatus), createRoomDto.RoomStatusId) || (RoomStatus)createRoomDto.RoomStatusId is RoomStatus.Booked)
            return Result<CreatedRoomDto>.Failure(RoomError.InvalidRoomStatus);

        if (HasNonImageFiles(createRoomDto.Images))
            return Result<CreatedRoomDto>.Failure(RoomError.InvalidImageType);

        if (createRoomDto.Images.Count > Images.MaxImagesAllowed)
            return Result<CreatedRoomDto>.Failure(RoomError.MaxImagesExceeded(Images.MaxImagesAllowed));

        Domain.Entities.Room room = Domain.Entities.Room.Create(
            name: createRoomDto.Name,
            description: createRoomDto.Description,
            latitude: createRoomDto.Latitude,
            longitude: createRoomDto.Longitude,
            price: createRoomDto.Price,
            roomStatusId: createRoomDto.RoomStatusId,
            personId: userId,
            services: [.. createRoomDto.Services.Select(s => s.Id)],
            policies: [.. createRoomDto.Policies.Select(p => new Domain.Entities.Policy { Id = p.Id, Description = p.Description })]
        );

        await unitOfWork.BeginTransactionAsync();

        try
        {
            int roomId = await unitOfWork.RoomRepository.CreateRoomAsync(room);

            IEnumerable<Task<string>> uploadTasks =
                createRoomDto.Images.Select(image =>
                    storageService.UploadAsync(
                        image.OpenStream,
                        image.FileName,
                        image.ContentType,
                        StorageType.Room,
                        entityId: roomId.ToString(),
                        cancellationToken
                    )
                );

            string[] keys = await Task.WhenAll(uploadTasks);

            await unitOfWork.RoomRepository.AddImagesAsync(roomId, [.. keys]);
            await unitOfWork.CommitTransactionAsync();

            CreatedRoomDto response = new(
                Name: room.Name,
                Description: room.Description,
                Latitude: room.Latitude,
                Longitude: room.Longitude,
                Price: room.Price,
                RoomStatus: room.RoomStatus.ToString(),
                ImageRoomUrls: [.. keys],
                Policies: createRoomDto.Policies,
                Services: createRoomDto.Services
            );

            return Result<CreatedRoomDto>.Success(response);
        }
        catch
        {
            await unitOfWork.RollbackTransactionAsync();
            throw;
        }

    }


    private static bool HasNonImageFiles(List<ImageRoomUpload> images)
    {
        return images.Any(image =>
            string.IsNullOrWhiteSpace(image.ContentType)
            || !image.ContentType.StartsWith("image/", StringComparison.OrdinalIgnoreCase));
    }
}
