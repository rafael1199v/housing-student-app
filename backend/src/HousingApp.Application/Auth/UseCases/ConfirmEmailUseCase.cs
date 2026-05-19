using HousingApp.Application.Repositories;
using HousingApp.Domain.Entities;
using HousingApp.Domain.Error;

namespace HousingApp.Application.Auth.UseCases;

public class ConfirmEmailUseCase(IUserRepository userRepository) : IConfirmEmailUseCase
{
    public async Task<Result<bool>> ExecuteAsync(string userId, string token)
    {
        Domain.Entities.User? user = await userRepository.GetUserByIdAsync(userId);

        if (user is null)
            return Result<bool>.Failure(ConfirmEmailError.InvalidEmailConfirmationToken);

        if (user.IsEmailConfirmed)
            return Result<bool>.Failure(ConfirmEmailError.EmailAlreadyConfirmed);

        if (!await userRepository.ConfirmEmail(user.Id, token))
            return Result<bool>.Failure(ConfirmEmailError.InvalidEmailConfirmationToken);

        return Result<bool>.Success(true);
    }
}
