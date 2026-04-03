using FluentAssertions;
using HousingApp.Application.Auth.DTOs;
using HousingApp.Application.Auth.UseCases;
using HousingApp.Application.Repositories;
using HousingApp.Application.UnitOfWork;
using HousingApp.Domain.Entities;
using NSubstitute;

namespace HousingApp.Application.Tests.Auth;

public class RegisterUseCaseTests
{
    private readonly RegisterUseCase _registerUseCase;
    private readonly IAuthUnitOfWork _unitOfWork;
    private readonly IUserRepository _userRepository;
    private readonly IPersonRepository _personRepository;

    public RegisterUseCaseTests()
    {
        _userRepository = Substitute.For<IUserRepository>();
        _personRepository = Substitute.For<IPersonRepository>();

        _unitOfWork = Substitute.For<IAuthUnitOfWork>();
        _unitOfWork.UserRepository.Returns(_userRepository);
        _unitOfWork.PersonRepository.Returns(_personRepository);
        
        _registerUseCase = new RegisterUseCase(_unitOfWork);
    }

    [Fact]
    public async Task Register_ShouldReturnUserId()
    {
        //Arrange
        var registerDto = new RegisterDto(Email: "o@o.com", Password: "Password!555", Role: "Student", FirstName: "Wilson", LastName: "Higgsbury", PhoneNumber: "456789213", Nationality: "Argentina", Age: 30, Gender: "Male", BirthDate: "1996-01-01", ImageUrl: "");

        _userRepository.FindUserByEmailAsync(registerDto.Email).Returns((User?)null);
        _userRepository.RegisterUser(Arg.Any<User>(), Arg.Any<HousingApp.Domain.Enums.Roles>()).Returns("new-user-id");
        
        //Act
        var result = await _registerUseCase.ExecuteAsync(registerDto);
        
        // Assert 
        result.Value.Should().Be("new-user-id");
        await _unitOfWork.Received(1).CommitTransactionAsync();
    }

}