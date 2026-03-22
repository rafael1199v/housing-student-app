namespace HousingApp.Application.Booking.UseCases
{
    public interface IDeleteBookingUseCase
    {
        Task<Result<bool>> ExecuteAsync(int roomId, string studentId);
    }
}