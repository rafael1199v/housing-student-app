namespace HousingApp.Application.Auth.Upload;

public record AvatarUpload(
    Func<Stream> OpenStream,
    string FileName,
    string ContentType
);
