using FluentValidation;
using HousingApp.Api.Requests;

namespace HousingApp.Api.Validators;

public class StartChatRequestValidator : AbstractValidator<StartChatRequest>
{
    public StartChatRequestValidator()
    {
        RuleFor(request => request)
            .Must(request => (request.RoomId is > 0) || !string.IsNullOrWhiteSpace(request.ParticipantUserId))
            .WithMessage("Debes especificar un alojamiento válido o un destinatario para el chat.");

        RuleFor(request => request.RoomId)
            .GreaterThan(0)
            .When(request => request.RoomId is not null)
            .WithMessage("El identificador del alojamiento es inválido.");
    }
}
