using HousingApp.Application.Repositories;
using HousingApp.Application.Storage;
using HousingApp.Application.User.DTOs;
using HousingApp.Domain.Error;

namespace HousingApp.Application.User.UseCases;

public class GetUserDataUseCase : IGetUserDataUseCase
{
    private readonly IUserRepository _userRepository;
    private readonly IStorageService _storageService;

    public GetUserDataUseCase(IUserRepository userRepository, IStorageService storageService)
    {
        _userRepository = userRepository;
        _storageService = storageService;
    }

    public async Task<Result<UserDataDto>> ExecuteAsync(string userId)
    {
        Domain.Entities.Person user = await _userRepository.GetFullUserByIdAsync(userId);

        if (user == null)
        {
            return Result<UserDataDto>.Failure(UserError.UserNotFound);
        }

        UserDataDto userDataDto = new(
            user.Email,
            user.FirstName,
            user.LastName ?? string.Empty,
            user.PhoneNumber ?? string.Empty,
            user.Nationality ?? string.Empty,
            user.Gender ?? string.Empty,
            user.ImageUrl is null ? string.Empty : _storageService.GeneratePresignedDownloadUrl(user.ImageUrl),
            user.BirthDate.ToString() ?? string.Empty
        );
        return Result<UserDataDto>.Success(userDataDto);
    }
}
