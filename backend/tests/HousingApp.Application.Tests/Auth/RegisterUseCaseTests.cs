using FluentAssertions;
using HousingApp.Application.Auth.DTOs;
using HousingApp.Application.Auth.UseCases;
using HousingApp.Application.Repositories;
using HousingApp.Application.Services;
using HousingApp.Application.UnitOfWork;
using HousingApp.Domain.Entities;
using NSubstitute;

namespace HousingApp.Application.Tests.Auth;

public class RegisterUseCaseTests
{
    private readonly IPersonRepository _personRepository;
    private readonly RegisterUseCase _registerUseCase;
    private readonly IAuthUnitOfWork _unitOfWork;
    private readonly IUserRepository _userRepository;
    private readonly IEmailService _emailService;
    private readonly IAccountService _accountService;

    public RegisterUseCaseTests()
    {
        _userRepository = Substitute.For<IUserRepository>();
        _personRepository = Substitute.For<IPersonRepository>();

        _unitOfWork = Substitute.For<IAuthUnitOfWork>();
        _unitOfWork.UserRepository.Returns(_userRepository);
        _unitOfWork.PersonRepository.Returns(_personRepository);

        _emailService = Substitute.For<IEmailService>();
        _accountService = Substitute.For<IAccountService>();

        _registerUseCase = new RegisterUseCase(_unitOfWork, _emailService, _accountService);
    }

    [Fact]
    public async Task Register_ShouldReturnUserId()
    {
        //Arrange
        RegisterDto registerDto = new("o@o.com", "Password!555", "Student", "Wilson", "Higgsbury", "456789213",
            "Argentina", "Male", BirthDate: "1996-01-01", ImageUrl: "");

        _userRepository.FindUserByEmailAsync(registerDto.Email).Returns((User?)null);
        _userRepository.RegisterUser(Arg.Any<User>(), Arg.Any<Domain.Enums.Roles>()).Returns("new-user-id");
        _userRepository.GenerateEmailConfirmationToken(Arg.Any<string>()).Returns("token");
        _accountService.GenerateEmailConfirmationLinkAsync(Arg.Any<string>(), Arg.Any<string>()).Returns("http://localhost:5000/confirm-email");

        //Act
        Result<string> result = await _registerUseCase.ExecuteAsync(registerDto);

        // Assert 
        result.Value.Should().Be("new-user-id");
        await _unitOfWork.Received(1).CommitTransactionAsync();
    }

    [Fact]
    public async Task Register_EmailAlreadyExists_ShouldReturnError()
    {
        //Arrange
        RegisterDto registerDto = new("a@a.com", "Password!555", "Student", "Wilson", "Higgsbury", "456789213",
            "Argentina", "Male", BirthDate: "1996-01-01", ImageUrl: "");

        _userRepository.FindUserByEmailAsync(registerDto.Email).Returns(new User());

        //Act
        Result<string> result = await _registerUseCase.ExecuteAsync(registerDto);

        // Assert
        result.IsSuccess.Should().BeFalse();
        result.Error.Code.Should().Be("email.in.use");
        await _unitOfWork.DidNotReceive().CommitTransactionAsync();
    }

    [Fact]
    public async Task Register_InvalidRole_ShouldReturnError()
    {
        //Arrange
        RegisterDto registerDto = new("a@a.com", "Password!555", "invalid", "Wilson", "Higgsbury", "456789213",
            "Argentina", "Male", BirthDate: "1996-01-01", ImageUrl: "");

        //Act
        Result<string> result = await _registerUseCase.ExecuteAsync(registerDto);

        // Assert
        result.IsSuccess.Should().BeFalse();
        result.Error.Code.Should().Be("role.not.exist");
        await _unitOfWork.DidNotReceive().CommitTransactionAsync();
    }

    [Fact]
    public async Task Register_AdminRole_ShouldReturnError()
    {
        //Arrange
        RegisterDto registerDto = new("a@a.com", "Password!555", "Admin", "Wilson", "Higgsbury", "456789213",
            "Argentina", "Male", BirthDate: "1996-01-01", ImageUrl: "");

        //Act
        Result<string> result = await _registerUseCase.ExecuteAsync(registerDto);

        // Assert
        result.IsSuccess.Should().BeFalse();
        result.Error.Code.Should().Be("admin.role.denied");
        await _unitOfWork.DidNotReceive().CommitTransactionAsync();
    }
}
