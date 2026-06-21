using HousingApp.Application.Services;
using Microsoft.Extensions.Configuration;
using System.Security.Cryptography;
using System.Text;

namespace HousingApp.Infrastructure.Services;

public class RsaPasswordCipher(IConfiguration configuration) : IRsaPasswordCipher
{
    public string Decrypt(string cipherTextBase64)
    {
        string privateKeyPem = configuration["PasswordEncryption:PrivateKey"]
            ?? throw new InvalidOperationException("PasswordEncryption:PrivateKey is not configured.");

        using RSA rsa = RSA.Create();
        rsa.ImportFromPem(privateKeyPem);

        byte[] cipherBytes = Convert.FromBase64String(cipherTextBase64);
        byte[] plainBytes = rsa.Decrypt(cipherBytes, RSAEncryptionPadding.OaepSHA256);

        return Encoding.UTF8.GetString(plainBytes);
    }
}
