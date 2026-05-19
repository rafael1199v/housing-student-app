namespace HousingApp.Application.Auth.DTOs;

public record GoogleRegisterDto(
    string IdToken,
    string Role
);
