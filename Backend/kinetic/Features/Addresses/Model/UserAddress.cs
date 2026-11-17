using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Kinetic.Features.Users
{
    public class UserAddress
    {
        [BsonElement("addressId")]
        public string AddressId { get; set; } = Guid.NewGuid().ToString("N");

        [BsonElement("label")]
        public string Label { get; set; } = string.Empty;

        [BsonElement("fullName")]
        public string FullName { get; set; } = string.Empty;

        [BsonElement("phone")]
        public string Phone { get; set; } = string.Empty;

        [BsonElement("addressLine1")]
        public string AddressLine1 { get; set; } = string.Empty;

        [BsonElement("addressLine2")]
        public string? AddressLine2 { get; set; }

        [BsonElement("city")]
        public string City { get; set; } = string.Empty;

        [BsonElement("state")]
        public string State { get; set; } = string.Empty;

        [BsonElement("postalCode")]
        public string PostalCode { get; set; } = string.Empty;

        [BsonElement("country")]
        public string Country { get; set; } = "India";

        [BsonElement("isDefault")]
        public bool IsDefault { get; set; }
    }
}