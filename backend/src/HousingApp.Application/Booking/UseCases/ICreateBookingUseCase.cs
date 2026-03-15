using HousingApp.Application.Booking.DTO;

namespace HousingApp.Application.Booking.UseCases
{
    public interface ICreateBookingUseCase
    {
        Task<Result<CreatedBookingDto>> ExecuteAsync(string bookerId, CreateBookingDto createBookingDto);
    }
}