using FluentAssertions;
using HousingApp.Application.Chat.DTOs;
using HousingApp.Application.Chat.UseCases;
using HousingApp.Application.Repositories;
using HousingApp.Domain.Error;
using NSubstitute;

namespace HousingApp.Application.Tests.Chat;

public class GetChatMessagesUseCaseTests
{
    private const int ChatId = 5;
    private const string UserId = "user-1";

    private readonly IChatRepository _chatRepository;
    private readonly GetChatMessagesUseCase _useCase;

    public GetChatMessagesUseCaseTests()
    {
        _chatRepository = Substitute.For<IChatRepository>();
        _useCase = new GetChatMessagesUseCase(_chatRepository);
    }

    [Fact]
    public async Task GetMessages_WhenNotParticipant_ReturnsNotAParticipant()
    {
        _chatRepository.IsParticipantAsync(ChatId, UserId).Returns(false);

        Result<List<MessageDto>> result = await _useCase.ExecuteAsync(UserId, ChatId, beforeMessageId: null, pageSize: 20);

        result.IsSuccess.Should().BeFalse();
        result.Error.Should().BeEquivalentTo(ChatError.NotAParticipant);
        await _chatRepository.DidNotReceive().GetMessagesAsync(Arg.Any<int>(), Arg.Any<int?>(), Arg.Any<int>());
    }

    [Theory]
    [InlineData(0, 30)]    // non-positive falls back to default
    [InlineData(20, 20)]   // honoured as-is
    [InlineData(500, 100)] // clamped to max
    public async Task GetMessages_ClampsPageSize(int requested, int expected)
    {
        _chatRepository.IsParticipantAsync(ChatId, UserId).Returns(true);
        _chatRepository.GetMessagesAsync(ChatId, null, expected).Returns([]);

        Result<List<MessageDto>> result = await _useCase.ExecuteAsync(UserId, ChatId, beforeMessageId: null, pageSize: requested);

        result.IsSuccess.Should().BeTrue();
        await _chatRepository.Received(1).GetMessagesAsync(ChatId, null, expected);
    }
}
