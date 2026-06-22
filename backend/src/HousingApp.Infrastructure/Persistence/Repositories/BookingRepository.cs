using HousingApp.Application.Booking.DTO;
using HousingApp.Application.Repositories;
using HousingApp.Domain.Entities;
using HousingApp.Domain.Enums;
using HousingApp.Infrastructure.Persistence.Context;
using HousingApp.Infrastructure.Persistence.Models;
using Microsoft.EntityFrameworkCore;

namespace HousingApp.Infrastructure.Persistence.Repositories;

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
        bool userHasAlreadyBooked =
            await context.Bookings.AnyAsync(b => b.BookerId == userId && b.RoomId == roomId && !b.IsDeleted);
        return userHasAlreadyBooked;
    }

    public async Task<bool> ChangeStatus(int bookingId, BookingStatus newStatus)
    {
        BookingModel? booking = await context.Bookings.FindAsync(bookingId);

        if (booking is null)
        {
            return false;
        }

        booking.BookingStatusId = (int)newStatus;
        return true;
    }

    public async Task<Booking?> GetBookingByIdAsync(int bookingId)
    {
        Booking? booking = await context.Bookings
            .Where(b => b.Id == bookingId && !b.IsDeleted)
            .Select(model => new Booking
            {
                Id = model.Id,
                BookerId = model.BookerId,
                RoomId = model.RoomId,
                BookingStatus = (BookingStatus)model.BookingStatusId
            })
            .FirstOrDefaultAsync();

        return booking;
    }

    public async Task<Booking?> GetBookingByRoomAndStudentAsync(int roomId, string studentId)
    {
        Booking? booking = await context.Bookings
            .Where(b => b.RoomId == roomId && b.BookerId == studentId && !b.IsDeleted)
            .Select(model => new Booking
            {
                Id = model.Id,
                BookerId = model.BookerId,
                RoomId = model.RoomId,
                BookingStatus = (BookingStatus)model.BookingStatusId
            })
            .FirstOrDefaultAsync();

        return booking;
    }

    public async Task<bool> ApproveBooking(int bookingId)
    {
        BookingModel? booking = await context.Bookings.FindAsync(bookingId);

        if (booking is null)
        {
            return false;
        }

        await context.Bookings
            .Where(b => b.RoomId == booking.RoomId && b.Id != bookingId && !b.IsDeleted)
            .ExecuteUpdateAsync(setters => setters.SetProperty(b => b.BookingStatusId, (int)BookingStatus.Cancelled));

        await context.Bookings
            .Where(b => b.Id == bookingId && !b.IsDeleted)
            .ExecuteUpdateAsync(setters => setters.SetProperty(b => b.BookingStatusId, (int)BookingStatus.Confirmed));

        return true;
    }

    public async Task<bool> RejectBooking(int bookingId)
    {
        BookingModel? booking = await context.Bookings.FindAsync(bookingId);

        if (booking is null)
            return false;

        await context.Bookings
            .Where(b => b.Id == bookingId && !b.IsDeleted)
            .ExecuteUpdateAsync(setters => setters.SetProperty(b => b.BookingStatusId, (int)BookingStatus.Cancelled));

        return true;
    }

    public async Task DeleteBookingAsync(int bookingId)
    {
        await context.Bookings.Where(b => b.Id == bookingId).ExecuteUpdateAsync(setters => setters.SetProperty(b => b.IsDeleted, true));
    }

    public async Task<List<BookingStudentDto>> GetStudentBookingsAsync(string studentId)
    {
        return await context.Bookings
            .AsNoTracking()
            .Where(b => b.BookerId == studentId && !b.IsDeleted)
            .Select(b => new BookingStudentDto(
                Id: b.Id,
                RoomId: b.RoomId,
                BookingStatus: b.BookingStatus.Name,
                BookingStatusId: b.BookingStatusId,
                BookingRoomName: b.Room.Name
            )).ToListAsync();
    }

    public async Task<List<HouseholderBookingDto>> GetBookingsForHouseholderAsync(string householderId)
    {
        return await context.Bookings
            .AsNoTracking()
            .Where(b => b.Room.PersonId == householderId && b.BookerId != householderId && !b.IsDeleted)
            .Select(b => new HouseholderBookingDto(
                Id: b.Id,
                BookerId: b.BookerId,
                BookerName: b.Booker.FirstName + " " + (b.Booker.LastName ?? ""),
                RoomId: b.RoomId,
                RoomName: b.Room.Name,
                Status: (BookingStatus)b.BookingStatusId,
                BookerImageUrl: string.IsNullOrEmpty(b.Booker.ImageUrl) ? "" : b.Booker.ImageUrl 
            )).ToListAsync();
    }

    public async Task<int?> GetRoomIdByBookingIdAsync(int bookingId)
    {
        return await context.Bookings
            .AsNoTracking()
            .Where(b => b.Id == bookingId && !b.IsDeleted)
            .Select(b => b.RoomId)
            .FirstOrDefaultAsync();
    }
}
