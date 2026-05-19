namespace HousingApp.Application.Auth.DTOs;

public record GoogleAuthDto(
    bool IsNewUser,
    CredentialsDto? Credentials
);
