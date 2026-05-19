namespace HousingApp.Application.Auth.DTOs;

public record GoogleUserInfoDto(
    string FullName,
    string Email,
    string? GivenName,
    string? FamilyName,
    string? Picture,
    string? GoogleId
);
