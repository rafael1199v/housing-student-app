using Amazon.Extensions.NETCore.Setup;
using Amazon.Runtime;
using Amazon.S3;
using Amazon.SQS;
using HousingApp.Application.Storage;
using HousingApp.Infrastructure.MessageQueue;
using HousingApp.Infrastructure.Storage;

namespace HousingApp.Api.Extensions;

public static class AwsExtensions
{
    public static IServiceCollection AddAwsConfiguration(this IServiceCollection services, IConfiguration configuration)
    {
        AWSCredentials credentials = new BasicAWSCredentials(
            configuration["AWS:AccessKey"],
            configuration["AWS:SecretKey"]);

        AWSOptions awsOptions = configuration.GetAWSOptions();
        awsOptions.Credentials = credentials;

        services.AddDefaultAWSOptions(awsOptions);

        services.AddAWSService<IAmazonS3>();
        services.AddAWSService<IAmazonSQS>();

        services.Configure<StorageSettings>(
            configuration.GetSection("Storage"));

        services.Configure<QueueSettings>(
            configuration.GetSection("Queues"));

        services.AddScoped<IStorageService, S3StorageService>();

        return services;
    }
}
