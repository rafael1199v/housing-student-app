using HousingApp.Application.UnitOfWork;
using HousingApp.Domain.Enums;
using HousingApp.Domain.Error;
using Microsoft.Extensions.Logging;

namespace HousingApp.Application.Booking.UseCases;

public class RejectBookingUseCase(IBookingUnitOfWork unitOfWork, ILogger<RejectBookingUseCase> logger) : IRejectBookingUseCase
{
    public async Task<Result<bool>> ExecuteAsync(int bookingId)
    {
        Domain.Entities.Booking? booking = await unitOfWork.BookingRepository.GetBookingByIdAsync(bookingId);

        if (booking is null)
            return Result<bool>.Failure(BookingError.BookingNotFound);

        return booking.BookingStatus switch
        {
            BookingStatus.Confirmed => Result<bool>.Failure(BookingError.BookingAlreadyApproved),
            BookingStatus.Cancelled => Result<bool>.Failure(BookingError.BookingAlreadyDenied),
            BookingStatus.Pending => await RejectAsync(booking),
            _ => Result<bool>.Failure(BookingError.BookingInvalidStatus)
        };
    }

    private async Task<Result<bool>> RejectAsync(Domain.Entities.Booking booking)
    {
        await unitOfWork.BeginTransactionAsync();
        try
        {
            bool result = await unitOfWork.BookingRepository.RejectBooking(booking.Id);

            if (!result)
                return Result<bool>.Failure(BookingError.BookingCouldNotChangeStatus);

            await unitOfWork.CommitTransactionAsync();
            logger.LogInformation(
                "Booking rejected BookingId={BookingId} RoomId={RoomId}",
                booking.Id,
                booking.RoomId);

            return Result<bool>.Success(result);
        }
        catch
        {
            await unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }
}
