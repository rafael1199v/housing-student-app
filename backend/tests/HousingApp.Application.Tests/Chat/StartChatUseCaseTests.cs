using FluentAssertions;
using HousingApp.Application.Chat.DTOs;
using HousingApp.Application.Chat.UseCases;
using HousingApp.Application.Repositories;
using HousingApp.Application.UnitOfWork;
using HousingApp.Domain.Error;
using Microsoft.Extensions.Logging.Abstractions;
using NSubstitute;

namespace HousingApp.Application.Tests.Chat;

public class StartChatUseCaseTests
{
    private const int RoomId = 10;
    private const string OwnerId = "owner-1";
    private const string StudentId = "student-1";

    private readonly IChatRepository _chatRepository;
    private readonly IPersonRepository _personRepository;
    private readonly IChatUnitOfWork _unitOfWork;
    private readonly StartChatUseCase _useCase;

    public StartChatUseCaseTests()
    {
        _chatRepository = Substitute.For<IChatRepository>();
        _personRepository = Substitute.For<IPersonRepository>();

        _unitOfWork = Substitute.For<IChatUnitOfWork>();
        _unitOfWork.ChatRepository.Returns(_chatRepository);
        _unitOfWork.PersonRepository.Returns(_personRepository);

        _useCase = new StartChatUseCase(_unitOfWork, NullLogger<StartChatUseCase>.Instance);
    }

    [Fact]
    public async Task StartChat_WhenRoomDoesNotExist_ReturnsRoomNotFound()
    {
        (string OwnerId, string RoomName)? noRoom = null;
        _chatRepository.GetRoomOwnerAsync(RoomId).Returns(noRoom);

        Result<ChatDto> result = await _useCase.ExecuteAsync(StudentId, RoomId, null);

        result.IsSuccess.Should().BeFalse();
        result.Error.Should().BeEquivalentTo(ChatError.RoomNotFound);
        await _unitOfWork.DidNotReceive().BeginTransactionAsync();
    }

    [Fact]
    public async Task StartChat_WhenHouseholderInitiatesWithoutRecipient_ReturnsRecipientRequired()
    {
        (string OwnerId, string RoomName)? room = (OwnerId, "Room A");
        _chatRepository.GetRoomOwnerAsync(RoomId).Returns(room);

        Result<ChatDto> result = await _useCase.ExecuteAsync(OwnerId, RoomId, otherUserId: null);

        result.IsSuccess.Should().BeFalse();
        result.Error.Should().BeEquivalentTo(ChatError.RecipientRequired);
    }

    [Fact]
    public async Task StartChat_WhenCallerEqualsOther_ReturnsCannotChatWithSelf()
    {
        (string OwnerId, string RoomName)? room = (OwnerId, "Room A");
        _chatRepository.GetRoomOwnerAsync(RoomId).Returns(room);

        Result<ChatDto> result = await _useCase.ExecuteAsync(OwnerId, RoomId, otherUserId: OwnerId);

        result.IsSuccess.Should().BeFalse();
        result.Error.Should().BeEquivalentTo(ChatError.CannotChatWithSelf);
    }

    [Fact]
    public async Task StartChat_WhenRecipientDoesNotExist_ReturnsRecipientNotFound()
    {
        (string OwnerId, string RoomName)? room = (OwnerId, "Room A");
        _chatRepository.GetRoomOwnerAsync(RoomId).Returns(room);
        _personRepository.ExistsByUserIdAsync(OwnerId).Returns(false);

        Result<ChatDto> result = await _useCase.ExecuteAsync(StudentId, RoomId, null);

        result.IsSuccess.Should().BeFalse();
        result.Error.Should().BeEquivalentTo(ChatError.RecipientNotFound);
    }

    [Fact]
    public async Task StartChat_WhenChatAlreadyExists_ReturnsExistingChatWithoutCreating()
    {
        (string OwnerId, string RoomName)? room = (OwnerId, "Room A");
        _chatRepository.GetRoomOwnerAsync(RoomId).Returns(room);
        _personRepository.ExistsByUserIdAsync(OwnerId).Returns(true);
        _chatRepository.FindRoomChatIdAsync(RoomId, StudentId, OwnerId).Returns(42);

        Result<ChatDto> result = await _useCase.ExecuteAsync(StudentId, RoomId, null);

        result.IsSuccess.Should().BeTrue();
        result.Value.Should().BeEquivalentTo(new ChatDto(42, RoomId));
        await _chatRepository.DidNotReceive()
            .CreateChatAsync(Arg.Any<Domain.Entities.Chat>(), Arg.Any<IEnumerable<string>>());
        await _unitOfWork.DidNotReceive().BeginTransactionAsync();
    }

    [Fact]
    public async Task StartChat_WhenNoExistingChat_CreatesChatAndCommits()
    {
        (string OwnerId, string RoomName)? room = (OwnerId, "Room A");
        _chatRepository.GetRoomOwnerAsync(RoomId).Returns(room);
        _personRepository.ExistsByUserIdAsync(OwnerId).Returns(true);
        _chatRepository.FindRoomChatIdAsync(RoomId, StudentId, OwnerId).Returns((int?)null);
        _chatRepository.CreateChatAsync(Arg.Any<Domain.Entities.Chat>(), Arg.Any<IEnumerable<string>>())
            .Returns(7);

        Result<ChatDto> result = await _useCase.ExecuteAsync(StudentId, RoomId, null);

        result.IsSuccess.Should().BeTrue();
        result.Value.Should().BeEquivalentTo(new ChatDto(7, RoomId));
        await _unitOfWork.Received(1).CommitTransactionAsync();
    }
}
