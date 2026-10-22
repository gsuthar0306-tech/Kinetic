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

            var favorite = await _collection
                .Find(item => item.UserId == userId)
                .FirstOrDefaultAsync();

            if (favorite == null)
            {
                favorite = new Favorite
                {
                    UserId = userId,
                    ProductIds = [productId],
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                await _collection.InsertOneAsync(favorite);
                return true;
            }

            if (favorite.ProductIds.Contains(productId))
                return true;

            favorite.ProductIds.Add(productId);
            favorite.UpdatedAt = DateTime.UtcNow;

            await _collection.ReplaceOneAsync(
                item => item.Id == favorite.Id,
                favorite
            );

            return true;
        }

        public async Task<bool> RemoveAsync(string userId, string productId)
        {
            var favorite = await _collection
                .Find(item => item.UserId == userId)
                .FirstOrDefaultAsync();

            if (favorite == null)
                return false;

            bool removed = favorite.ProductIds.Remove(productId);

            if (!removed)
                return false;

            favorite.UpdatedAt = DateTime.UtcNow;

            await _collection.ReplaceOneAsync(
                item => item.Id == favorite.Id,
                favorite
            );

            return true;
        }

        public async Task ClearAsync(string userId)
        {
            await _collection.DeleteOneAsync(
                item => item.UserId == userId
            );
        }
    }
}