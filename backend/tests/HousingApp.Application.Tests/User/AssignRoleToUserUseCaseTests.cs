using FluentAssertions;
using HousingApp.Application.Auth.DTOs;
using HousingApp.Application.Auth.UseCases;
using HousingApp.Application.Repositories;
using HousingApp.Application.Roles;
using HousingApp.Application.Services;
using HousingApp.Application.User.DTOs;
using HousingApp.Application.User.UseCases;
using HousingApp.Domain.Error;
using NSubstitute;

namespace HousingApp.Application.Tests.User;

public class AssignRoleToUserUseCaseTests
{
    private const string UserId = "uuid";
    private const string Email = "rafael@gmail.com";

    private readonly IUserRepository _userRepository;
    private readonly IGenerateRefreshTokenUseCase _generateRefreshTokenUseCase;
    private readonly IAccessTokenService _accessTokenService;
    private readonly AssignRoleToUserUseCase _useCase;

    public AssignRoleToUserUseCaseTests()
    {
        _userRepository = Substitute.For<IUserRepository>();
        _generateRefreshTokenUseCase = Substitute.For<IGenerateRefreshTokenUseCase>();
        _accessTokenService = Substitute.For<IAccessTokenService>();
        _useCase = new AssignRoleToUserUseCase(_userRepository, _generateRefreshTokenUseCase, _accessTokenService);
    }

    private static Domain.Entities.User UserWithRoles(params string[] roles) =>
        Domain.Entities.User.CreateUser(UserId, Email, "password-hash", [.. roles], isEmailConfirmed: true);

    [Fact]
    public async Task AssignRole_HouseholderAssignsStudent_ReturnsCredentialsAndAddsRole()
    {
        const string refreshToken = "refresh-token";
        const string accessToken = "access-token";

        _userRepository.GetUserByIdAsync(UserId).Returns(UserWithRoles(RolesDescription.Householder));
        _userRepository.AddRoleToUserAsync(UserId, RolesDescription.Student).Returns(true);
        _generateRefreshTokenUseCase.ExecuteAsync(UserId).Returns(Result<string>.Success(refreshToken));
        _accessTokenService.GenerateAccessToken(Arg.Any<UserDto>()).Returns(accessToken);

        Result<CredentialsDto> result = await _useCase.ExecuteAsync(UserId, new AssignRoleDto(RolesDescription.Student));

        result.IsSuccess.Should().BeTrue();
        result.Value.Should().Be(new CredentialsDto(accessToken, refreshToken));
        await _userRepository.Received(1).AddRoleToUserAsync(UserId, RolesDescription.Student);
    }

    [Fact]
    public async Task AssignRole_StudentAssignsHouseholder_ReturnsCredentialsAndAddsRole()
    {
        const string refreshToken = "refresh-token";
        const string accessToken = "access-token";

        _userRepository.GetUserByIdAsync(UserId).Returns(UserWithRoles(RolesDescription.Student));
        _userRepository.AddRoleToUserAsync(UserId, RolesDescription.Householder).Returns(true);
        _generateRefreshTokenUseCase.ExecuteAsync(UserId).Returns(Result<string>.Success(refreshToken));
        _accessTokenService.GenerateAccessToken(Arg.Any<UserDto>()).Returns(accessToken);

        Result<CredentialsDto> result = await _useCase.ExecuteAsync(UserId, new AssignRoleDto(RolesDescription.Householder));

        result.IsSuccess.Should().BeTrue();
        result.Value.Should().Be(new CredentialsDto(accessToken, refreshToken));
        await _userRepository.Received(1).AddRoleToUserAsync(UserId, RolesDescription.Householder);
    }

    [Fact]
    public async Task AssignRole_RoleAlreadyHeld_ReturnsRoleAlreadyAssigned()
    {
        _userRepository.GetUserByIdAsync(UserId).Returns(UserWithRoles(RolesDescription.Householder, RolesDescription.Student));

        Result<CredentialsDto> result = await _useCase.ExecuteAsync(UserId, new AssignRoleDto(RolesDescription.Student));

        result.Error.Should().Be(UserError.RoleAlreadyAssigned);
        await _userRepository.DidNotReceive().AddRoleToUserAsync(Arg.Any<string>(), Arg.Any<string>());
    }

    [Fact]
    public async Task AssignRole_TargetIsAdmin_ReturnsRoleNotAssignable()
    {
        _userRepository.GetUserByIdAsync(UserId).Returns(UserWithRoles(RolesDescription.Householder));

        Result<CredentialsDto> result = await _useCase.ExecuteAsync(UserId, new AssignRoleDto(RolesDescription.Admin));

        result.Error.Should().Be(UserError.RoleNotAssignable);
    }

    [Fact]
    public async Task AssignRole_UnknownRole_ReturnsInvalidRole()
    {
        Result<CredentialsDto> result = await _useCase.ExecuteAsync(UserId, new AssignRoleDto("Wizard"));

        result.Error.Should().Be(UserError.InvalidRole);
        await _userRepository.DidNotReceive().GetUserByIdAsync(Arg.Any<string>());
    }

    [Fact]
    public async Task AssignRole_RepositoryFailsToAdd_ReturnsRoleAssignmentFailed()
    {
        _userRepository.GetUserByIdAsync(UserId).Returns(UserWithRoles(RolesDescription.Householder));
        _userRepository.AddRoleToUserAsync(UserId, RolesDescription.Student).Returns(false);

        Result<CredentialsDto> result = await _useCase.ExecuteAsync(UserId, new AssignRoleDto(RolesDescription.Student));

        result.Error.Should().Be(UserError.RoleAssignmentFailed);
    }

    [Fact]
    public async Task AssignRole_UserNotFound_ReturnsUserNotFound()
    {
        _userRepository.GetUserByIdAsync(UserId).Returns((Domain.Entities.User?)null);

        Result<CredentialsDto> result = await _useCase.ExecuteAsync(UserId, new AssignRoleDto(RolesDescription.Student));

        result.Error.Should().Be(UserError.UserNotFound);
    }
}
