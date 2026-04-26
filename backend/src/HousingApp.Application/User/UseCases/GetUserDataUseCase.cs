using HousingApp.Application.Repositories;
using HousingApp.Application.User.DTOs;
using HousingApp.Application.Storage;
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
        Result<Domain.Entities.Person> result = await _userRepository.GetFullUserByIdAsync(userId);

        if (!result.IsSuccess)
        {
            return Result<UserDataDto>.Failure(result.Error);
        }

        Domain.Entities.Person? user = result.Value;
        if (user is null)
        {
            return Result<UserDataDto>.Failure(new Error("person.not.found", "Person profile not found."));
        }

        UserDataDto userDataDto = new(
            user.Email,
            user.FirstName,
            user.LastName,
            user.PhoneNumber,
            user.Nationality,
            user.Gender,
            user.ImageUrl ?? string.Empty,
            user.BirthDate.ToString("yyyy-MM-dd")
        );
        return Result<UserDataDto>.Success(userDataDto);
    }
}