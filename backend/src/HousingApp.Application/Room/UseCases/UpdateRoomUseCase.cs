using HousingApp.Application.Policy.DTOs;
using HousingApp.Application.Repositories;
using HousingApp.Application.Room.DTOs;
using HousingApp.Application.Room.Upload;
using HousingApp.Application.RoomService.DTOs;
using HousingApp.Application.Storage;
using HousingApp.Application.UnitOfWork;
using HousingApp.Domain.Entities;
using HousingApp.Domain.Enums;
using HousingApp.Domain.Error;

namespace HousingApp.Application.Room.UseCases;

public class UpdateRoomUseCase(IRoomUnitOfWork unitOfWork, IStorageService storageService, IServiceRepository serviceRepository, IPolicyRepository policyRepository) : IUpdateRoomUseCase
{
    public async Task<Result<CreatedRoomDto>> ExecuteAsync(string userId, UpdateRoomDto updateRoomDto,
        CancellationToken cancellationToken)
    {
        RoomHouseholderDetail? existingRoom =
            await unitOfWork.RoomRepository.GetHouseholderRoomsDetailsAsync(userId, updateRoomDto.RoomId);

        if (existingRoom is null)
            return Result<CreatedRoomDto>.Failure(RoomError.RoomNotFound);

        if (string.IsNullOrWhiteSpace(updateRoomDto.Name))
            return Result<CreatedRoomDto>.Failure(RoomError.InvalidName);

        if (string.IsNullOrWhiteSpace(updateRoomDto.Description))
            return Result<CreatedRoomDto>.Failure(RoomError.InvalidDescription);

        if (updateRoomDto.Price <= 0)
            return Result<CreatedRoomDto>.Failure(RoomError.InvalidPrice);

        if (updateRoomDto.Latitude is < -90 or > 90)
            return Result<CreatedRoomDto>.Failure(RoomError.InvalidLatitude);

        if (updateRoomDto.Longitude is < -180 or > 180)
            return Result<CreatedRoomDto>.Failure(RoomError.InvalidLongitude);

        if (!Enum.IsDefined(typeof(RoomStatus), updateRoomDto.RoomStatusId) || (RoomStatus)updateRoomDto.RoomStatusId is RoomStatus.Booked)
            return Result<CreatedRoomDto>.Failure(RoomError.InvalidRoomStatus);

        if (HasNonImageFiles(updateRoomDto.NewImages))
            return Result<CreatedRoomDto>.Failure(RoomError.InvalidImageType);

        // Reconcile image ids against what actually exists for this room (ignore spoofed ids).
        HashSet<int> existingImageIds = [.. existingRoom.Images.Select(image => image.Id)];
        List<int> keptImageIds = [.. updateRoomDto.KeptImageIds.Where(existingImageIds.Contains)];
        List<string> removedImageKeys =
            [.. existingRoom.Images.Where(image => !keptImageIds.Contains(image.Id)).Select(image => image.Key)];

        if (keptImageIds.Count + updateRoomDto.NewImages.Count > Images.MaxImagesAllowed)
            return Result<CreatedRoomDto>.Failure(RoomError.MaxImagesExceeded(Images.MaxImagesAllowed));

        // Service and Policy validation
        List<ServiceDto> serviceDtoList = await serviceRepository.GetAllAsync();

        if (NotExistAllServices(updateRoomDto.Services, serviceDtoList))
            return Result<CreatedRoomDto>.Failure(RoomError.InvalidServiceType);

        List<PolicyDto> policyDtoList = await policyRepository.GetAllAsync();

        if (NotExistAllPolicies(updateRoomDto.Policies, policyDtoList))
            return Result<CreatedRoomDto>.Failure(RoomError.InvalidPolicyType);

        Domain.Entities.Room room = Domain.Entities.Room.Update(
            id: updateRoomDto.RoomId,
            name: updateRoomDto.Name,
            description: updateRoomDto.Description,
            latitude: updateRoomDto.Latitude,
            longitude: updateRoomDto.Longitude,
            price: updateRoomDto.Price,
            roomStatusId: updateRoomDto.RoomStatusId,
            personId: userId,
            services: [.. updateRoomDto.Services.Select(s => s.Id)],
            policies: [.. updateRoomDto.Policies.Select(p => new Domain.Entities.Policy { Id = p.Id, Description = p.Description })]
        );

        await unitOfWork.BeginTransactionAsync();

        try
        {
            await unitOfWork.RoomRepository.UpdateRoomAsync(room);
            await unitOfWork.RoomRepository.RemoveImagesAsync(existingImageIds.Where(id => !keptImageIds.Contains(id)));

            IEnumerable<Task<string>> uploadTasks =
                updateRoomDto.NewImages.Select(image =>
                    storageService.UploadAsync(
                        image.OpenStream,
                        image.FileName,
                        image.ContentType,
                        StorageType.Room,
                        entityId: updateRoomDto.RoomId.ToString(),
                        cancellationToken
                    )
                );

            string[] newKeys = await Task.WhenAll(uploadTasks);

            await unitOfWork.RoomRepository.AddImagesAsync(updateRoomDto.RoomId, [.. newKeys]);
            await unitOfWork.CommitTransactionAsync();

            // S3 is not transactional: only delete removed blobs after the DB commit succeeds.
            if (removedImageKeys.Count > 0)
            {
                await Task.WhenAll(removedImageKeys.Select(key => storageService.DeleteAsync(key, cancellationToken)));
            }

            List<string> keptImageKeys =
                [.. existingRoom.Images.Where(image => keptImageIds.Contains(image.Id)).Select(image => image.Key)];

            CreatedRoomDto response = new(
                Name: room.Name,
                Description: room.Description,
                Latitude: room.Latitude,
                Longitude: room.Longitude,
                Price: room.Price,
                RoomStatus: room.RoomStatus.ToString(),
                ImageRoomUrls: [.. keptImageKeys, .. newKeys],
                Policies: updateRoomDto.Policies,
                Services: updateRoomDto.Services
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

    private static bool NotExistAllServices(List<CreateRoomServiceDto> createRoomServiceDtoList, List<ServiceDto> services)
    {
        List<int> servicesIds = [.. services.Select(service => service.Id)];
        return createRoomServiceDtoList.Any(createRoomService => !servicesIds.Contains(createRoomService.Id));
    }

    private static bool NotExistAllPolicies(List<CreateRoomPolicyDto> createRoomPolicyList, List<PolicyDto> policies)
    {
        List<int> policiesIds = [.. policies.Select(policy => policy.Id)];
        return createRoomPolicyList.Any(createRoomPolicy => !policiesIds.Contains(createRoomPolicy.Id));
    }
}
