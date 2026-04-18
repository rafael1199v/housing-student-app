namespace HousingApp.Application.Auth.DTOs;

public record UserDto(
    string Id,
    string Email,
    string PasswordHash,
    string RefreshToken,
    List<string> Roles);
