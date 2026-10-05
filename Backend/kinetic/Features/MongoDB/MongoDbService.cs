using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace Kinetic.Features.MongoDB
{
    public class MongoDbService
    {
        private readonly IMongoDatabase _database;

        public MongoDbService(IConfiguration configuration, IOptions<MongoDbSettings> settings)
        {
            string connectionString = configuration.GetConnectionString("MongoDB") ??
             throw new InvalidOperationException("MongoDB connection string is missing.");

            MongoClient client = new MongoClient(connectionString);

            _database = client.GetDatabase(settings.Value.DatabaseName);
        }

        public IMongoDatabase Database => _database;
    }
}
