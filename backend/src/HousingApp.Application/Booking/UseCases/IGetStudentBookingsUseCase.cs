using HousingApp.Application.Booking.DTO;

namespace HousingApp.Application.Booking.UseCases;

public interface IGetStudentBookingsUseCase
{
    Task<Result<List<BookingStudentDto>>> ExecuteAsync(string studentId);
}
