
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Kinetic.Features.Product
{
    public class Product
    {
        [BsonId]
        public ObjectId Id { get; set; }

        [BsonElement("name")]
        public string Name { get; set; } = string.Empty;

        [BsonElement("main_category")]
        public string MainCategory { get; set; } = string.Empty;

        [BsonElement("sub_category")]
        public string SubCategory { get; set; } = string.Empty;

        [BsonElement("image")]
        public string Image { get; set; } = string.Empty;

        [BsonElement("link")]
        public string Link { get; set; } = string.Empty;

        [BsonElement("ratings")]
        public int Ratings { get; set; }

        [BsonElement("no_of_ratings")]
        public int NoOfRatings { get; set; }

        [BsonElement("discount_price")]
        public Decimal128 DiscountPrice { get; set; }

        [BsonElement("actual_price")]
        public Decimal128 ActualPrice { get; set; }

        [BsonElement("category")]
        public string Category { get; set; } = string.Empty;

        [BsonElement("images")]
        public List<string> Images { get; set; } = new();
    }
}
