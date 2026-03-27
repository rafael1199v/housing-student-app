using FluentValidation;
using HousingApp.Api.Requests;
using System.Data;

namespace HousingApp.Api.Validators
{
    public class CreateRoomRequestValidator : AbstractValidator<CreateRoomRequest>
    {
        public CreateRoomRequestValidator()
        {
            RuleFor(createRoomRequest => createRoomRequest.Name)
                .NotEmpty()
                .WithMessage("El nombre es obligatorio.");

            RuleFor(createRoomRequest => createRoomRequest.Description)
                .NotEmpty()
                .WithMessage("La descripcion es obligatoria");

            RuleFor(createRoomRequest => createRoomRequest.Price)
                .GreaterThan(0)
                .WithMessage("El precio debe ser mayor a 0");

            RuleFor(createRoomRequest => createRoomRequest.Latitude)
                .GreaterThanOrEqualTo(-90)
                .WithMessage("La latitud debe ser mayor a -90")
                .LessThanOrEqualTo(90)
                .WithMessage("La latitud debe ser menor a 90");

            RuleFor(createRoomRequest => createRoomRequest.Longitude)
                .GreaterThanOrEqualTo(-180)
                .WithMessage("La longitud debe ser mayor a -180")
                .LessThanOrEqualTo(180)
                .WithMessage("La longitud debe ser menor a 180");

        }
    }
}