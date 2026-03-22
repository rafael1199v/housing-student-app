using HousingApp.Application.Room.DTO;
using HousingApp.Application.UnitOfWork;
using HousingApp.Domain.Entities;
using HousingApp.Domain.Enums;
using HousingApp.Domain.Error;

namespace HousingApp.Application.Room.UseCases
{
    public class CreateRoomUseCase(IRoomUnitOfWork unitOfWork) : ICreateRoomUseCase
    {

        public async Task<Result<CreatedRoomDto>> ExecuteAsync(string userId, CreateRoomDto createRoomDto)
        {
            if (!await unitOfWork.PersonRepository.ExistsByUserIdAsync(userId))
                return Result<CreatedRoomDto>.Failure(RoomError.HouseholderNotFound);

            if (string.IsNullOrWhiteSpace(createRoomDto.Name))
                return Result<CreatedRoomDto>.Failure(RoomError.InvalidName);

            if (string.IsNullOrWhiteSpace(createRoomDto.Description))
                return Result<CreatedRoomDto>.Failure(RoomError.InvalidDescription);

            if (createRoomDto.Price <= 0)
                return Result<CreatedRoomDto>.Failure(RoomError.InvalidPrice);

            if (createRoomDto.Latitude < -90 || createRoomDto.Latitude > 90)
                return Result<CreatedRoomDto>.Failure(RoomError.InvalidLatitude);

            if (createRoomDto.Longitude < -180 || createRoomDto.Longitude > 180)
                return Result<CreatedRoomDto>.Failure(RoomError.InvalidLongitude);

            if (!Enum.IsDefined(typeof(RoomStatus), createRoomDto.RoomStatusId))
                return Result<CreatedRoomDto>.Failure(RoomError.InvalidRoomStatus);

            if ((RoomStatus)createRoomDto.RoomStatusId is RoomStatus.Booked)
                return Result<CreatedRoomDto>.Failure(RoomError.InvalidRoomStatus);

            Domain.Entities.Room room = new()
            {
                Id = 0,
                Name = createRoomDto.Name.Trim(),
                Description = createRoomDto.Description.Trim(),
                Latitude = createRoomDto.Latitude,
                Longitude = createRoomDto.Longitude,
                Price = createRoomDto.Price,
                PersonId = userId,
                RoomStatus = (RoomStatus)createRoomDto.RoomStatusId
            };

            await unitOfWork.BeginTransactionAsync();

            try
            {
                int roomId = await unitOfWork.RoomRepository.CreateRoomAsync(room);
                await unitOfWork.CommitTransactionAsync();

                CreatedRoomDto response = new(
                    Name: room.Name,
                    Description: room.Description,
                    Latitude: room.Latitude,
                    Longitude: room.Longitude,
                    Price: room.Price,
                    RoomStatus: room.RoomStatus.ToString(),
                    ImageRoomUrls: room.ImageUrls);

                return Result<CreatedRoomDto>.Success(response);
            }
            catch
            {
                await unitOfWork.RollbackTransactionAsync();
                throw;
            }
        }


    }
}