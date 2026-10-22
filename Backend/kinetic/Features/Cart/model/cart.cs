using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Kinetic.Features.Cart
{
    public class Cart
    {
        [BsonId]
        public ObjectId Id { get; set; } = ObjectId.GenerateNewId();

        [BsonElement("userId")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string UserId { get; set; } = string.Empty;

        [BsonElement("items")]
        public List<CartItem> Items { get; set; } = [];

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("updatedAt")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }

    public class CartItem
    {
        [BsonElement("productId")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string ProductId { get; set; } = string.Empty;

        [BsonElement("quantity")]
        public int Quantity { get; set; } = 1;
    }
}