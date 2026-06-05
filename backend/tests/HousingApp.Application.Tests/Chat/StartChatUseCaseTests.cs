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

    private static readonly string DirectKey = Domain.Entities.Chat.BuildDirectKey(StudentId, OwnerId);

    [Fact]
    public async Task StartChat_WhenRoomResolverFindsNoRoom_ReturnsRoomNotFound()
    {
        _chatRepository.GetRoomOwnerIdAsync(RoomId).Returns((string?)null);

        Result<ChatDto> result = await _useCase.ExecuteAsync(StudentId, RoomId, null);

        result.IsSuccess.Should().BeFalse();
        result.Error.Should().BeEquivalentTo(ChatError.RoomNotFound);
        await _unitOfWork.DidNotReceive().BeginTransactionAsync();
    }

    [Fact]
    public async Task StartChat_WhenNeitherRoomNorRecipientProvided_ReturnsRoomOrRecipientRequired()
    {
        Result<ChatDto> result = await _useCase.ExecuteAsync(StudentId, roomId: null, otherUserId: null);

        result.IsSuccess.Should().BeFalse();
        result.Error.Should().BeEquivalentTo(ChatError.RoomOrRecipientRequired);
        await _unitOfWork.DidNotReceive().BeginTransactionAsync();
    }

    [Fact]
    public async Task StartChat_WhenCallerEqualsOther_ReturnsCannotChatWithSelf()
    {
        _chatRepository.GetRoomOwnerIdAsync(RoomId).Returns(OwnerId);

        Result<ChatDto> result = await _useCase.ExecuteAsync(OwnerId, RoomId, otherUserId: null);

        result.IsSuccess.Should().BeFalse();
        result.Error.Should().BeEquivalentTo(ChatError.CannotChatWithSelf);
    }

    [Fact]
    public async Task StartChat_WhenRecipientDoesNotExist_ReturnsRecipientNotFound()
    {
        _chatRepository.GetRoomOwnerIdAsync(RoomId).Returns(OwnerId);
        _personRepository.ExistsByUserIdAsync(OwnerId).Returns(false);

        Result<ChatDto> result = await _useCase.ExecuteAsync(StudentId, RoomId, null);

        result.IsSuccess.Should().BeFalse();
        result.Error.Should().BeEquivalentTo(ChatError.RecipientNotFound);
    }

    [Fact]
    public async Task StartChat_WhenChatAlreadyExists_ReturnsExistingChatWithoutCreating()
    {
        _chatRepository.GetRoomOwnerIdAsync(RoomId).Returns(OwnerId);
        _personRepository.ExistsByUserIdAsync(OwnerId).Returns(true);
        _chatRepository.FindDirectChatIdAsync(DirectKey).Returns(42);

        Result<ChatDto> result = await _useCase.ExecuteAsync(StudentId, RoomId, null);

        result.IsSuccess.Should().BeTrue();
        result.Value.Should().BeEquivalentTo(new ChatDto(42, new[] { StudentId, OwnerId }));
        await _chatRepository.DidNotReceive()
            .CreateChatAsync(Arg.Any<Domain.Entities.Chat>(), Arg.Any<IEnumerable<string>>());
        await _unitOfWork.DidNotReceive().BeginTransactionAsync();
    }

    [Fact]
    public async Task StartChat_WhenNoExistingChat_CreatesChatAndCommits()
    {
        _chatRepository.GetRoomOwnerIdAsync(RoomId).Returns(OwnerId);
        _personRepository.ExistsByUserIdAsync(OwnerId).Returns(true);
        _chatRepository.FindDirectChatIdAsync(DirectKey).Returns((int?)null);
        _chatRepository.CreateChatAsync(Arg.Any<Domain.Entities.Chat>(), Arg.Any<IEnumerable<string>>())
            .Returns(7);

        Result<ChatDto> result = await _useCase.ExecuteAsync(StudentId, RoomId, null);

        result.IsSuccess.Should().BeTrue();
        result.Value.Should().BeEquivalentTo(new ChatDto(7, new[] { StudentId, OwnerId }));
        await _unitOfWork.Received(1).CommitTransactionAsync();
    }

    [Fact]
    public async Task StartChat_WhenRecipientProvidedDirectly_SkipsRoomResolver()
    {
        _personRepository.ExistsByUserIdAsync(OwnerId).Returns(true);
        _chatRepository.FindDirectChatIdAsync(DirectKey).Returns((int?)null);
        _chatRepository.CreateChatAsync(Arg.Any<Domain.Entities.Chat>(), Arg.Any<IEnumerable<string>>())
            .Returns(9);

        Result<ChatDto> result = await _useCase.ExecuteAsync(StudentId, roomId: null, otherUserId: OwnerId);

        result.IsSuccess.Should().BeTrue();
        result.Value.Should().BeEquivalentTo(new ChatDto(9, new[] { StudentId, OwnerId }));
        await _chatRepository.DidNotReceive().GetRoomOwnerIdAsync(Arg.Any<int>());
        await _unitOfWork.Received(1).CommitTransactionAsync();
    }
}
