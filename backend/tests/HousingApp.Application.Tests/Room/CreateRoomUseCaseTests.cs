using FluentAssertions;
using HousingApp.Application.Repositories;
using HousingApp.Application.Room;
using HousingApp.Application.Room.DTOs;
using HousingApp.Application.Room.Upload;
using HousingApp.Application.Room.UseCases;
using HousingApp.Application.Storage;
using HousingApp.Application.UnitOfWork;
using HousingApp.Domain.Enums;
using HousingApp.Domain.Error;
using NSubstitute;

namespace HousingApp.Application.Tests.Room;

public class CreateRoomUseCaseTests
{
    private readonly CreateRoomUseCase _createRoomUseCase;
    private readonly IRoomUnitOfWork _unitOfWork;
    private readonly IStorageService _storageService;

    private readonly IRoomRepository _roomRepository;
    private readonly IPersonRepository _personRepository;

    public CreateRoomUseCaseTests()
    {
        _roomRepository = Substitute.For<IRoomRepository>();
        _personRepository = Substitute.For<IPersonRepository>();

        _unitOfWork = Substitute.For<IRoomUnitOfWork>();
        _storageService = Substitute.For<IStorageService>();

        _unitOfWork.RoomRepository.Returns(_roomRepository);
        _unitOfWork.PersonRepository.Returns(_personRepository);

        _createRoomUseCase = new CreateRoomUseCase(_unitOfWork, _storageService);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(1)]
    [InlineData(5)]
    public async Task CreateRoom_ShouldReturnNewRoomData(int roomImageQuantity)
    {
        //Arrange
        string userId = Guid.NewGuid().ToString();
        string roomImageId = Guid.NewGuid().ToString();
        List<ImageRoomUpload> images = [.. Enumerable.Range(1, roomImageQuantity)
            .Select(i => new ImageRoomUpload(
                    OpenStream: () => new MemoryStream([0xFF, 0xD8, 0xFF]),
                    FileName: $"room-image-{i}.jpeg",
                    ContentType: "image/jpeg"
                )
            )];
        CreateRoomDto createRoomDto = new(
            Name: "Room test",
            Description: "Room test description",
            Latitude: 90,
            Longitude: 180,
            Price: 1000,
            RoomStatusId: (int)RoomStatus.Available,
            Images: images
        );

        const int newRoomId = 1;

        CreatedRoomDto expectedCreatedRoomDto = new(
            Name: createRoomDto.Name,
            Description: createRoomDto.Description,
            Latitude: createRoomDto.Latitude,
            Longitude: createRoomDto.Longitude,
            Price: createRoomDto.Price,
            RoomStatus: ((RoomStatus)createRoomDto.RoomStatusId).ToString(),
            ImageRoomUrls: Enumerable.Repeat(roomImageId, roomImageQuantity).ToList()
        );


        _personRepository.ExistsByUserIdAsync(userId).Returns(true);
        _roomRepository.CreateRoomAsync(Arg.Any<Domain.Entities.Room>()).Returns(newRoomId);

        _storageService.UploadAsync(
            Arg.Any<Func<Stream>>(),
            Arg.Any<string>(),
            Arg.Any<string>(),
            Arg.Any<StorageType>(),
            Arg.Any<string>(),
            CancellationToken.None
        ).Returns(roomImageId);

        //Act
        Result<CreatedRoomDto> result = await _createRoomUseCase.ExecuteAsync(userId, createRoomDto, CancellationToken.None);
        CreatedRoomDto? createdRoomDto = result.Value;

        //Assert
        createdRoomDto.Should().BeEquivalentTo(expectedCreatedRoomDto);
        await _unitOfWork.Received(1).BeginTransactionAsync();
        await _unitOfWork.Received(1).CommitTransactionAsync();
    }

    [Fact]
    public async Task CreateRoom_HouseholderDoesNotExist_ShouldReturnHouseholderNotFoundError()
    {
        //Arrange
        string userId = Guid.NewGuid().ToString();
        CreateRoomDto createRoomDto = new(
            Name: "Room test",
            Description: "Room test description",
            Latitude: 90,
            Longitude: 180,
            Price: 1000,
            RoomStatusId: (int)RoomStatus.Available,
            Images: []
        );

        _personRepository.ExistsByUserIdAsync(userId).Returns(false);

        //Act
        Result<CreatedRoomDto> result = await _createRoomUseCase.ExecuteAsync(userId, createRoomDto, CancellationToken.None);
        Error householderNotFoundError = result.Error;

        //Assert
        householderNotFoundError.Should().BeEquivalentTo(RoomError.HouseholderNotFound);
        await _personRepository.Received(1).ExistsByUserIdAsync(userId);
    }


    [Theory]
    [InlineData(0)]
    [InlineData(-1)]
    [InlineData(50)]
    public async Task CreateRoom_InvalidRoomStatus_ShouldReturnInvalidRoomStatusError(int roomStatusId)
    {
        //Arrange
        string userId = Guid.NewGuid().ToString();
        CreateRoomDto createRoomDto = new(
            Name: "Room test",
            Description: "Room test description",
            Latitude: 90,
            Longitude: 180,
            Price: 1000,
            RoomStatusId: roomStatusId,
            Images: []
        );

        _personRepository.ExistsByUserIdAsync(userId).Returns(true);

        //Act
        Result<CreatedRoomDto> result = await _createRoomUseCase.ExecuteAsync(userId, createRoomDto, CancellationToken.None);
        Error error = result.Error;

        //Assert
        error.Should().BeEquivalentTo(RoomError.InvalidRoomStatus);
        await _personRepository.Received(1).ExistsByUserIdAsync(userId);
    }

    [Fact]
    public async Task CreateRoom_BookedRoomStatus_ShouldReturnInvalidRoomStatusError()
    {
        //Arrange
        string userId = Guid.NewGuid().ToString();
        CreateRoomDto createRoomDto = new(
            Name: "Room test",
            Description: "Room test description",
            Latitude: 90,
            Longitude: 180,
            Price: 1000,
            RoomStatusId: (int)RoomStatus.Booked,
            Images: []
        );

        _personRepository.ExistsByUserIdAsync(userId).Returns(true);

        //Act
        Result<CreatedRoomDto> result = await _createRoomUseCase.ExecuteAsync(userId, createRoomDto, CancellationToken.None);
        Error error = result.Error;

        //Assert
        error.Should().BeEquivalentTo(RoomError.InvalidRoomStatus);
        await _personRepository.Received(1).ExistsByUserIdAsync(userId);
    }

    [Theory]
    [InlineData("application/pdf", "pdf")]
    [InlineData("text/plain", "txt")]
    [InlineData("video/mp4", "mp4")]
    [InlineData("audio/mpeg", "mp3")]
    public async Task CreateRoom_NonImageFiles_ShouldReturnInvalidImageTypeError(string contentType, string extension)
    {
        //Arrange
        string userId = Guid.NewGuid().ToString();
        CreateRoomDto createRoomDto = new(
            Name: "Room test",
            Description: "Room test description",
            Latitude: 90,
            Longitude: 180,
            Price: 1000,
            RoomStatusId: (int)RoomStatus.Available,
            Images:
            [
                new ImageRoomUpload(
                    OpenStream: () => new MemoryStream([0xFF, 0xD8, 0xFF]),
                    FileName: $"room-image.{extension}",
                    ContentType: contentType
                )
            ]
        );

        _personRepository.ExistsByUserIdAsync(userId).Returns(true);

        //Act
        Result<CreatedRoomDto> result = await _createRoomUseCase.ExecuteAsync(userId, createRoomDto, CancellationToken.None);
        Error error = result.Error;

        //Assert
        error.Should().BeEquivalentTo(RoomError.InvalidImageType);
        await _personRepository.Received(1).ExistsByUserIdAsync(userId);
    }

    [Theory]
    [InlineData(6)]
    [InlineData(15)]
    public async Task CreateRoom_MaxImagesExceeded_ShouldReturnMaxImagesExceededError(int roomImageQuantity)
    {
        //Arrange
        string userId = Guid.NewGuid().ToString();
        List<ImageRoomUpload> images = [.. Enumerable.Range(1, roomImageQuantity)
            .Select(i => new ImageRoomUpload(
                    OpenStream: () => new MemoryStream([0xFF, 0xD8, 0xFF]),
                    FileName: $"room-image-{i}.jpeg",
                    ContentType: "image/jpeg"
                )
            )];
        CreateRoomDto createRoomDto = new(
            Name: "Room test",
            Description: "Room test description",
            Latitude: 90,
            Longitude: 180,
            Price: 1000,
            RoomStatusId: (int)RoomStatus.Available,
            Images: images
        );

        _personRepository.ExistsByUserIdAsync(userId).Returns(true);

        //Act
        Result<CreatedRoomDto> result = await _createRoomUseCase.ExecuteAsync(userId, createRoomDto, CancellationToken.None);
        Error error = result.Error;

        //Assert
        error.Should().BeEquivalentTo(RoomError.MaxImagesExceeded(Images.MaxImagesAllowed));
        await _personRepository.Received(1).ExistsByUserIdAsync(userId);
    }

}
