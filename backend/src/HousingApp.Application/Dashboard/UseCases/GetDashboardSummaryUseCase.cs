using HousingApp.Application.Booking.DTO;
using HousingApp.Application.Dashboard.DTOs;
using HousingApp.Application.Repositories;
using HousingApp.Application.Room.DTOs;
using HousingApp.Application.Room.UseCases;
using HousingApp.Domain.Enums;

namespace HousingApp.Application.Dashboard.UseCases;

public class GetDashboardSummaryUseCase(
    IGetHouseholderRoomsUseCase getHouseholderRoomsUseCase,
    IUserRepository userRepository,
    IBookingRepository bookingRepository) : IGetDashboardSummaryUseCase
{
    public async Task<Result<DashboardSummaryDto>> ExecuteAsync(string userId)
    {
        Result<List<RoomHouseholderDto>> roomsResult = await getHouseholderRoomsUseCase.ExecuteAsync(userId);

        if (!roomsResult.IsSuccess)
        {
            return Result<DashboardSummaryDto>.Failure(roomsResult.Error);
        }

        List<RoomHouseholderDto> properties = roomsResult.Value!;

        Domain.Entities.Person user = await userRepository.GetFullUserByIdAsync(userId);
        List<HouseholderBookingDto> bookings = await bookingRepository.GetBookingsForHouseholderAsync(userId);

        int activeBookings = bookings.Count(b => b.Status == BookingStatus.Confirmed);

        List<DashboardBookingRequestDto> actionNeeded =
        [
            .. bookings
                .Where(b => b.Status == BookingStatus.Pending)
                .Select(b => new DashboardBookingRequestDto(
                    b.Id.ToString(),
                    b.BookerName,
                    b.RoomName))
        ];

        DashboardSummaryDto summary = new(
            GreetingName: user.FirstName,
            TotalListings: properties.Count,
            ActiveBookings: activeBookings,
            PendingRequests: actionNeeded.Count,
            ActionNeeded: actionNeeded,
            Properties: properties
        );

        return Result<DashboardSummaryDto>.Success(summary);
    }
}
