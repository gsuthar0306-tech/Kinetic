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
                configuration["MongoDB:ConnectionString"] ??
                "mongodb://localhost:27017";

            if (string.IsNullOrWhiteSpace(connectionString))
            {
                throw new InvalidOperationException("MongoDB connection string is missing.");
            }

            if (string.IsNullOrWhiteSpace(settings.Value.DatabaseName))
                throw new InvalidOperationException("MongoDB database name is missing.");

            MongoClient client = new MongoClient(connectionString);

            _database = client.GetDatabase(settings.Value.DatabaseName);
        }

        public IMongoDatabase Database => _database;
    }
}
