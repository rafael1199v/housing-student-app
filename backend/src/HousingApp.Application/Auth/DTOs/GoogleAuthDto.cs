namespace HousingApp.Application.Auth.DTOs;

public record GoogleAuthDto(
    bool IsNewUser,
    UserDto? UserDto
);
