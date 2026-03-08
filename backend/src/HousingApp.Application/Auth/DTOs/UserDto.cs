namespace HousingApp.Application.Auth.DTOs
{
    public record UserDto(
        string Id,
        string Email,
        string PasswordHash,
        List<string> Roles);
}