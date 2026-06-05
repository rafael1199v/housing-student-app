namespace HousingApp.Application.Email;

public record ConfirmationEmailEvent(
    string Type,
    string Subject,
    string To,
    string FirstName,
    string ConfirmationLink
);
