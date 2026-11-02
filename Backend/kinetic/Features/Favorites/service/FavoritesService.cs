using Kinetic.Features.MongoDB;
using Kinetic.Features.Product;
using MongoDB.Bson;
using MongoDB.Driver;
using ProductModel = Kinetic.Features.Product.Product;

namespace Kinetic.Features.Favorites
{
    public class FavoriteService
    {
        private readonly IMongoCollection<Favorite> _collection;
        private readonly ProductService _productService;

        public FavoriteService(
            MongoDbConfig dbConfig,
            ProductService productService)
        {
            _collection = dbConfig.GetCollection<Favorite>("favorites");
            _productService = productService;
        }

        public async Task<List<ProductModel>> GetAsync(string userId)
        {
            var favorite = await _collection
                .Find(item => item.UserId == userId)
                .FirstOrDefaultAsync();

            if (favorite == null)
                return [];

            var products = new List<ProductModel>();

            foreach (string productId in favorite.ProductIds)
            {
                var product = await _productService.GetByIdAsync(productId);

                if (product != null)
                    products.Add(product);
            }

            return products;
        }

        public async Task<bool> AddAsync(string userId, string productId)
        {
            if (!ObjectId.TryParse(productId, out _))
                return false;

            var product = await _productService.GetByIdAsync(productId);

            if (product == null)
                return false;

            var now = DateTime.UtcNow;
            var update = Builders<Favorite>.Update
                .SetOnInsert(item => item.UserId, userId)
                .SetOnInsert(item => item.CreatedAt, now)
                .Set(item => item.UpdatedAt, now)
                .AddToSet(item => item.ProductIds, productId);

            var result = await _collection.UpdateOneAsync(
                item => item.UserId == userId,
                update,
                new UpdateOptions { IsUpsert = true }
            );

            return result.IsAcknowledged;
        }

        public async Task<bool> RemoveAsync(string userId, string productId)
        {
            var update = Builders<Favorite>.Update
                .Pull(item => item.ProductIds, productId)
                .Set(item => item.UpdatedAt, DateTime.UtcNow);

            var result = await _collection.UpdateOneAsync(
                item => item.UserId == userId &&
                    item.ProductIds.Contains(productId),
                update
            );

            return result.ModifiedCount > 0;
        }

        public async Task ClearAsync(string userId)
        {
            await _collection.DeleteOneAsync(
                item => item.UserId == userId
            );
        }
    }
}