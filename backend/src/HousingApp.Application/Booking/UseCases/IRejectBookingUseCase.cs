namespace HousingApp.Application.Booking.UseCases
{
    public interface IRejectBookingUseCase
    {
        Task<Result<bool>> ExecuteAsync(int bookingId);
    }
}