using FluentAssertions;
using HousingApp.Application.Auth.DTOs;
using HousingApp.Application.Auth.UseCases;
using HousingApp.Application.Repositories;
using HousingApp.Domain.Entities;
using HousingApp.Domain.Error;
using NSubstitute;

namespace HousingApp.Application.Tests.Auth;

public class LoginUseCaseTests
{
    private readonly LoginUseCase _loginUseCase;
    private readonly IUserRepository _userRepository;

    public LoginUseCaseTests()
    {
        _userRepository = Substitute.For<IUserRepository>();
        _loginUseCase = new LoginUseCase(_userRepository);
    }

    [Fact]
    public async Task Login_ShouldReturnUserData()
    {
        //Arrange
        LoginDto loginDto = new("rafael@gmail.com", "Password!555");

        User returnedUser = User.CreateUser(
            "uuid",
            loginDto.Email,
            "password-hash",
            ["student"]
        );

        _userRepository.FindUserByEmailAsync(loginDto.Email).Returns(returnedUser);
        _userRepository.CheckPassword(loginDto.Email, loginDto.Password).Returns(true);

        UserDto userDtoExpected = new(
            returnedUser.Id,
            loginDto.Email,
            returnedUser.Password,
            returnedUser.Roles
        );

        //Act
        Result<UserDto> result = await _loginUseCase.Login(loginDto);

        // Assert 
        result.Value.Should().Be(userDtoExpected);
    }

    [Fact]
    public async Task Login_UserDoesNotExist_ShouldReturnInvalidCredentials()
    {
        //Arrange
        LoginDto loginDto = new("rafael@gmail.com", "Password!555");

        _userRepository.FindUserByEmailAsync(loginDto.Email).Returns((User?)null);

        //Act
        Result<UserDto> result = await _loginUseCase.Login(loginDto);
        Error error = result.Error;

        // Assert 
        error.Should().Be(AuthError.InvalidCredentials);
    }

    [Fact]
    public async Task Login_WrongPassword_ShouldReturnInvalidCredentials()
    {
        //Arrange
        LoginDto loginDto = new("rafael@gmail.com", "Password!555");
        User returnedUser = User.CreateUser(
            "uuid",
            loginDto.Email,
            "password-hash",
            ["student"]
        );

        _userRepository.FindUserByEmailAsync(loginDto.Email).Returns(returnedUser);
        _userRepository.CheckPassword(loginDto.Email, loginDto.Password).Returns(false);

        //Act
        Result<UserDto> result = await _loginUseCase.Login(loginDto);
        Error error = result.Error;

        // Assert 
        error.Should().Be(AuthError.InvalidCredentials);
    }
}
