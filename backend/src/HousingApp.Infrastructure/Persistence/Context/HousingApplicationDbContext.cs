using HousingApp.Infrastructure.Persistence.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace HousingApp.Infrastructure.Persistence.Context;

public class HousingApplicationDbContext : IdentityDbContext
{
    public HousingApplicationDbContext(DbContextOptions<HousingApplicationDbContext> options) : base(options) { }

    public DbSet<PersonModel> Persons { get; set; }
    public DbSet<RoomModel> Rooms { get; set; }
    public DbSet<RoomStatusModel> RoomStatuses { get; set; }
    public DbSet<RoomImagesModel> RoomImages { get; set; }
    public DbSet<BookingModel> Bookings { get; set; }
    public DbSet<BookingStatusModel> BookingStatuses { get; set; }

    public DbSet<ChatModel> Chats { get; set; }
    public DbSet<ChatMessageModel> ChatMessages { get; set; }
    public DbSet<ChatParticipantModel> ChatParticipants { get; set; }

    public DbSet<ServiceModel> Services { get; set; }
    public DbSet<PolicyModel> Policies { get; set; }
    public DbSet<RoomServiceModel> RoomServices { get; set; }
    public DbSet<RoomPolicyModel> RoomPolicies { get; set; }

    public DbSet<RefreshToken> RefreshTokens { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        //TODO: Decide if we are gonna create a different schema for the database

        //Room statuses
        modelBuilder.Entity<RoomStatusModel>().HasData(
            new RoomStatusModel { Id = 1, Name = "Available", CreatedAt = new DateTime(year: 2026, month: 2, day: 2) },
            new RoomStatusModel { Id = 2, Name = "Unavailable", CreatedAt = new DateTime(year: 2026, month: 2, day: 2) },
            new RoomStatusModel { Id = 3, Name = "Booked", CreatedAt = new DateTime(year: 2026, month: 2, day: 2) }
        );

        //Booking statuses
        modelBuilder.Entity<BookingStatusModel>().HasData(
            new BookingStatusModel { Id = 1, Name = "Pending", CreatedAt = new DateTime(year: 2026, month: 2, day: 2) },
            new BookingStatusModel { Id = 2, Name = "Confirmed", CreatedAt = new DateTime(year: 2026, month: 2, day: 2) },
            new BookingStatusModel { Id = 3, Name = "Cancelled", CreatedAt = new DateTime(year: 2026, month: 2, day: 2) },
            new BookingStatusModel { Id = 4, Name = "Completed", CreatedAt = new DateTime(year: 2026, month: 2, day: 2) }
        );
    }
}
