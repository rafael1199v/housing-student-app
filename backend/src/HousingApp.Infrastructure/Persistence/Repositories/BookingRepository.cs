using HousingApp.Domain.Entities;
using HousingApp.Domain.Repositories;
using HousingApp.Infrastructure.Persistence.Context;
using HousingApp.Infrastructure.Persistence.Models;
using Microsoft.EntityFrameworkCore;

namespace HousingApp.Infrastructure.Persistence.Repositories
{
    public class BookingRepository(HousingApplicationDbContext context) : IBookingRepository
    {
        public async Task CreateBookingAsync(Booking booking)
        {
            BookingModel model = new()
            {
                BookerId = booking.BookerId,
                RoomId = booking.RoomId,
                BookingStatusId = (int)booking.BookingStatus
            };

            await context.Bookings.AddAsync(model);
        }

        public async Task<bool> UserHasAlreadyBooked(string userId, int roomId)
        {
            bool userHasAlreadyBooked = await context.Bookings.AnyAsync(b => b.BookerId == userId && b.RoomId == roomId && !b.IsDeleted);
            return userHasAlreadyBooked;
        }
    }
}
