namespace HousingApp.Application.Storage;

public interface IStorageService
{
    Task<string> UploadAsync(
        Func<Stream> openStream,
        string fileName,
        string contentType,
        StorageType storageType,
        string entityId,
        CancellationToken cancellationToken
    );

    string GeneratePresignedDownloadUrl(
        string key,
        TimeSpan? expiration = null
    );

    Task DeleteAsync(
        string key,
        CancellationToken cancellationToken
    );
}
