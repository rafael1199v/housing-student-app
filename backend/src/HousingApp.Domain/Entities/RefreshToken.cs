using System.Security.Cryptography;

namespace HousingApp.Domain.Entities;

public class RefreshToken
{
    public int Id { get; init; }
    public string Token { get; init; } = string.Empty;
    public DateTime ExpirationOnUtc { get; init; }
    public string UserId { get; init; } = string.Empty;
    public bool IsRevoked { get; init; }

    public User? User { get; init; }

    public bool IsValid()
    {
        return ExpirationOnUtc > DateTime.UtcNow || !IsRevoked;
    }

    public static RefreshToken Create(string userId)
    {
        return new RefreshToken
        {
            Id = 0,
            Token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64)),
            ExpirationOnUtc = DateTime.UtcNow.AddDays(7),
            UserId = userId,
            IsRevoked = false
        };
    }

    public RefreshToken Renew()
    {
        return new RefreshToken
        {
            Id = Id,
            Token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64)),
            ExpirationOnUtc = DateTime.UtcNow.AddDays(7),
            UserId = UserId,
            IsRevoked = IsRevoked,
            User = User
        };
    }
}
