namespace HousingApp.Domain.Entities;

public class Person
{
    public string Id { get; init; } = string.Empty;
    public string FirstName { get; init; } = string.Empty;
    public string? LastName { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string? PhoneNumber { get; init; } = string.Empty;
    public string? Nationality { get; init; } = string.Empty;
    public string? Gender { get; init; } = string.Empty;
    public string? ImageUrl { get; init; } = string.Empty;
    public DateOnly? BirthDate { get; init; }

    public User? User { get; init; }

    public static Person CreatePerson(
        string firstName,
        string lastName,
        string email,
        string phoneNumber,
        string nationality,
        string gender,
        string imageUrl,
        DateOnly birthDate)
    {
        return new Person
        {
            FirstName = firstName,
            LastName = lastName,
            Email = email,
            PhoneNumber = phoneNumber,
            Nationality = nationality,
            Gender = gender,
            ImageUrl = imageUrl,
            BirthDate = birthDate
        };
    }

    public static Person CreatePerson(
        string id,
        string firstName,
        string lastName,
        string email,
        string phoneNumber,
        string nationality,
        string gender,
        string imageUrl,
        DateOnly birthDate,
        User? user)
    {
        return new Person
        {
            Id = id,
            FirstName = firstName,
            LastName = lastName,
            Email = email,
            PhoneNumber = phoneNumber,
            Nationality = nationality,
            Gender = gender,
            BirthDate = birthDate,
            ImageUrl = imageUrl,
            User = user
        };
    }
}
