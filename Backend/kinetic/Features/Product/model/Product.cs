using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Kinetic.Features.Product
{
    [BsonIgnoreExtraElements]
    public class Product
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public ObjectId Id { get; set; } = ObjectId.GenerateNewId();

        [BsonElement("name")]
        public string Name { get; set; } = string.Empty;

        [BsonElement("main_category")]
        public string MainCategory { get; set; } = string.Empty;

        [BsonElement("sub_category")]
        public string SubCategory { get; set; } = string.Empty;

        [BsonElement("image")]
        public string Image { get; set; } = string.Empty;

        [BsonElement("images")]
        public List<string> Images { get; set; } = [];

        [BsonElement("link")]
        public string Link { get; set; } = string.Empty;

        [BsonElement("ratings")]
        public BsonValue Ratings { get; set; } = BsonNull.Value;

        [BsonElement("no_of_ratings")]
        public BsonValue NoOfRatings { get; set; } = BsonNull.Value;

        [BsonElement("discount_price")]
        public string DiscountPrice { get; set; } = string.Empty;

        [BsonElement("actual_price")]
        public string ActualPrice { get; set; } = string.Empty;
    }
}
