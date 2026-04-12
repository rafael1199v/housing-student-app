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

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        //TODO: Decide if we are gonna create a different schema for the database
    }
}
