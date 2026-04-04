using HousingApp.Application.Booking.DTO;
using HousingApp.Application.Repositories;

namespace HousingApp.Application.Booking.UseCases;

public class GetStudentBookingsUseCase(IBookingRepository bookingRepository) : IGetStudentBookingsUseCase
{
    public async Task<Result<List<BookingStudentDto>>> ExecuteAsync(string studentId)
    {
        List<BookingStudentDto> bookings = await bookingRepository.GetStudentBookingsAsync(studentId);
        return Result<List<BookingStudentDto>>.Success(bookings);
    }
}
