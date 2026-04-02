using FluentAssertions;
using HousingApp.Application.Auth.DTOs;
using HousingApp.Application.Auth.UseCases;
using HousingApp.Application.Repositories;
using HousingApp.Domain.Entities;
using NSubstitute;

namespace HousingApp.Application.Tests.Auth;

public class LoginUseCaseTests
{
    private readonly ILoginUseCase _loginUseCase;
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
        var loginDto = new LoginDto(Email: "rafael@gmail.com",Password: "Password!555");

        var returnedUser = User.CreateUser(
            uuid: "uuid",
            email: loginDto.Email,
            password: "password-hash",
            roles: ["student"]
        );
        
        _userRepository.FindUserByEmailAsync(loginDto.Email).Returns(returnedUser);
        _userRepository.CheckPassword(loginDto.Email, loginDto.Password).Returns(true);
        
        var userDtoExpected = new UserDto(
            Id: returnedUser.Id,
            Email: loginDto.Email,
            PasswordHash: returnedUser.Password,
            Roles: returnedUser.Roles
        );
        
        //Act
        var result = await _loginUseCase.Login(loginDto);
        
        // Assert 
        result.Value.Should().Be(userDtoExpected);
    }

}