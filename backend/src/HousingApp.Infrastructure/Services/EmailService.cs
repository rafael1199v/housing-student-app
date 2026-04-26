using HousingApp.Application.Services;
using HousingApp.Domain.Enums;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Resend;

namespace HousingApp.Infrastructure.Services;

public class EmailService(IResend resend, IConfiguration configuration, ILogger<EmailService> logger) : IEmailService
{
    public async Task SendEmailAsync(string to, string subject, EmailMessageType type)
    {
        try
        {
            string emailFrom = configuration["Resend:FromEmail"] ??
                               throw new Exception("FromEmail property not found in configuration");
            EmailMessage message = new()
            {
                From = emailFrom,
                Subject = subject,
                HtmlBody = "<strong>Hi, this is an email from itersapiens team</strong>"
            };

            message.To.Add(to);
            await resend.EmailSendAsync(message);
        }
        catch (Exception e)
        {
            logger.LogError(e, "Error sending email: {Message}", e.Message);
        }
    }
}
