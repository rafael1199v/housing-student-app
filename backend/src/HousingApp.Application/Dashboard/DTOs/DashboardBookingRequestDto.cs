namespace HousingApp.Application.Dashboard.DTOs;

public record DashboardBookingRequestDto(
    string Id,
    string RequesterName,
    string PropertyName
);
