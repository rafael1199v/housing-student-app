using FluentAssertions;
using HousingApp.Application.Booking.DTO;
using HousingApp.Application.Booking.UseCases;
using HousingApp.Application.Repositories;
using HousingApp.Application.UnitOfWork;
using HousingApp.Domain.Enums;
using HousingApp.Domain.Error;
using Microsoft.Extensions.Logging.Abstractions;
using NSubstitute;

namespace HousingApp.Application.Tests.Booking;

public class CreateBookingUseCaseTests
{
    private readonly IBookingRepository _bookingRepository;
    private readonly CreateBookingUseCase _createBookingUseCase;
    private readonly IPersonRepository _personRepository;
    private readonly IRoomRepository _roomRepository;

    private readonly IBookingUnitOfWork _unitOfWork;


    public CreateBookingUseCaseTests()
    {
        _roomRepository = Substitute.For<IRoomRepository>();
        _bookingRepository = Substitute.For<IBookingRepository>();
        _personRepository = Substitute.For<IPersonRepository>();

        _unitOfWork = Substitute.For<IBookingUnitOfWork>();
        _unitOfWork.PersonRepository.Returns(_personRepository);
        _unitOfWork.RoomRepository.Returns(_roomRepository);
        _unitOfWork.BookingRepository.Returns(_bookingRepository);

        _createBookingUseCase = new CreateBookingUseCase(_unitOfWork, NullLogger<CreateBookingUseCase>.Instance);
    }


    [Fact]
    public async Task CreateBooking_ShouldReturnCreateBookingDto()
    {
        //Arrange
        const int roomId = 50;
        string bookerId = Guid.NewGuid().ToString();
        CreateBookingDto createBookingDto = new(roomId);
        CreatedBookingDto expectedCreatedBookingDto = new(
            roomId,
            bookerId,
            nameof(BookingStatus.Pending)
        );

        _personRepository.ExistsByUserIdAsync(bookerId).Returns(true);
        _bookingRepository.UserHasAlreadyBooked(bookerId, roomId).Returns(false);
        _roomRepository.GetRoomOwnerIdAsync(roomId).Returns(Guid.NewGuid().ToString());
        _roomRepository.IsRoomAvailable(roomId).Returns(true);

        //Act
        Result<CreatedBookingDto> result = await _createBookingUseCase.ExecuteAsync(bookerId, createBookingDto);
        CreatedBookingDto? createdBookingDto = result.Value;

        //Assert
        createdBookingDto.Should().BeEquivalentTo(expectedCreatedBookingDto);
        await _unitOfWork.Received(1).CommitTransactionAsync();
    }

    [Fact]
    public async Task CreateBooking_WhenUserHasAlreadyBooked_ShouldReturnRoomAlreadyBookedError()
    {
        //Arrange
        const int roomId = 50;
        string bookerId = Guid.NewGuid().ToString();
        CreateBookingDto createBookingDto = new(roomId);


        _personRepository.ExistsByUserIdAsync(bookerId).Returns(true);
        _bookingRepository.UserHasAlreadyBooked(bookerId, roomId).Returns(true);

        //Act
        Result<CreatedBookingDto> result = await _createBookingUseCase.ExecuteAsync(bookerId, createBookingDto);
        Error error = result.Error;

        //Assert
        error.Should().BeEquivalentTo(BookingError.RoomAlreadyBooked);
        await _unitOfWork.DidNotReceive().CommitTransactionAsync();
    }

    [Fact]
    public async Task CreateBooking_WhenRoomIsNotAvailable_ShouldReturnRoomNotAvailableError()
    {
        //Arrange
        const int roomId = 50;
        string bookerId = Guid.NewGuid().ToString();
        CreateBookingDto createBookingDto = new(roomId);

        _personRepository.ExistsByUserIdAsync(bookerId).Returns(true);
        _bookingRepository.UserHasAlreadyBooked(bookerId, roomId).Returns(false);
        _roomRepository.GetRoomOwnerIdAsync(roomId).Returns(Guid.NewGuid().ToString());
        _roomRepository.IsRoomAvailable(roomId).Returns(false);

        //Act
        Result<CreatedBookingDto> result = await _createBookingUseCase.ExecuteAsync(bookerId, createBookingDto);
        Error error = result.Error;

        //Assert
        error.Should().BeEquivalentTo(BookingError.RoomNotAvailable);
        await _unitOfWork.DidNotReceive().CommitTransactionAsync();
    }

    [Fact]
    public async Task CreateBooking_WhenBookerOwnsRoom_ShouldReturnCannotBookOwnRoomError()
    {
        //Arrange
        const int roomId = 50;
        string bookerId = Guid.NewGuid().ToString();
        CreateBookingDto createBookingDto = new(roomId);

        _personRepository.ExistsByUserIdAsync(bookerId).Returns(true);
        _bookingRepository.UserHasAlreadyBooked(bookerId, roomId).Returns(false);
        _roomRepository.GetRoomOwnerIdAsync(roomId).Returns(bookerId);

        //Act
        Result<CreatedBookingDto> result = await _createBookingUseCase.ExecuteAsync(bookerId, createBookingDto);
        Error error = result.Error;

        //Assert
        error.Should().BeEquivalentTo(BookingError.CannotBookOwnRoom);
        await _unitOfWork.DidNotReceive().BeginTransactionAsync();
        await _unitOfWork.DidNotReceive().CommitTransactionAsync();
    }
}
