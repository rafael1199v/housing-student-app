using FluentAssertions;
using HousingApp.Application.Booking.DTO;
using HousingApp.Application.Booking.UseCases;
using HousingApp.Application.Repositories;
using HousingApp.Application.UnitOfWork;
using HousingApp.Domain.Enums;
using HousingApp.Domain.Error;
using NSubstitute;

namespace HousingApp.Application.Tests.Booking;

public class CreateBookingUseCaseTests
{
    private readonly CreateBookingUseCase _createBookingUseCase;

    private readonly IBookingUnitOfWork _unitOfWork;
    private readonly IRoomRepository _roomRepository;
    private readonly IBookingRepository _bookingRepository;
    private readonly IPersonRepository _personRepository;


    public CreateBookingUseCaseTests()
    {
        _roomRepository = Substitute.For<IRoomRepository>();
        _bookingRepository = Substitute.For<IBookingRepository>();
        _personRepository = Substitute.For<IPersonRepository>();

        _unitOfWork = Substitute.For<IBookingUnitOfWork>();
        _unitOfWork.PersonRepository.Returns(_personRepository);
        _unitOfWork.RoomRepository.Returns(_roomRepository);
        _unitOfWork.BookingRepository.Returns(_bookingRepository);

        _createBookingUseCase = new CreateBookingUseCase(_unitOfWork);
    }


    [Fact]
    public async Task CreateBooking_ShouldReturnCreateBookingDto()
    {
        //Arrange
        const int roomId = 50;
        var bookerId = Guid.NewGuid().ToString();
        var createBookingDto = new CreateBookingDto(RoomId: roomId);
        var expectedCreatedBookingDto = new CreatedBookingDto(
            RoomId: roomId,
            BookerId: bookerId,
            Status: nameof(BookingStatus.Pending)
        );

        _personRepository.ExistsByUserIdAsync(bookerId).Returns(true);
        _bookingRepository.UserHasAlreadyBooked(bookerId, roomId).Returns(false);
        _roomRepository.IsRoomAvailable(roomId).Returns(true);

        //Act
        var result = await _createBookingUseCase.ExecuteAsync(bookerId, createBookingDto);
        var createdBookingDto = result.Value;

        //Assert
        createdBookingDto.Should().BeEquivalentTo(expectedCreatedBookingDto);
        await _unitOfWork.Received(1).CommitTransactionAsync();
    }

    [Fact]
    public async Task CreateBooking_WhenUserHasAlreadyBooked_ShouldReturnRoomAlreadyBookedError()
    {
        //Arrange
        const int roomId = 50;
        var bookerId = Guid.NewGuid().ToString();
        var createBookingDto = new CreateBookingDto(RoomId: roomId);


        _personRepository.ExistsByUserIdAsync(bookerId).Returns(true);
        _bookingRepository.UserHasAlreadyBooked(bookerId, roomId).Returns(true);

        //Act
        var result = await _createBookingUseCase.ExecuteAsync(bookerId, createBookingDto);
        var error = result.Error;

        //Assert
        error.Should().BeEquivalentTo(BookingError.RoomAlreadyBooked);
        await _unitOfWork.DidNotReceive().CommitTransactionAsync();
    }

    [Fact]
    public async Task CreateBooking_WhenRoomIsNotAvailable_ShouldReturnRoomNotAvailableError()
    {
        //Arrange
        const int roomId = 50;
        var bookerId = Guid.NewGuid().ToString();
        var createBookingDto = new CreateBookingDto(RoomId: roomId);
        
        _personRepository.ExistsByUserIdAsync(bookerId).Returns(true);
        _bookingRepository.UserHasAlreadyBooked(bookerId, roomId).Returns(false);
        _roomRepository.IsRoomAvailable(roomId).Returns(false);

        //Act
        var result = await _createBookingUseCase.ExecuteAsync(bookerId, createBookingDto);
        var error = result.Error;

        //Assert
        error.Should().BeEquivalentTo(BookingError.RoomNotAvailable);
        await _unitOfWork.DidNotReceive().CommitTransactionAsync();
    }

}