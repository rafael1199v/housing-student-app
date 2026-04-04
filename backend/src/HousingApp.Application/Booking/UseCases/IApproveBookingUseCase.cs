namespace HousingApp.Application.Booking.UseCases;

public interface IApproveBookingUseCase
{
    Task<Result<bool>> ExecuteAsync(int bookingId);
}
