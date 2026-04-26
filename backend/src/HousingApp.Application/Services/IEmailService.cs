using HousingApp.Domain.Enums;

namespace HousingApp.Application.Services;

public interface IEmailService
{
    Task SendEmailAsync(string to, string subject, string body);
}
