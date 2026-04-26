using HousingApp.Application.Services;
using HousingApp.Domain.Enums;
using Microsoft.Extensions.Configuration;
using Resend;

namespace HousingApp.Infrastructure.Services;

public class EmailService(IResend resend, IConfiguration configuration) : IEmailService
{
    public async Task SendEmailAsync(string to, string subject, string body)
    {
        string emailFrom = configuration["Resend:FromEmail"] ??
                           throw new Exception("FromEmail property not found in configuration");

        EmailMessage message = new()
        {
            From = emailFrom,
            Subject = subject,
            HtmlBody = body
        };

        message.To.Add(to);
        await resend.EmailSendAsync(message);
    }
}
