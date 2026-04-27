namespace HousingApp.Application.Auth.DTOs;

public record ConfirmEmailDto(
    string UserId,
    string Token
);
