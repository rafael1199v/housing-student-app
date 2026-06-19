using FluentValidation;
using HousingApp.Application.User.DTOs;

namespace HousingApp.Api.Validators;

public class AssignRoleDtoValidator : AbstractValidator<AssignRoleDto>
{
    public AssignRoleDtoValidator()
    {
        RuleFor(x => x.Role)
            .NotEmpty()
            .WithMessage("El rol es obligatorio.");
    }
}
