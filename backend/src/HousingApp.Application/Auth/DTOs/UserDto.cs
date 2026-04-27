namespace HousingApp.Application.Auth.DTOs;

public record UserDto(
    string Id,
    string Email,
    string RefreshToken,
    List<string> Roles);
