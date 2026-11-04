using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Kinetic.Features.Users
{
    public enum UserRole
    {
        User,
        Admin
    }

    [BsonIgnoreExtraElements]
    public class User
    {
        [BsonId]
        public ObjectId Id { get; set; }

        [BsonElement("Role")]
        [BsonRepresentation(BsonType.String)]
        public UserRole Role { get; set; } = UserRole.User;

        [BsonElement("Firstname")]
        public string Firstname { get; set; } = string.Empty;

        [BsonElement("Lastname")]
        public string Lastname { get; set; } = string.Empty;

        // Keep the original single-string address when replacing older user documents.
        [BsonElement("Address")]
        public string Address { get; set; } = string.Empty;

        [BsonElement("Addresses")]
        public List<UserAddress> Addresses { get; set; } = new();

        [BsonElement("Number")]
        public string Number { get; set; } = string.Empty;

        [BsonElement("Email")]
        public string Email { get; set; } = string.Empty;

        [BsonElement("PasswordHash")]
        public string PasswordHash { get; set; } = string.Empty;

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("updatedAt")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }

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
