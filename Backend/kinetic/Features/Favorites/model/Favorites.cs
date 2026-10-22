using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Kinetic.Features.Favorites
{
    public class Favorite
    {
        [BsonId]
        public ObjectId Id { get; set; } = ObjectId.GenerateNewId();

        [BsonElement("userId")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string UserId { get; set; } = string.Empty;

        [BsonElement("productIds")]
        [BsonRepresentation(BsonType.ObjectId)]
        public List<string> ProductIds { get; set; } = [];

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("updatedAt")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}