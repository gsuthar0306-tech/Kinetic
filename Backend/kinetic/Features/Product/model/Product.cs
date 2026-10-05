using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Kinetic.Features.Product
{
    public class Product
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public ObjectId Id { get; set; } = ObjectId.GenerateNewId();

        [BsonIgnoreIfNull]
        public int? dummyJsonId { get; set; }
        public List<string> images { get; set; } = new();
        public string thumbnail { get; set; } = string.Empty;
        public string tittle { get; set; } = string.Empty;
        public string discription { get; set; } = string.Empty;
        public decimal price { get; set; }
        public decimal discountPercentage { get; set; }
        public string category { get; set; } = string.Empty;
        public int stock { get; set; }
        public double rating { get; set; }
        public string brand { get; set; } = string.Empty;
        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("updatedAt")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}


