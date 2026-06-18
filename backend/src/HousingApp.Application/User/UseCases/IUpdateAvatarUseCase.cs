using HousingApp.Application.Auth.Upload;

namespace HousingApp.Application.User.UseCases;

public interface IUpdateAvatarUseCase
{
    Task<Result<string>> ExecuteAsync(string userId, AvatarUpload upload, CancellationToken cancellationToken);
}
