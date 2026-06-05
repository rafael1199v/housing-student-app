using FluentValidation;
using HousingApp.Api.Requests;

namespace HousingApp.Api.Validators;

public class StartChatRequestValidator : AbstractValidator<StartChatRequest>
{
    public StartChatRequestValidator()
    {
        RuleFor(request => request.RoomId)
            .GreaterThan(0)
            .WithMessage("El identificador del alojamiento es inválido.");
    }
}
