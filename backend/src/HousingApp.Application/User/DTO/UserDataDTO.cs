namespace HousingApp.Application.User.DTOs;

public record UserDataDto(
    string Email,
    string FirstName,
    string LastName,
    string PhoneNumber,
    string Nationality,
    string Gender,
    string ImageUrl,
    string Birthdate
);
