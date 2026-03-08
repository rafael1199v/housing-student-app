namespace HousingApp.Application.Auth.DTOs
{
    public record RegisterDto(
        string Email,
        string Password,
        string Role,
        string FirstName,
        string LastName,
        string PhoneNumber,
        string Nationality,
        int Age,
        string Gender,
        string ImageUrl,
        string BirthDate
    );
}