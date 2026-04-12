using FluentValidation;
using HousingApp.Application.Auth.DTOs;

namespace HousingApp.Api.Validators;

public class RegisterDtoValidator : AbstractValidator<RegisterDto>
{
    public RegisterDtoValidator()
    {
        RuleLevelCascadeMode = CascadeMode.Stop;

        RuleFor(x => x.Email)
            .NotEmpty()
            .WithMessage("El email es obligatorio.")
            .EmailAddress()
            .WithMessage("El email no tiene un formato válido.");

        RuleFor(x => x.Password)
            .NotEmpty()
            .WithMessage("La contraseña es obligatoria.")
            .MinimumLength(6)
            .WithMessage("La contraseña debe tener al menos 6 caracteres.")
            .Matches("[A-Z]")
            .WithMessage("La contraseña debe tener al menos una mayúscula.")
            .Matches("[a-z]")
            .WithMessage("La contraseña debe tener al menos una minúscula.")
            .Matches("[0-9]")
            .WithMessage("La contraseña debe tener al menos un número.")
            .Matches("[^a-zA-Z0-9]")
            .WithMessage("La contraseña debe tener al menos un carácter especial.");

        RuleFor(x => x.Role)
            .NotEmpty()
            .WithMessage("El rol es obligatorio.");

        RuleFor(x => x.FirstName)
            .NotEmpty()
            .WithMessage("El nombre es obligatorio.");

        RuleFor(x => x.LastName)
            .NotEmpty()
            .WithMessage("El apellido es obligatorio.");

        RuleFor(x => x.PhoneNumber)
            .NotEmpty()
            .WithMessage("El número de teléfono es obligatorio.");

        RuleFor(x => x.Nationality)
            .NotEmpty()
            .WithMessage("La nacionalidad es obligatoria.");

        RuleFor(x => x.Gender)
            .NotEmpty()
            .WithMessage("El género es obligatorio.");

        RuleFor(x => x.BirthDate)
            .NotEmpty()
            .WithMessage("La fecha de nacimiento es obligatoria.");
    }
}
