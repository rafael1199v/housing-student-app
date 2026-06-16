namespace HousingApp.Domain.Error;

public static class AvatarError
{
    public static readonly Error FileMissing = new("avatar.file.missing", "Avatar file is required.");
    public static readonly Error InvalidImageType = new("avatar.invalid.type", "Avatar must be a JPEG, PNG or WEBP image.");
    public static readonly Error FileTooLarge = new("avatar.too.large", "Avatar file exceeds the maximum allowed size.");
}
