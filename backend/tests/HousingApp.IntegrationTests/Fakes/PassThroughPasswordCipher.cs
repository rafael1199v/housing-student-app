using HousingApp.Application.Services;

namespace HousingApp.IntegrationTests.Fakes;

public class PassThroughPasswordCipher : IRsaPasswordCipher
{
    public string Decrypt(string cipherTextBase64) => cipherTextBase64;
}
