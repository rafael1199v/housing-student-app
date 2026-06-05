using HousingApp.Domain.Enums;

namespace HousingApp.Application.Services;

public interface IEmailService
{
    Task SendConfirmationEmailAsync(string to, string firstName, string confirmationLink);
}
