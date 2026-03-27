using HousingApp.Application.Booking.DTO;
using HousingApp.Application.Room.DTO;

namespace HousingApp.Application.Booking.UseCases
{
    public interface IGetStudentBookingsUseCase
    {
        Task<Result<List<BookingStudentDto>>> ExecuteAsync(string studentId);
    }
}