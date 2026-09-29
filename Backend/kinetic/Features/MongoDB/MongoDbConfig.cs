using MongoDB.Driver;

namespace Kinetic.Features.MongoDB
{
    public class MongoDbConfig
    {
        private readonly IMongoDatabase _database;

        public MongoDbConfig(MongoDbService mongoDbService)
        {
            _database = mongoDbService.Database;
        }

        public IMongoCollection<T> GetCollection<T>(string collectionName)
        {
            return _database.GetCollection<T>(collectionName);
        }
    }
}
