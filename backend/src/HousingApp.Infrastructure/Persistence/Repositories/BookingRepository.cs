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

        public async Task<Booking?> GetBookingByRoomAndStudentAsync(int roomId, string studentId)
        {
            BookingModel? booking = await context.Bookings.FirstOrDefaultAsync(b => b.RoomId == roomId && b.BookerId == studentId && !b.IsDeleted);
            return booking is null ? null : ToDomain(booking);
        }

        public async Task<bool> ApproveBooking(int bookingId)
        {
            BookingModel? booking = await context.Bookings.FindAsync(bookingId);

            if (booking is null)
                return false;

            await context.Bookings
                .Where(b => b.RoomId == booking.RoomId && b.Id != bookingId && !b.IsDeleted)
                .ExecuteUpdateAsync(setters => setters.SetProperty(b => b.BookingStatusId, (int)BookingStatus.Cancelled));

            await context.Bookings
                .Where(b => b.Id == bookingId && !b.IsDeleted)
                .ExecuteUpdateAsync(setters => setters.SetProperty(b => b.BookingStatusId, (int)BookingStatus.Confirmed));

            return true;
        }

        public async Task DeleteBookingAsync(int bookingId)
        {
            await context.Bookings.Where(b => b.Id == bookingId).ExecuteUpdateAsync(setters => setters.SetProperty(b => b.IsDeleted, true));
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