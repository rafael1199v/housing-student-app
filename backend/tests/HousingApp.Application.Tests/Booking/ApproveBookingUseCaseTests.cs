using FluentAssertions;
using HousingApp.Application.Booking.UseCases;
using HousingApp.Application.Repositories;
using HousingApp.Application.UnitOfWork;
using HousingApp.Domain.Enums;
using HousingApp.Domain.Error;
using Microsoft.Extensions.Logging.Abstractions;
using NSubstitute;

namespace HousingApp.Application.Tests.Booking;

public class ApproveBookingUseCaseTests
{
    private readonly ApproveBookingUseCase _approveBookingUseCase;
    private readonly IBookingRepository _bookingRepository;
    private readonly IRoomRepository _roomRepository;
    private readonly IBookingUnitOfWork _unitOfWork;

    public ApproveBookingUseCaseTests()
    {
        _bookingRepository = Substitute.For<IBookingRepository>();
        _roomRepository = Substitute.For<IRoomRepository>();

        _unitOfWork = Substitute.For<IBookingUnitOfWork>();
        _unitOfWork.BookingRepository.Returns(_bookingRepository);
        _unitOfWork.RoomRepository.Returns(_roomRepository);

        _approveBookingUseCase = new ApproveBookingUseCase(_unitOfWork, NullLogger<ApproveBookingUseCase>.Instance);
    }

    [Fact]
    public async Task ApproveBooking_Pending_ShouldApproveAndCommit()
    {
        // Arrange
        Domain.Entities.Booking booking = new()
        {
            Id = 1,
            BookerId = "user-1",
            RoomId = 10,
            BookingStatus = BookingStatus.Pending
        };
        _bookingRepository.GetBookingByIdAsync(1).Returns(booking);
        _bookingRepository.ApproveBooking(1).Returns(true);

        // Act
        Result<bool> result = await _approveBookingUseCase.ExecuteAsync(1);

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Value.Should().BeTrue();
        await _unitOfWork.Received(1).BeginTransactionAsync();
        await _bookingRepository.Received(1).ApproveBooking(1);
        await _roomRepository.Received(1).TryMarkAsBookedAsync(10);
        await _unitOfWork.Received(1).CommitTransactionAsync();
    }

    [Fact]
    public async Task ApproveBooking_BookingNotFound_ShouldReturnError()
    {
        // Arrange
        _bookingRepository.GetBookingByIdAsync(Arg.Any<int>()).Returns((Domain.Entities.Booking?)null);

        // Act
        Result<bool> result = await _approveBookingUseCase.ExecuteAsync(1);

        // Assert
        result.IsSuccess.Should().BeFalse();
        result.Error.Code.Should().Be(BookingError.BookingNotFound.Code);
        await _unitOfWork.DidNotReceive().CommitTransactionAsync();
    }

    [Fact]
    public async Task ApproveBooking_AlreadyApproved_ShouldReturnError()
    {
        // Arrange
        Domain.Entities.Booking booking = new()
        {
            Id = 1,
            BookerId = "user-1",
            RoomId = 10,
            BookingStatus = BookingStatus.Confirmed
        };
        _bookingRepository.GetBookingByIdAsync(1).Returns(booking);

        // Act
        Result<bool> result = await _approveBookingUseCase.ExecuteAsync(1);

        // Assert
        result.IsSuccess.Should().BeFalse();
        result.Error.Code.Should().Be(BookingError.BookingAlreadyApproved.Code);
        await _unitOfWork.DidNotReceive().CommitTransactionAsync();
    }

    [Fact]
    public async Task ApproveBooking_AlreadyCancelled_ShouldReturnError()
    {
        // Arrange
        Domain.Entities.Booking booking = new()
        {
            Id = 1,
            BookerId = "user-1",
            RoomId = 10,
            BookingStatus = BookingStatus.Cancelled
        };
        _bookingRepository.GetBookingByIdAsync(1).Returns(booking);

        // Act
        Result<bool> result = await _approveBookingUseCase.ExecuteAsync(1);

        // Assert
        result.IsSuccess.Should().BeFalse();
        result.Error.Code.Should().Be(BookingError.BookingAlreadyDenied.Code);
        await _unitOfWork.DidNotReceive().CommitTransactionAsync();
    }
}
