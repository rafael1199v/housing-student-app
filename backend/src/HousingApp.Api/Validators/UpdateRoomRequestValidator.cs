using FluentValidation;
using HousingApp.Api.Requests;

namespace HousingApp.Api.Validators;

public class UpdateRoomRequestValidator : AbstractValidator<UpdateRoomRequest>
{
    public UpdateRoomRequestValidator()
    {
        RuleFor(updateRoomRequest => updateRoomRequest.Name)
            .NotEmpty()
            .WithMessage("El nombre es obligatorio.");

        RuleFor(updateRoomRequest => updateRoomRequest.Description)
            .NotEmpty()
            .WithMessage("La descripcion es obligatoria");

        RuleFor(updateRoomRequest => updateRoomRequest.Price)
            .GreaterThan(0)
            .WithMessage("El precio debe ser mayor a 0");

        RuleFor(updateRoomRequest => updateRoomRequest.Latitude)
            .GreaterThanOrEqualTo(-90)
            .WithMessage("La latitud debe ser mayor a -90")
            .LessThanOrEqualTo(90)
            .WithMessage("La latitud debe ser menor a 90");

        RuleFor(updateRoomRequest => updateRoomRequest.Longitude)
            .GreaterThanOrEqualTo(-180)
            .WithMessage("La longitud debe ser mayor a -180")
            .LessThanOrEqualTo(180)
            .WithMessage("La longitud debe ser menor a 180");
    }
}
