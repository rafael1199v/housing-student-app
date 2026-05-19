using FluentAssertions;
using HousingApp.Application.Booking.UseCases;
using HousingApp.Application.Repositories;
using HousingApp.Application.UnitOfWork;
using HousingApp.Domain.Enums;
using HousingApp.Domain.Error;
using NSubstitute;

namespace HousingApp.Application.Tests.Booking;

public class RejectBookingUseCaseTests
{
    private readonly RejectBookingUseCase _rejectBookingUseCase;
    private readonly IBookingRepository _bookingRepository;
    private readonly IBookingUnitOfWork _unitOfWork;

    public RejectBookingUseCaseTests()
    {
        _bookingRepository = Substitute.For<IBookingRepository>();

        _unitOfWork = Substitute.For<IBookingUnitOfWork>();
        _unitOfWork.BookingRepository.Returns(_bookingRepository);

        _rejectBookingUseCase = new RejectBookingUseCase(_unitOfWork);
    }

    [Fact]
    public async Task RejectBooking_Pending_ShouldRejectAndCommit()
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
        _bookingRepository.RejectBooking(1).Returns(true);

        // Act
        Result<bool> result = await _rejectBookingUseCase.ExecuteAsync(1);

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Value.Should().BeTrue();
        await _unitOfWork.Received(1).BeginTransactionAsync();
        await _bookingRepository.Received(1).RejectBooking(1);
        await _unitOfWork.Received(1).CommitTransactionAsync();
    }

    [Fact]
    public async Task RejectBooking_BookingNotFound_ShouldReturnError()
    {
        // Arrange
        _bookingRepository.GetBookingByIdAsync(Arg.Any<int>()).Returns((Domain.Entities.Booking?)null);

        // Act
        Result<bool> result = await _rejectBookingUseCase.ExecuteAsync(1);

        // Assert
        result.IsSuccess.Should().BeFalse();
        result.Error.Code.Should().Be(BookingError.BookingNotFound.Code);
        await _unitOfWork.DidNotReceive().CommitTransactionAsync();
    }
}
