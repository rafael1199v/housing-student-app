using FluentAssertions;
using HousingApp.Application.Chat.DTOs;
using HousingApp.Application.Chat.UseCases;
using HousingApp.Application.Repositories;
using HousingApp.Domain.Error;
using NSubstitute;

namespace HousingApp.Application.Tests.Chat;

public class SendMessageUseCaseTests
{
    private const int ChatId = 5;
    private const string SenderId = "user-1";

    private readonly IChatRepository _chatRepository;
    private readonly SendMessageUseCase _useCase;

    public SendMessageUseCaseTests()
    {
        _chatRepository = Substitute.For<IChatRepository>();
        _useCase = new SendMessageUseCase(_chatRepository);
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    public async Task SendMessage_WhenMessageIsEmpty_ReturnsEmptyMessage(string message)
    {
        Result<MessageDto> result = await _useCase.ExecuteAsync(SenderId, ChatId, message);

        result.IsSuccess.Should().BeFalse();
        result.Error.Should().BeEquivalentTo(ChatError.EmptyMessage);
        await _chatRepository.DidNotReceive().AddMessageAsync(Arg.Any<Domain.Entities.ChatMessage>());
    }

    [Fact]
    public async Task SendMessage_WhenMessageTooLong_ReturnsMessageTooLong()
    {
        string message = new('a', 1025);

        Result<MessageDto> result = await _useCase.ExecuteAsync(SenderId, ChatId, message);

        result.IsSuccess.Should().BeFalse();
        result.Error.Code.Should().Be("chat.message.too.long");
        await _chatRepository.DidNotReceive().AddMessageAsync(Arg.Any<Domain.Entities.ChatMessage>());
    }

    [Fact]
    public async Task SendMessage_WhenSenderIsNotParticipant_ReturnsNotAParticipant()
    {
        _chatRepository.IsParticipantAsync(ChatId, SenderId).Returns(false);

        Result<MessageDto> result = await _useCase.ExecuteAsync(SenderId, ChatId, "hello");

        result.IsSuccess.Should().BeFalse();
        result.Error.Should().BeEquivalentTo(ChatError.NotAParticipant);
        await _chatRepository.DidNotReceive().AddMessageAsync(Arg.Any<Domain.Entities.ChatMessage>());
    }

    [Fact]
    public async Task SendMessage_WhenValid_PersistsTrimmedMessageAndReturnsDto()
    {
        _chatRepository.IsParticipantAsync(ChatId, SenderId).Returns(true);
        MessageDto persisted = new(99, ChatId, SenderId, "Jane Doe", "hello", DateTime.UtcNow);
        _chatRepository.AddMessageAsync(Arg.Any<Domain.Entities.ChatMessage>()).Returns(persisted);

        Result<MessageDto> result = await _useCase.ExecuteAsync(SenderId, ChatId, "  hello  ");

        result.IsSuccess.Should().BeTrue();
        result.Value.Should().BeEquivalentTo(persisted);
        await _chatRepository.Received(1)
            .AddMessageAsync(Arg.Is<Domain.Entities.ChatMessage>(m => m.Message == "hello" && m.ChatId == ChatId));
    }
}
