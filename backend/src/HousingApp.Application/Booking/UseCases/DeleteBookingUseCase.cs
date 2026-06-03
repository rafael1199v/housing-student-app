using HousingApp.Application.Repositories;
using HousingApp.Domain.Enums;
using HousingApp.Domain.Error;
using Microsoft.Extensions.Logging;

namespace HousingApp.Application.Booking.UseCases;

public class DeleteBookingUseCase(IBookingRepository bookingRepository, ILogger<DeleteBookingUseCase> logger) : IDeleteBookingUseCase
{
    public async Task<Result<bool>> ExecuteAsync(int roomId, string studentId)
    {
        Domain.Entities.Booking? booking = await bookingRepository.GetBookingByRoomAndStudentAsync(roomId, studentId);

        if (booking is null)
        {
            return Result<bool>.Failure(BookingError.BookingNotFound);
        }

        switch (booking.BookingStatus)
        {
            case BookingStatus.Confirmed:
                return Result<bool>.Failure(BookingError.BookingAlreadyApproved);
            case BookingStatus.Cancelled:
                return Result<bool>.Failure(BookingError.BookingAlreadyDenied);
            case BookingStatus.Completed:
                return Result<bool>.Failure(BookingError.BookingAlreadyCompleted);
            case BookingStatus.Pending:
                await bookingRepository.DeleteBookingAsync(booking.Id);
                logger.LogInformation(
                    "Booking cancelled BookingId={BookingId} RoomId={RoomId} StudentId={StudentId}",
                    booking.Id,
                    roomId,
                    studentId);
                return Result<bool>.Success(true);
            default:
                throw new ArgumentOutOfRangeException();
        }
    }
}
