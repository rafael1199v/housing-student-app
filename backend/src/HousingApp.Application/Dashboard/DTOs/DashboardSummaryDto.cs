using HousingApp.Application.Room.DTOs;

namespace HousingApp.Application.Dashboard.DTOs;

public record DashboardSummaryDto(
    string GreetingName,
    int TotalListings,
    int ActiveBookings,
    int PendingRequests,
    List<DashboardBookingRequestDto> ActionNeeded,
    List<RoomHouseholderDto> Properties
);
