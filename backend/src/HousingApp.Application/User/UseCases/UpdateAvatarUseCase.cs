using HousingApp.Application.Auth.Upload;
using HousingApp.Application.Repositories;
using HousingApp.Application.Storage;
using HousingApp.Domain.Enums;
using HousingApp.Domain.Error;
using Microsoft.Extensions.Logging;

namespace HousingApp.Application.User.UseCases;

public class UpdateAvatarUseCase(
    IUserRepository userRepository,
    IPersonRepository personRepository,
    IStorageService storageService,
    ILogger<UpdateAvatarUseCase> logger
) : IUpdateAvatarUseCase
{
    public async Task<Result<string>> ExecuteAsync(string userId, AvatarUpload upload, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(userId))
        {
            return Result<string>.Failure(UserError.InvalidUserId);
        }

        // 1. Validate presence, size and real type (magic bytes). Storage is untouched if anything fails.
        if (upload is null)
        {
            return Result<string>.Failure(AvatarError.FileMissing);
        }

        long length;
        using (Stream sizeStream = upload.OpenStream())
        {
            if (!sizeStream.CanSeek)
            {
                // Defensive: should be seekable for IFormFile streams.
                length = 0;
            }
            else
            {
                length = sizeStream.Length;
            }
        }

        if (length == 0)
        {
            return Result<string>.Failure(AvatarError.FileMissing);
        }

        if (length > ImageSignatureValidator.MaxFileSizeBytes)
        {
            return Result<string>.Failure(AvatarError.FileTooLarge);
        }

        string? validatedContentType = ImageSignatureValidator.Resolve(upload.OpenStream);
        if (validatedContentType is null)
        {
            return Result<string>.Failure(AvatarError.InvalidImageType);
        }

        // 2. Resolve the person and remember the current key to delete it afterwards.
        Domain.Entities.Person person = await userRepository.GetFullUserByIdAsync(userId);
        if (person is null)
        {
            return Result<string>.Failure(UserError.UserNotFound);
        }

        string? oldKey = person.ImageUrl;

        // 3. Upload first; only if it succeeds do we touch the DB.
        string newKey = await storageService.UploadAsync(
            upload.OpenStream,
            upload.FileName,
            validatedContentType,
            StorageType.UserProfile,
            userId,
            cancellationToken);

        // 4. Point the person to the new key.
        bool updated = await personRepository.UpdateAvatarAsync(userId, newKey, AvatarSource.UserUploaded);
        if (!updated)
        {
            logger.LogError(
                "Avatar uploaded to {NewKey} for user {UserId} but Person update failed; object is orphaned.",
                newKey, userId);
            return Result<string>.Failure(UserError.PersonProfileNotFound);
        }

        // 5. Best-effort delete of the previous avatar (key changes per upload, so old object would leak).
        if (!string.IsNullOrEmpty(oldKey))
        {
            try
            {
                await storageService.DeleteAsync(oldKey, cancellationToken);
            }
            catch (Exception ex)
            {
                logger.LogWarning(ex,
                    "Failed to delete previous avatar {OldKey} for user {UserId}; new avatar is already saved.",
                    oldKey, userId);
            }
        }

        return Result<string>.Success(storageService.GeneratePresignedDownloadUrl(newKey));
    }
}
