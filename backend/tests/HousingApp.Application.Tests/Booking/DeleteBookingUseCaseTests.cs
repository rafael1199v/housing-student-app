using FluentAssertions;
using HousingApp.Application.Booking.UseCases;
using HousingApp.Application.Repositories;
using HousingApp.Domain.Enums;
using Microsoft.Extensions.Logging.Abstractions;
using NSubstitute;

namespace HousingApp.Application.Tests.Booking;

public class DeleteBookingUseCaseTests
{
    private readonly IBookingRepository _bookingRepository;
    private readonly DeleteBookingUseCase _deleteBookingUseCase;

    public DeleteBookingUseCaseTests()
    {
        _bookingRepository = Substitute.For<IBookingRepository>();
        _deleteBookingUseCase = new DeleteBookingUseCase(_bookingRepository, NullLogger<DeleteBookingUseCase>.Instance);
    }

    [Fact]
    public async Task DeleteBooking_Pending_ShouldDelete()
    {
        // Arrange
        Domain.Entities.Booking booking = new()
        {
            Id = 1,
            BookerId = "user-1",
            RoomId = 10,
            BookingStatus = BookingStatus.Pending
        };
        _bookingRepository.GetBookingByRoomAndStudentAsync(10, "user-1").Returns(booking);

        // Act
        Result<bool> result = await _deleteBookingUseCase.ExecuteAsync(10, "user-1");

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Value.Should().BeTrue();
        await _bookingRepository.Received(1).DeleteBookingAsync(1);
    }

    [Fact]
    public async Task DeleteBooking_BookingNotFound_ShouldReturnError()
    {
        // Arrange
        _bookingRepository.GetBookingByRoomAndStudentAsync(Arg.Any<int>(), Arg.Any<string>())
            .Returns((Domain.Entities.Booking?)null);

        // Act
        Result<bool> result = await _deleteBookingUseCase.ExecuteAsync(10, "user-1");

        // Assert
        result.IsSuccess.Should().BeFalse();
        result.Error.Code.Should().Be("booking.not.found");
        await _bookingRepository.DidNotReceive().DeleteBookingAsync(Arg.Any<int>());
    }

    [Fact]
    public async Task DeleteBooking_AlreadyApproved_ShouldReturnError()
    {
        // Arrange
        Domain.Entities.Booking booking = new()
        {
            Id = 1,
            BookerId = "user-1",
            RoomId = 10,
            BookingStatus = BookingStatus.Confirmed
        };
        _bookingRepository.GetBookingByRoomAndStudentAsync(10, "user-1").Returns(booking);

        // Act
        Result<bool> result = await _deleteBookingUseCase.ExecuteAsync(10, "user-1");

        // Assert
        result.IsSuccess.Should().BeFalse();
        result.Error.Code.Should().Be("booking.already.approved");
        await _bookingRepository.DidNotReceive().DeleteBookingAsync(Arg.Any<int>());
    }

    [Fact]
    public async Task DeleteBooking_AlreadyDenied_ShouldReturnError()
    {
        // Arrange
        Domain.Entities.Booking booking = new()
        {
            Id = 1,
            BookerId = "user-1",
            RoomId = 10,
            BookingStatus = BookingStatus.Cancelled
        };
        _bookingRepository.GetBookingByRoomAndStudentAsync(10, "user-1").Returns(booking);

        // Act
        Result<bool> result = await _deleteBookingUseCase.ExecuteAsync(10, "user-1");

        // Assert
        result.IsSuccess.Should().BeFalse();
        result.Error.Code.Should().Be("booking.already.denied");
        await _bookingRepository.DidNotReceive().DeleteBookingAsync(Arg.Any<int>());
    }
}
