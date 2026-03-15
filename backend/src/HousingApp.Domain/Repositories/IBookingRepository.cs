using HousingApp.Domain.Entities;

namespace HousingApp.Domain.Repositories
{
    public interface IBookingRepository
    {
        Task CreateBookingAsync(Booking booking);
        Task<bool> UserHasAlreadyBooked(string userId, int roomId);
    }
}