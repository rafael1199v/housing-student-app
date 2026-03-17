using HousingApp.Domain.Entities;
using HousingApp.Domain.Enums;
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

        public async Task<bool> ChangeStatus(int bookingId, BookingStatus newStatus)
        {
            BookingModel? booking = await context.Bookings.FindAsync(bookingId);

            if (booking is null)
                return false;

            booking.BookingStatusId = (int)newStatus;
            return true;
        }

        public async Task<Booking?> GetBookingByIdAsync(int bookingId)
        {
            BookingModel? booking = await context.Bookings.FirstOrDefaultAsync(b => b.Id == bookingId && !b.IsDeleted); 
            return booking is null ? null : ToDomain(booking);
        }

        private static Booking ToDomain(BookingModel model)
        {
            return new Booking
            {
                Id = model.Id,
                BookerId = model.BookerId,
                RoomId = model.RoomId,
                BookingStatus = (BookingStatus)model.BookingStatusId
            };
        }
    }
}
