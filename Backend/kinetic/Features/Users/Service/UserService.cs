
using Kinetic.Features.MongoDB;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Kinetic.Features.Users
{
    public class UserService
    {
        private readonly IMongoCollection<User> _collection;

        public UserService(MongoDbConfig dbConfig)
        {
            _collection = dbConfig.GetCollection<User>("users");
        }

        // Get all users
        public async Task<List<User>> GetAllAsync()
        {
            return await _collection
                .Find(static _ => true)
                .ToListAsync();
        }

        // Get user by ID
        public async Task<User?> GetByIdAsync(string id)
        {
            if (!ObjectId.TryParse(id, out var userId))
                return null;

            return await _collection
                .Find(user => user.Id == userId)
                .FirstOrDefaultAsync();
        }

        // Get user by email
        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _collection
                .Find(user => user.Email == email)
                .FirstOrDefaultAsync();
        }

        // Create user - used by AuthService
        public async Task<User> CreateAsync(User user)
        {
            await _collection.InsertOneAsync(user);
            return user;
        }

        // Update user profile
        public async Task<User?> UpdateAsync(
            string id,
            UpdateUserDto updateDto)
        {
            if (!ObjectId.TryParse(id, out var userId))
                return null;

            var user = await _collection
                .Find(existing => existing.Id == userId)
                .FirstOrDefaultAsync();

            if (user == null)
                return null;

            user.Firstname = updateDto.Firstname;
            user.Lastname = updateDto.Lastname;
            user.Number = updateDto.Number;
            user.UpdatedAt = DateTime.UtcNow;

            await _collection.ReplaceOneAsync(
                existing => existing.Id == userId,
                user);

            return user;
        }

        // Get user and their orders
        public async Task<BsonDocument?> GetUserWithOrdersAsync(
            string userId)
        {
            if (!ObjectId.TryParse(userId, out var objectId))
                return null;

            var usersCollection =
                _collection.Database.GetCollection<BsonDocument>("users");

            var pipeline = new[]
            {
                BsonDocument.Parse($$"""
                {
                    "$match": {
                        "_id": {{objectId.ToJson()}}
                    }
                }
                """),

                BsonDocument.Parse("""
                {
                    "$lookup": {
                        "from": "orders",
                        "let": {
                            "uId": "$_id"
                        },
                        "pipeline": [
                            {
                                "$match": {
                                    "$expr": {
                                        "$eq": ["$userId", "$$uId"]
                                    }
                                }
                            },
                            {
                                "$project": {
                                    "_id": 1,
                                    "orderNumber": 1,
                                    "status": 1,
                                    "paymentStatus": 1,
                                    "currency": 1,
                                    "items": 1,
                                    "subtotal": 1,
                                    "shippingCost": 1,
                                    "discount": 1,
                                    "tax": 1,
                                    "total": 1,
                                    "createdAt": 1
                                }
                            }
                        ],
                        "as": "userOrders"
                    }
                }
                """),

                BsonDocument.Parse("""
                {
                    "$project": {
                        "_id": 1,
                        "firstname": 1,
                        "lastname": 1,
                        "email": 1,
                        "number": 1,
                        "totalOrders": {
                            "$size": "$userOrders"
                        },
                        "userOrders": 1
                    }
                }
                """)
            };

            return await usersCollection
                .Aggregate<BsonDocument>(pipeline)
                .FirstOrDefaultAsync();
        }
    }
}
