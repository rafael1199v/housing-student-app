namespace HousingApp.Application.Auth.DTOs;

public record GoogleAuthResponseDto(
    bool IsNewUser,
    CredentialsDto? Credentials = null
);
