namespace HousingApp.Application.Services;

public interface IRsaPasswordCipher
{
    /// <summary>
    /// Decrypts a base64 RSA-OAEP(SHA-256) ciphertext produced by the frontend
    /// into the original UTF-8 plaintext password. Throws when the input is
    /// malformed or cannot be decrypted with the configured private key.
    /// </summary>
    string Decrypt(string cipherTextBase64);
}
