using FluentAssertions;
using HousingApp.Application.Auth.DTOs;
using HousingApp.Application.Auth.UseCases;
using HousingApp.Application.Repositories;
using HousingApp.Application.Services;
using HousingApp.Domain.Error;
using NSubstitute;

namespace HousingApp.Application.Tests.Auth;

public class LoginUseCaseTests
{
    private readonly LoginUseCase _loginUseCase;
    private readonly IUserRepository _userRepository;
    private readonly IGenerateRefreshTokenUseCase _generateRefreshTokenUseCase;
    private readonly IAccessTokenService _accessTokenService;

    public LoginUseCaseTests()
    {
        _userRepository = Substitute.For<IUserRepository>();
        _generateRefreshTokenUseCase = Substitute.For<IGenerateRefreshTokenUseCase>();
        _accessTokenService = Substitute.For<IAccessTokenService>();
        _loginUseCase = new LoginUseCase(_userRepository, _generateRefreshTokenUseCase, _accessTokenService);
    }

    [Fact]
    public async Task Login_ShouldReturnUserData()
    {
        //Arrange
        LoginDto loginDto = new("rafael@gmail.com", "Password!555");

        Domain.Entities.User returnedUser = Domain.Entities.User.CreateUser(
            "uuid",
            loginDto.Email,
            "password-hash",
            ["student"],
            isEmailConfirmed: true
        );

        const string refreshTokenReturned = "refresh-token-returned";
        const string accessTokenReturned = "access-token-returned";

        _userRepository.FindUserByEmailAsync(loginDto.Email).Returns(returnedUser);
        _userRepository.CheckPassword(loginDto.Email, loginDto.Password).Returns(true);
        _generateRefreshTokenUseCase.ExecuteAsync(returnedUser.Id).Returns(Result<string>.Success(refreshTokenReturned));
        _accessTokenService.GenerateAccessToken(Arg.Any<UserDto>()).Returns(accessTokenReturned);

        CredentialsDto expected = new(AccessToken: accessTokenReturned, RefreshToken: refreshTokenReturned);

        //Act
        Result<CredentialsDto> result = await _loginUseCase.Login(loginDto);

        // Assert
        result.Value.Should().Be(expected);
    }

    [Fact]
    public async Task Login_UserDoesNotExist_ShouldReturnInvalidCredentials()
    {
        //Arrange
        LoginDto loginDto = new("rafael@gmail.com", "Password!555");

        _userRepository.FindUserByEmailAsync(loginDto.Email).Returns((Domain.Entities.User?)null);

        //Act
        Result<CredentialsDto> result = await _loginUseCase.Login(loginDto);
        Error error = result.Error;

        // Assert
        error.Should().Be(AuthError.InvalidCredentials);
    }

    [Fact]
    public async Task Login_WrongPassword_ShouldReturnInvalidCredentials()
    {
        //Arrange
        LoginDto loginDto = new("rafael@gmail.com", "Password!555");
        Domain.Entities.User returnedUser = Domain.Entities.User.CreateUser(
            "uuid",
            loginDto.Email,
            "password-hash",
            ["student"]
        );

        _userRepository.FindUserByEmailAsync(loginDto.Email).Returns(returnedUser);
        _userRepository.CheckPassword(loginDto.Email, loginDto.Password).Returns(false);

        //Act
        Result<CredentialsDto> result = await _loginUseCase.Login(loginDto);
        Error error = result.Error;

        // Assert
        error.Should().Be(AuthError.InvalidCredentials);
    }
}
