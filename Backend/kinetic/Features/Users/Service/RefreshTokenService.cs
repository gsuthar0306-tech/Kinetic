using System.Security.Cryptography;
using System.Text;
using Kinetic.Features.MongoDB;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Kinetic.Features.Users
{
    public class RefreshTokenService
    {
        private readonly IMongoCollection<RefreshToken> _collection;

        public RefreshTokenService(MongoDbConfig dbConfig)
        {
            _collection = dbConfig.GetCollection<RefreshToken>("refreshTokens");
        }

        public string GenerateRefreshToken()
        {
            var randomBytes = RandomNumberGenerator.GetBytes(64);

            return Convert.ToBase64String(randomBytes);
        }

        public string HashRefreshToken(string refreshToken)
        {
            using var sha256 = SHA256.Create();

            var bytes = Encoding.UTF8.GetBytes(refreshToken);

            var hash = sha256.ComputeHash(bytes);

            return Convert.ToBase64String(hash);
        }

        public async Task<RefreshToken> CreateAsync(
            ObjectId userId,
            string refreshToken)
        {
            var token = new RefreshToken
            {
                UserId = userId,
                TokenHash = HashRefreshToken(refreshToken),
                ExpiresAt = DateTime.UtcNow.AddDays(30),
                CreatedAt = DateTime.UtcNow
            };

            await _collection.InsertOneAsync(token);

            return token;
        }

        public async Task<RefreshToken?> GetByTokenAsync(
            string refreshToken)
        {
            var tokenHash = HashRefreshToken(refreshToken);

            return await _collection
                .Find(token => token.TokenHash == tokenHash)
                .FirstOrDefaultAsync();
        }

        public async Task RevokeAsync(RefreshToken token)
        {
            token.RevokedAt = DateTime.UtcNow;

            await _collection.ReplaceOneAsync(
                existingToken => existingToken.Id == token.Id,
                token
            );
        }
    }
}