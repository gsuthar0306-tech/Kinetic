using MongoDB.Bson;
using MongoDB.Driver;
using Kinetic.Features.MongoDB;
using System.Globalization;

namespace Kinetic.Features.Product
{
    public class ProductService
    {
        private readonly IMongoCollection<Product> _collection;

        public ProductService(MongoDbConfig dbConfig)
        {
            _collection = dbConfig.GetCollection<Product>("products");
        }

        public async Task<(List<Product> Products, long TotalCount)> GetPageAsync(
            int page,
            int pageSize,
            IReadOnlyCollection<string>? categories = null)
        {
            var filter = categories is { Count: > 0 }
                ? Builders<Product>.Filter.In(product => product.MainCategory, categories)
                : Builders<Product>.Filter.Empty;
            var totalCount = await _collection.CountDocumentsAsync(filter);
            var products = await _collection.Find(filter)
                .SortBy(product => product.Id)
                .Skip((page - 1) * pageSize)
                .Limit(pageSize)
                .ToListAsync();

            return (products, totalCount);
        }

        public async Task<List<string>> GetCategoriesAsync()
        {
            var categories = await _collection
                .Distinct<string>(
                    "main_category",
                    Builders<Product>.Filter.Empty)
                .ToListAsync();

            return categories
                .Where(category => !string.IsNullOrWhiteSpace(category))
                .OrderBy(category => category)
                .ToList();
        }

        public async Task<Product?> GetByIdAsync(string id)
        {
            if (!ObjectId.TryParse(id, out var productId))
                return null;

            return await _collection.Find(p => p.Id == productId).FirstOrDefaultAsync();
        }

        public static bool TryParseRating(BsonValue value, out double rating)
        {
            rating = 0;
            if (value.IsBsonNull)
                return true;

            if (value.IsNumeric)
            {
                rating = value.ToDouble();
                return true;
            }

            if (value.IsString &&
                double.TryParse(
                    value.AsString,
                    NumberStyles.Float | NumberStyles.AllowThousands,
                    CultureInfo.InvariantCulture,
                    out rating))
            {
                return true;
            }

            return false;
        }

        public static bool TryParseRatingCount(BsonValue value, out long count)
        {
            count = 0;
            if (value.IsBsonNull)
                return true;

            if (value.IsNumeric)
            {
                count = value.ToInt64();
                return true;
            }

            if (value.IsString &&
                long.TryParse(
                    value.AsString.Replace(",", string.Empty),
                    NumberStyles.Integer,
                    CultureInfo.InvariantCulture,
                    out count))
            {
                return true;
            }

            return false;
        }

        public async Task<Product> CreateAsync(CreateProductDto createDto)
        {
            var createdProduct = new Product
            {
                Name = createDto.Name,
                MainCategory = createDto.MainCategory,
                SubCategory = createDto.SubCategory,
                Image = createDto.Image,
                Images = createDto.Images,
                Link = createDto.Link,
                Ratings = createDto.Ratings,
                NoOfRatings = createDto.NoOfRatings,
                DiscountPrice = createDto.DiscountPrice,
                ActualPrice = createDto.ActualPrice
            };

            await _collection.InsertOneAsync(createdProduct);
            return createdProduct;
        }

        public async Task<Product?> UpdateAsync(string id, Product updatedProduct)
        {
            if (!ObjectId.TryParse(id, out var productId))
                return null;

            updatedProduct.Id = productId;
            var result = await _collection.FindOneAndReplaceAsync(
                p => p.Id == productId,
                updatedProduct,
                new FindOneAndReplaceOptions<Product> { ReturnDocument = ReturnDocument.After }
            );
            return result;
        }

        public async Task<bool> DeleteAsync(string id)
        {
            if (!ObjectId.TryParse(id, out var productId))
                return false;

            var result = await _collection.DeleteOneAsync(p => p.Id == productId);
            return result.DeletedCount > 0;
        }
    }
}
