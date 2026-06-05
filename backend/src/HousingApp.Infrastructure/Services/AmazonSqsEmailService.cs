using Amazon.SQS;
using Amazon.SQS.Model;
using HousingApp.Application.Email;
using HousingApp.Application.Services;
using HousingApp.Infrastructure.MessageQueue;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Text.Json;

namespace HousingApp.Infrastructure.Services;

public class AmazonSqsEmailService(IAmazonSQS sqsClient, IOptions<QueueSettings> settings, ILogger<AmazonSqsEmailService> logger) : IEmailService
{
    public async Task SendConfirmationEmailAsync(string to, string firstName, string confirmationLink)
    {
        ConfirmationEmailEvent confirmationEmailEvent = new(
            Type: "ConfirmationEmail",
            Subject: "Confirm your email",
            To: to,
            FirstName: firstName,
            ConfirmationLink: confirmationLink
        );

        try
        {
            SendMessageRequest request = new(settings.Value.EmailQueueUrl,
                JsonSerializer.Serialize(confirmationEmailEvent, new JsonSerializerOptions(JsonSerializerDefaults.Web)));

            logger.LogInformation("Sending email confirmation: {@request}", request);
            await sqsClient.SendMessageAsync(request);
        }
        catch (AmazonSQSException e)
        {
            logger.LogError(e, "There was an error sending the event to the queue with the data: {@confirmationEmailEvent}. Message: {Message}", confirmationEmailEvent, e.Message);
        }

    }
}
