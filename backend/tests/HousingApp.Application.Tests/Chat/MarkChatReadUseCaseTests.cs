using FluentAssertions;
using HousingApp.Application.Chat.UseCases;
using HousingApp.Application.Repositories;
using HousingApp.Domain.Error;
using NSubstitute;

namespace HousingApp.Application.Tests.Chat;

public class MarkChatReadUseCaseTests
{
    private const int ChatId = 5;
    private const string UserId = "user-1";
    private const int LastMessageId = 88;

    private readonly IChatRepository _chatRepository;
    private readonly MarkChatReadUseCase _useCase;

    public MarkChatReadUseCaseTests()
    {
        _chatRepository = Substitute.For<IChatRepository>();
        _useCase = new MarkChatReadUseCase(_chatRepository);
    }

    [Fact]
    public async Task MarkRead_WhenNotParticipant_ReturnsNotAParticipant()
    {
        _chatRepository.IsParticipantAsync(ChatId, UserId).Returns(false);

        Result<bool> result = await _useCase.ExecuteAsync(UserId, ChatId, LastMessageId);

        result.IsSuccess.Should().BeFalse();
        result.Error.Should().BeEquivalentTo(ChatError.NotAParticipant);
        await _chatRepository.DidNotReceive().MarkAsReadAsync(Arg.Any<int>(), Arg.Any<string>(), Arg.Any<int>());
    }

    [Fact]
    public async Task MarkRead_WhenParticipant_UpdatesReadPointer()
    {
        _chatRepository.IsParticipantAsync(ChatId, UserId).Returns(true);
        _chatRepository.MarkAsReadAsync(ChatId, UserId, LastMessageId).Returns(true);

        Result<bool> result = await _useCase.ExecuteAsync(UserId, ChatId, LastMessageId);

        result.IsSuccess.Should().BeTrue();
        result.Value.Should().BeTrue();
        await _chatRepository.Received(1).MarkAsReadAsync(ChatId, UserId, LastMessageId);
    }
}
