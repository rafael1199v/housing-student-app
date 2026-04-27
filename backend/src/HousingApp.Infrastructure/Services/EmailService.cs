using HousingApp.Application.Services;
using HousingApp.Application.Utils;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
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

    public async Task SendConfirmationEmailAsync(string to, string firstName, string confirmationLink)
    {
        string body = EmailTemplateUtil.BuildConfirmationTemplateContent(firstName, confirmationLink);
        await SendEmailAsync(to: to, subject: "Confirm your email", body: body);
    }
}
