namespace HousingApp.Application.Room.Upload
{
    public record ImageRoomUpload(
        Func<Stream> OpenStream,
        string FileName,
        string ContentType
    );
}