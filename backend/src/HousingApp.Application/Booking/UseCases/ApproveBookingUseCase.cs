using HousingApp.Application.UnitOfWork;
using HousingApp.Domain.Enums;
using HousingApp.Domain.Error;
using System.Diagnostics.Contracts;
using System.Xml.XPath;

namespace HousingApp.Application.Booking.UseCases
{
    public class ApproveBookingUseCase(IBookingUnitOfWork unitOfWork) : IApproveBookingUseCase
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
                BookingStatus.Pending => await ApproveAsync(booking),
                _ => Result<bool>.Failure(BookingError.BookingInvalidStatus)
            };
        }

        private async Task<Result<bool>> ApproveAsync(Domain.Entities.Booking booking)
        {
            await unitOfWork.BeginTransactionAsync();
            try
            {
                bool result = await unitOfWork.BookingRepository.ApproveBooking(booking.Id);

                if (!result)
                    return Result<bool>.Failure(BookingError.BookingCouldNotChangeStatus);

                await unitOfWork.RoomRepository.TryMarkAsBookedAsync(booking.RoomId);
                await unitOfWork.CommitTransactionAsync();

                return Result<bool>.Success(result);
            }
            catch
            {
                await unitOfWork.RollbackTransactionAsync();
                throw;
            }
        }
    }
}