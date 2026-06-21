using HousingApp.Application.Booking.DTO;
using HousingApp.Application.UnitOfWork;
using HousingApp.Domain.Enums;
using HousingApp.Domain.Error;
using Microsoft.Extensions.Logging;

namespace HousingApp.Application.Booking.UseCases;

public class CreateBookingUseCase(IBookingUnitOfWork unitOfWork, ILogger<CreateBookingUseCase> logger) : ICreateBookingUseCase
{
    public async Task<Result<CreatedBookingDto>> ExecuteAsync(string bookerId, CreateBookingDto createBookingDto)
    {
        if (!await unitOfWork.PersonRepository.ExistsByUserIdAsync(bookerId))
        {
            return Result<CreatedBookingDto>.Failure(BookingError.BookerNotFound);
        }

        if (await unitOfWork.BookingRepository.UserHasAlreadyBooked(bookerId, createBookingDto.RoomId))
        {
            return Result<CreatedBookingDto>.Failure(BookingError.RoomAlreadyBooked);
        }

        string? ownerId = await unitOfWork.RoomRepository.GetRoomOwnerIdAsync(createBookingDto.RoomId);

        if (ownerId is not null && ownerId == bookerId)
        {
            return Result<CreatedBookingDto>.Failure(BookingError.CannotBookOwnRoom);
        }


        await unitOfWork.BeginTransactionAsync();

        try
        {
            bool isRoomAvailable = await unitOfWork.RoomRepository.IsRoomAvailable(createBookingDto.RoomId);

            if (!isRoomAvailable)
            {
                return Result<CreatedBookingDto>.Failure(BookingError.RoomNotAvailable);
            }

            Domain.Entities.Booking booking = new()
            {
                Id = 0,
                BookerId = bookerId,
                RoomId = createBookingDto.RoomId,
                BookingStatus = BookingStatus.Pending
            };

            await unitOfWork.BookingRepository.CreateBookingAsync(booking);
            await unitOfWork.CommitTransactionAsync();
            logger.LogInformation(
                "Booking created BookerId={BookerId} RoomId={RoomId} Status={BookingStatus}",
                booking.BookerId,
                booking.RoomId,
                booking.BookingStatus);

            CreatedBookingDto response = new(
                booking.RoomId,
                booking.BookerId,
                booking.BookingStatus.ToString());

            return Result<CreatedBookingDto>.Success(response);
        }
        catch
        {
            await unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }
}
