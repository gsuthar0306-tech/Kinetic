using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Kinetic.Features.Users
{
    public enum UserRole { User, Admin };
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

        [BsonElement("Age")]
        public int Age { get; set; }

        [BsonElement("Address")]
        public string Address { get; set; } = string.Empty;

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
}