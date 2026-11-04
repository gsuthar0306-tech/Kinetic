
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Kinetic.Features.Product
{
    [BsonIgnoreExtraElements]
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
        public BsonValue Ratings { get; set; } = new BsonDouble(0);

        [BsonElement("no_of_ratings")]
        public BsonValue NoOfRatings { get; set; } = new BsonInt64(0);

        [BsonElement("discount_price")]
        public BsonValue DiscountPrice { get; set; } = new BsonDecimal128(Decimal128.Zero);

        [BsonElement("actual_price")]
        public BsonValue ActualPrice { get; set; } = new BsonDecimal128(Decimal128.Zero);

        [BsonElement("category")]
        public string Category { get; set; } = string.Empty;

        [BsonElement("images")]
        public List<string> Images { get; set; } = new();
    }
}
