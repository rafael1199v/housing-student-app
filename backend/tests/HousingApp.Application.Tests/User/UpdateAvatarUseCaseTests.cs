using FluentAssertions;
using HousingApp.Application.Auth.Upload;
using HousingApp.Application.Repositories;
using HousingApp.Application.Storage;
using HousingApp.Application.User.UseCases;
using HousingApp.Domain.Entities;
using HousingApp.Domain.Enums;
using HousingApp.Domain.Error;
using Microsoft.Extensions.Logging.Abstractions;
using NSubstitute;

namespace HousingApp.Application.Tests.User;

public class UpdateAvatarUseCaseTests
{
    private readonly UpdateAvatarUseCase _useCase;
    private readonly IUserRepository _userRepository;
    private readonly IPersonRepository _personRepository;
    private readonly IStorageService _storageService;

    private static readonly byte[] _jpegBytes = [0xFF, 0xD8, 0xFF, 0x00, 0x10];
    private static readonly byte[] _pngBytes = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00];

    public UpdateAvatarUseCaseTests()
    {
        _userRepository = Substitute.For<IUserRepository>();
        _personRepository = Substitute.For<IPersonRepository>();
        _storageService = Substitute.For<IStorageService>();

        _useCase = new UpdateAvatarUseCase(
            _userRepository, _personRepository, _storageService, NullLogger<UpdateAvatarUseCase>.Instance);
    }

    private static AvatarUpload UploadFor(byte[] bytes, string fileName, string contentType)
    {
        return new AvatarUpload(() => new MemoryStream(bytes), fileName, contentType);
    }

    private static Person PersonWith(string id, string? imageUrl)
    {
        return Person.CreatePerson(
            id: id,
            firstName: "Test",
            lastName: "User",
            email: "test@test.com",
            avatarSource: AvatarSource.None,
            phoneNumber: null,
            nationality: null,
            gender: null,
            imageUrl: imageUrl,
            birthDate: null,
            user: null);
    }

    [Fact]
    public async Task UpdateAvatar_ValidImageWithPreviousAvatar_ReplacesAndDeletesOld()
    {
        // Arrange
        string userId = Guid.NewGuid().ToString();
        const string oldKey = "userprofile/old/abc_old.jpg";
        const string newKey = "userprofile/new/def_new.jpg";
        const string presignedUrl = "https://s3/presigned-url";

        _userRepository.GetFullUserByIdAsync(userId).Returns(PersonWith(userId, oldKey));
        _storageService.UploadAsync(
            Arg.Any<Func<Stream>>(), Arg.Any<string>(), "image/jpeg",
            StorageType.UserProfile, userId, Arg.Any<CancellationToken>())
            .Returns(newKey);
        _personRepository.UpdateAvatarAsync(userId, newKey, AvatarSource.UserUploaded).Returns(true);
        _storageService.GeneratePresignedDownloadUrl(newKey).Returns(presignedUrl);

        // Act
        Result<string> result = await _useCase.ExecuteAsync(
            userId, UploadFor(_jpegBytes, "avatar.jpg", "image/jpeg"), CancellationToken.None);

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Value.Should().Be(presignedUrl);
        await _personRepository.Received(1).UpdateAvatarAsync(userId, newKey, AvatarSource.UserUploaded);
        await _storageService.Received(1).DeleteAsync(oldKey, Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task UpdateAvatar_ValidPngWithoutPreviousAvatar_DoesNotDelete()
    {
        // Arrange
        string userId = Guid.NewGuid().ToString();
        const string newKey = "userprofile/new/def_new.png";

        _userRepository.GetFullUserByIdAsync(userId).Returns(PersonWith(userId, null));
        _storageService.UploadAsync(
            Arg.Any<Func<Stream>>(), Arg.Any<string>(), "image/png",
            StorageType.UserProfile, userId, Arg.Any<CancellationToken>())
            .Returns(newKey);
        _personRepository.UpdateAvatarAsync(userId, newKey, AvatarSource.UserUploaded).Returns(true);
        _storageService.GeneratePresignedDownloadUrl(newKey).Returns("https://s3/url");

        // Act
        Result<string> result = await _useCase.ExecuteAsync(
            userId, UploadFor(_pngBytes, "avatar.png", "image/png"), CancellationToken.None);

        // Assert
        result.IsSuccess.Should().BeTrue();
        await _storageService.DidNotReceive().DeleteAsync(Arg.Any<string>(), Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task UpdateAvatar_NonImageRenamedAsJpg_ReturnsInvalidImageTypeAndDoesNotUpload()
    {
        // Arrange
        string userId = Guid.NewGuid().ToString();
        byte[] notAnImage = "%PDF-1.4 fake"u8.ToArray();

        // Act
        Result<string> result = await _useCase.ExecuteAsync(
            userId, UploadFor(notAnImage, "avatar.jpg", "image/jpeg"), CancellationToken.None);

        // Assert
        result.IsSuccess.Should().BeFalse();
        result.Error.Should().BeEquivalentTo(AvatarError.InvalidImageType);
        await _storageService.DidNotReceive().UploadAsync(
            Arg.Any<Func<Stream>>(), Arg.Any<string>(), Arg.Any<string>(),
            Arg.Any<StorageType>(), Arg.Any<string>(), Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task UpdateAvatar_FileExceedsMaxSize_ReturnsFileTooLargeAndDoesNotUpload()
    {
        // Arrange
        string userId = Guid.NewGuid().ToString();
        byte[] tooLarge = new byte[ImageSignatureValidator.MaxFileSizeBytes + 1];
        tooLarge[0] = 0xFF; tooLarge[1] = 0xD8; tooLarge[2] = 0xFF;

        // Act
        Result<string> result = await _useCase.ExecuteAsync(
            userId, UploadFor(tooLarge, "avatar.jpg", "image/jpeg"), CancellationToken.None);

        // Assert
        result.IsSuccess.Should().BeFalse();
        result.Error.Should().BeEquivalentTo(AvatarError.FileTooLarge);
        await _storageService.DidNotReceive().UploadAsync(
            Arg.Any<Func<Stream>>(), Arg.Any<string>(), Arg.Any<string>(),
            Arg.Any<StorageType>(), Arg.Any<string>(), Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task UpdateAvatar_UserNotFound_ReturnsUserNotFoundAndDoesNotUpload()
    {
        // Arrange
        string userId = Guid.NewGuid().ToString();
        _userRepository.GetFullUserByIdAsync(userId).Returns((Person)null!);

        // Act
        Result<string> result = await _useCase.ExecuteAsync(
            userId, UploadFor(_jpegBytes, "avatar.jpg", "image/jpeg"), CancellationToken.None);

        // Assert
        result.IsSuccess.Should().BeFalse();
        result.Error.Should().BeEquivalentTo(UserError.UserNotFound);
        await _storageService.DidNotReceive().UploadAsync(
            Arg.Any<Func<Stream>>(), Arg.Any<string>(), Arg.Any<string>(),
            Arg.Any<StorageType>(), Arg.Any<string>(), Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task UpdateAvatar_DeletePreviousFails_StillSucceeds()
    {
        // Arrange
        string userId = Guid.NewGuid().ToString();
        const string oldKey = "userprofile/old/abc_old.jpg";
        const string newKey = "userprofile/new/def_new.jpg";

        _userRepository.GetFullUserByIdAsync(userId).Returns(PersonWith(userId, oldKey));
        _storageService.UploadAsync(
            Arg.Any<Func<Stream>>(), Arg.Any<string>(), Arg.Any<string>(),
            StorageType.UserProfile, userId, Arg.Any<CancellationToken>())
            .Returns(newKey);
        _personRepository.UpdateAvatarAsync(userId, newKey, AvatarSource.UserUploaded).Returns(true);
        _storageService.GeneratePresignedDownloadUrl(newKey).Returns("https://s3/url");
        _storageService.DeleteAsync(oldKey, Arg.Any<CancellationToken>())
            .Returns<Task>(_ => throw new InvalidOperationException("S3 down"));

        // Act
        Result<string> result = await _useCase.ExecuteAsync(
            userId, UploadFor(_jpegBytes, "avatar.jpg", "image/jpeg"), CancellationToken.None);

        // Assert
        result.IsSuccess.Should().BeTrue();
    }

    [Fact]
    public async Task UpdateAvatar_PersonUpdateFails_ReturnsPersonProfileNotFound()
    {
        // Arrange
        string userId = Guid.NewGuid().ToString();
        const string newKey = "userprofile/new/def_new.jpg";

        _userRepository.GetFullUserByIdAsync(userId).Returns(PersonWith(userId, null));
        _storageService.UploadAsync(
            Arg.Any<Func<Stream>>(), Arg.Any<string>(), Arg.Any<string>(),
            StorageType.UserProfile, userId, Arg.Any<CancellationToken>())
            .Returns(newKey);
        _personRepository.UpdateAvatarAsync(userId, newKey, AvatarSource.UserUploaded).Returns(false);

        // Act
        Result<string> result = await _useCase.ExecuteAsync(
            userId, UploadFor(_jpegBytes, "avatar.jpg", "image/jpeg"), CancellationToken.None);

        // Assert
        result.IsSuccess.Should().BeFalse();
        result.Error.Should().BeEquivalentTo(UserError.PersonProfileNotFound);
        await _storageService.DidNotReceive().DeleteAsync(Arg.Any<string>(), Arg.Any<CancellationToken>());
    }
}
