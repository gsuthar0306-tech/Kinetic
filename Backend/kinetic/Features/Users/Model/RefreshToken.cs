using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Kinetic.Features.Users
{
    public class RefreshToken
    {
        [BsonId]
        public ObjectId Id { get; set; }

        [BsonElement("UserId")]
        public ObjectId UserId { get; set; }

        [BsonElement("TokenHash")]
        public string TokenHash { get; set; } = string.Empty;

        [BsonElement("ExpiresAt")]
        public DateTime ExpiresAt { get; set; }

        [BsonElement("CreatedAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("RevokedAt")]
        public DateTime? RevokedAt { get; set; }
    }
}