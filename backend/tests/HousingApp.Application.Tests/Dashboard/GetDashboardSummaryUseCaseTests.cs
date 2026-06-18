using FluentAssertions;
using HousingApp.Application.Booking.DTO;
using HousingApp.Application.Dashboard.DTOs;
using HousingApp.Application.Dashboard.UseCases;
using HousingApp.Application.Repositories;
using HousingApp.Application.Room.DTOs;
using HousingApp.Application.Room.UseCases;
using HousingApp.Domain.Entities;
using HousingApp.Domain.Enums;
using HousingApp.Domain.Error;
using NSubstitute;

namespace HousingApp.Application.Tests.Dashboard;

public class GetDashboardSummaryUseCaseTests
{
    private const string HouseholderId = "householder-1";

    private readonly IGetHouseholderRoomsUseCase _getHouseholderRoomsUseCase;
    private readonly IUserRepository _userRepository;
    private readonly IBookingRepository _bookingRepository;
    private readonly GetDashboardSummaryUseCase _useCase;

    public GetDashboardSummaryUseCaseTests()
    {
        _getHouseholderRoomsUseCase = Substitute.For<IGetHouseholderRoomsUseCase>();
        _userRepository = Substitute.For<IUserRepository>();
        _bookingRepository = Substitute.For<IBookingRepository>();

        _useCase = new GetDashboardSummaryUseCase(
            _getHouseholderRoomsUseCase,
            _userRepository,
            _bookingRepository);
    }

    private static RoomHouseholderDto Room(int id, string name) =>
        new(id, name, 0, 0, "desc", 100, "Available", 0, []);

    private static HouseholderBookingDto Booking(int id, BookingStatus status, string booker = "Elena Rostova", string room = "Room A") =>
        new(id, $"student-{id}", booker, 10, room, status);

    [Fact]
    public async Task ExecuteAsync_MapsConfirmedToActiveAndPendingToActionNeeded()
    {
        // Arrange
        List<RoomHouseholderDto> rooms = [Room(1, "Room A"), Room(2, "Room B")];
        _getHouseholderRoomsUseCase.ExecuteAsync(HouseholderId)
            .Returns(Result<List<RoomHouseholderDto>>.Success(rooms));
        _userRepository.GetFullUserByIdAsync(HouseholderId)
            .Returns(new Person { FirstName = "Ana" });
        _bookingRepository.GetBookingsForHouseholderAsync(HouseholderId).Returns(new List<HouseholderBookingDto>
        {
            Booking(1, BookingStatus.Confirmed),
            Booking(2, BookingStatus.Confirmed),
            Booking(3, BookingStatus.Pending, "Marcus Bennett", "Room B"),
            Booking(4, BookingStatus.Cancelled),
            Booking(5, BookingStatus.Completed),
        });

        // Act
        Result<DashboardSummaryDto> result = await _useCase.ExecuteAsync(HouseholderId);

        // Assert
        result.IsSuccess.Should().BeTrue();
        DashboardSummaryDto summary = result.Value!;
        summary.GreetingName.Should().Be("Ana");
        summary.TotalListings.Should().Be(2);
        summary.ActiveBookings.Should().Be(2);
        summary.PendingRequests.Should().Be(1);
        summary.ActionNeeded.Should().ContainSingle();
        summary.ActionNeeded[0].Id.Should().Be("3");
        summary.ActionNeeded[0].RequesterName.Should().Be("Marcus Bennett");
        summary.ActionNeeded[0].PropertyName.Should().Be("Room B");
        summary.Properties.Should().BeEquivalentTo(rooms);
    }

    [Fact]
    public async Task ExecuteAsync_WhenNoBookings_ReturnsZeroCountsAndEmptyActionNeeded()
    {
        // Arrange
        _getHouseholderRoomsUseCase.ExecuteAsync(HouseholderId)
            .Returns(Result<List<RoomHouseholderDto>>.Success([]));
        _userRepository.GetFullUserByIdAsync(HouseholderId)
            .Returns(new Person { FirstName = "Ana" });
        _bookingRepository.GetBookingsForHouseholderAsync(HouseholderId)
            .Returns(new List<HouseholderBookingDto>());

        // Act
        Result<DashboardSummaryDto> result = await _useCase.ExecuteAsync(HouseholderId);

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Value!.TotalListings.Should().Be(0);
        result.Value!.ActiveBookings.Should().Be(0);
        result.Value!.PendingRequests.Should().Be(0);
        result.Value!.ActionNeeded.Should().BeEmpty();
    }

    [Fact]
    public async Task ExecuteAsync_WhenRoomsUseCaseFails_PropagatesErrorWithoutQueryingBookings()
    {
        // Arrange
        _getHouseholderRoomsUseCase.ExecuteAsync(HouseholderId)
            .Returns(Result<List<RoomHouseholderDto>>.Failure(RoomError.RoomNotFound));

        // Act
        Result<DashboardSummaryDto> result = await _useCase.ExecuteAsync(HouseholderId);

        // Assert
        result.IsSuccess.Should().BeFalse();
        result.Error.Code.Should().Be(RoomError.RoomNotFound.Code);
        await _bookingRepository.DidNotReceive().GetBookingsForHouseholderAsync(Arg.Any<string>());
    }
}
