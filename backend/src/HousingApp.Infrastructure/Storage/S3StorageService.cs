using Amazon.S3;
using Amazon.S3.Model;
using HousingApp.Application.Storage;
using Microsoft.Extensions.Options;

namespace HousingApp.Infrastructure.Storage
{
    public class S3StorageService(IAmazonS3 s3Client, IOptions<StorageSettings> settings) : IStorageService
    {
        public async Task<string> UploadAsync(Func<Stream> openStream, string fileName, string contentType, StorageType storageType, string entityId,
            CancellationToken cancellationToken)
        {
            string key = BuildKey(storageType, entityId, fileName);

            await using Stream stream = openStream();

            await s3Client.PutObjectAsync(new PutObjectRequest
            {
                BucketName = settings.Value.BucketName,
                Key = key,
                InputStream = stream,
                ContentType = contentType,
            }, cancellationToken);

            return key;
        }

        public string GeneratePresignedDownloadUrl(string key, TimeSpan? expiration = null)
        {
            return s3Client.GetPreSignedURL(new GetPreSignedUrlRequest
            {
                BucketName = settings.Value.BucketName,
                Key = key,
                Verb = HttpVerb.GET,
                Expires = DateTime.UtcNow.Add(expiration ?? TimeSpan.FromMinutes(10))
            });
        }

        private static string BuildKey(StorageType category, string entityId, string fileName) =>
            $"{category.ToString().ToLower()}/{entityId}/{Guid.NewGuid():N}_{Path.GetFileName(fileName)}";
    }
}