using FluentValidation;
using HousingApp.Application.User.DTOs;

namespace HousingApp.Api.Validators;

public class UpdateUserDtoValidator : AbstractValidator<UpdateUserDTO>
{
    public UpdateUserDtoValidator()
    {
        RuleLevelCascadeMode = CascadeMode.Stop;

        RuleFor(x => x.FirstName)
            .NotEmpty()
            .WithMessage("El nombre es obligatorio.");

        RuleFor(x => x.LastName)
            .NotEmpty()
            .WithMessage("El apellido es obligatorio.");

        RuleFor(x => x.PhoneNumber)
            .NotEmpty()
            .WithMessage("El numero de telefono es obligatorio.");

        RuleFor(x => x.Nationality)
            .NotEmpty()
            .WithMessage("La nacionalidad es obligatoria.");

        RuleFor(x => x.Gender)
            .NotEmpty()
            .WithMessage("El genero es obligatorio.");

        RuleFor(x => x.Birthdate)
            .NotEmpty()
            .WithMessage("La fecha de nacimiento es obligatoria.")
            .Matches("^\\d{4}-\\d{2}-\\d{2}$")
            .WithMessage("La fecha de nacimiento debe estar en formato yyyy-MM-dd.");
    }
}
