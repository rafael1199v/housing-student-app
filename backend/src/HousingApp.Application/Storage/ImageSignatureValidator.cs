namespace HousingApp.Application.Storage;

/// <summary>
/// Validates that a stream is a real image by inspecting its magic bytes,
/// never trusting the client-declared content type or file extension.
/// </summary>
public static class ImageSignatureValidator
{
    public const long MaxFileSizeBytes = 5 * 1024 * 1024;

    private static readonly byte[] JpegSignature = [0xFF, 0xD8, 0xFF];
    private static readonly byte[] PngSignature = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A];

    /// <summary>
    /// Returns the validated content type (image/jpeg, image/png or image/webp)
    /// based on the actual file signature, or null if the stream is not a supported image.
    /// </summary>
    public static string? Resolve(Func<Stream> openStream)
    {
        byte[] header = new byte[12];

        using Stream stream = openStream();
        int read = ReadExactly(stream, header);

        if (read >= JpegSignature.Length && StartsWith(header, JpegSignature))
        {
            return "image/jpeg";
        }

        if (read >= PngSignature.Length && StartsWith(header, PngSignature))
        {
            return "image/png";
        }

        // WEBP: "RIFF" at bytes 0..3 and "WEBP" at bytes 8..11.
        if (read >= 12
            && header[0] == 'R' && header[1] == 'I' && header[2] == 'F' && header[3] == 'F'
            && header[8] == 'W' && header[9] == 'E' && header[10] == 'B' && header[11] == 'P')
        {
            return "image/webp";
        }

        return null;
    }

    private static bool StartsWith(byte[] buffer, byte[] signature)
    {
        for (int i = 0; i < signature.Length; i++)
        {
            if (buffer[i] != signature[i])
            {
                return false;
            }
        }

        return true;
    }

    private static int ReadExactly(Stream stream, byte[] buffer)
    {
        int total = 0;
        while (total < buffer.Length)
        {
            int read = stream.Read(buffer, total, buffer.Length - total);
            if (read == 0)
            {
                break;
            }

            total += read;
        }

        return total;
    }
}
