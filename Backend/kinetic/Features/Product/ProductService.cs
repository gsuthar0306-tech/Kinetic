using MongoDB.Bson;
using MongoDB.Driver;
using Kinetic.Features.MongoDB;

namespace Kinetic.Features.Product
{
    public class ProductService
    {
        private readonly IMongoCollection<Product> _collection;

        public ProductService(MongoDbConfig dbConfig)
        {
            _collection = dbConfig.GetCollection<Product>("products");
        }

        // Get all products
        public async Task<List<Product>> GetAllAsync()
        {
            return await _collection.Find(_ => true).ToListAsync();
        }

        // Get product by ID
        public async Task<Product?> GetByIdAsync(string id)
        {
            if (!ObjectId.TryParse(id, out var productId))
                return null;

            return await _collection.Find(p => p.Id == productId).FirstOrDefaultAsync();
        }

        // Create product
        public async Task<Product> CreateAsync(Product product)
        {
            product.CreatedAt = DateTime.UtcNow;
            product.UpdatedAt = DateTime.UtcNow;
            await _collection.InsertOneAsync(product);
            return product;
        }

        // Update product
        public async Task<Product?> UpdateAsync(string id, Product updatedProduct)
        {
            if (!ObjectId.TryParse(id, out var productId))
                return null;

            updatedProduct.UpdatedAt = DateTime.UtcNow;
            updatedProduct.Id = productId;
            var result = await _collection.FindOneAndReplaceAsync(
                p => p.Id == productId,
                updatedProduct,
                new FindOneAndReplaceOptions<Product> { ReturnDocument = ReturnDocument.After }
            );
            return result;
        }

        // Delete product
        public async Task<bool> DeleteAsync(string id)
        {
            if (!ObjectId.TryParse(id, out var productId))
                return false;

            var result = await _collection.DeleteOneAsync(p => p.Id == productId);
            return result.DeletedCount > 0;
        }
    }
}
