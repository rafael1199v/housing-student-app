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
            {
                return Result<bool>.Failure(BookingError.BookingNotFound);
            }

            switch (booking.BookingStatus)
            {
                case BookingStatus.Confirmed:
                    return Result<bool>.Failure(BookingError.BookingAlreadyApproved);

                case BookingStatus.Cancelled:
                    return Result<bool>.Failure(BookingError.BookingAlreadyDenied);

                case BookingStatus.Pending:
                    await unitOfWork.BeginTransactionAsync();
                    bool result = await unitOfWork.BookingRepository.ChangeStatus(bookingId, BookingStatus.Confirmed);
                    await unitOfWork.CommitTransactionAsync();
                    
                    return !result ? Result<bool>.Failure(BookingError.BookingCouldNotChangeStatus) : Result<bool>.Success(result);
                
                case BookingStatus.Completed:
                default:
                    return Result<bool>.Failure(BookingError.BookingInvalidStatus);
            }
        }
    }
}