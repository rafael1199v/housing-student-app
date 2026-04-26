namespace HousingApp.Application.User.DTOs;
public record UpdateUserDTO(
    string? FirstName,
    string? LastName,
    string? PhoneNumber,
    string? Nationality,
    string? Gender,
    string? Birthdate
);