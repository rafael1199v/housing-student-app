using HousingApp.Domain.Entities;
using HousingApp.Domain.Enums;

namespace HousingApp.Domain.Repositories
{
    public interface IBookingRepository
    {
        Task CreateBookingAsync(Booking booking);
        Task<bool> UserHasAlreadyBooked(string userId, int roomId);
        Task<bool> ChangeStatus(int bookingId, BookingStatus newStatus);
        Task<Booking?> GetBookingByIdAsync(int bookingId);
    }
}