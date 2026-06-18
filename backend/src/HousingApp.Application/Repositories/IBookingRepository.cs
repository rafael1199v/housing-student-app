using HousingApp.Application.Booking.DTO;
using HousingApp.Domain.Enums;

namespace HousingApp.Application.Repositories;

public interface IBookingRepository
{

    Task CreateBookingAsync(Domain.Entities.Booking booking);
    Task<bool> UserHasAlreadyBooked(string userId, int roomId);
    Task<bool> ChangeStatus(int bookingId, BookingStatus newStatus);
    Task<Domain.Entities.Booking?> GetBookingByIdAsync(int bookingId);
    Task<Domain.Entities.Booking?> GetBookingByRoomAndStudentAsync(int roomId, string studentId);
    Task<bool> ApproveBooking(int bookingId);
    Task<bool> RejectBooking(int bookingId);
    Task DeleteBookingAsync(int bookingId);

    Task<List<BookingStudentDto>> GetStudentBookingsAsync(string studentId);
    Task<List<HouseholderBookingDto>> GetBookingsForHouseholderAsync(string householderId);
    Task<int?> GetRoomIdByBookingIdAsync(int bookingId);
}
