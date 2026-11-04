using MongoDB.Bson;
using MongoDB.Driver;
using Kinetic.Features.MongoDB;
using System.Globalization;
using MongoDB.Bson.Serialization;

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
            IReadOnlyCollection<string>? categories = null,
            double? minPrice = null,
            double? maxPrice = null,
            double? minRating = null,
            string? sort = null,
            string? search = null)
        {
            var pipeline = new List<BsonDocument>();

            var priceExpression = BuildPriceExpression("$discount_price");
            var actualPriceExpression = BuildPriceExpression("$actual_price");

            // 1. Match product text and, for numeric searches, exact prices.
            if (!string.IsNullOrWhiteSpace(search))
            {
                var searchPattern = System.Text.RegularExpressions.Regex.Escape(search.Trim());

                var searchFields = new BsonArray
            {
                new BsonDocument(
                    "name",
                    new BsonDocument
                    {
                        { "$regex", searchPattern },
                        { "$options", "i" }
                    }
                ),
                new BsonDocument(
                    "main_category",
                    new BsonDocument
                    {
                        { "$regex", searchPattern },
                        { "$options", "i" }
                    }
                ),
                new BsonDocument(
                    "sub_category",
                    new BsonDocument
                    {
                        { "$regex", searchPattern },
                        { "$options", "i" }
                    }
                )
            };

                if (TryParseSearchPrice(search, out var searchPrice))
                {
                    searchFields.Add(
                        new BsonDocument(
                            "$expr",
                            new BsonDocument(
                                "$or",
                                new BsonArray
                                {
                                    new BsonDocument(
                                        "$eq",
                                        new BsonArray { priceExpression, searchPrice }
                                    ),
                                    new BsonDocument(
                                        "$eq",
                                        new BsonArray { actualPriceExpression, searchPrice }
                                    )
                                }
                            )
                        )
                    );
                }

                pipeline.Add(
                    new BsonDocument(
                        "$match",
                        new BsonDocument("$or", searchFields)
                    )
                );
            }

            // 2. Filter by the selected categories.
            if (categories is { Count: > 0 })
            {
                pipeline.Add(new BsonDocument(
                    "$match",
                    new BsonDocument(
                        "main_category",
                        new BsonDocument("$in", new BsonArray(categories))
                    )
                ));
            }

            // 2. Convert ratings to numbers, including string values.
            var ratingExpression = new BsonDocument(
                "$convert",
                new BsonDocument
                {
            { "input", "$ratings" },
            { "to", "double" },
            { "onError", 0 },
            { "onNull", 0 }
                }
            );

            pipeline.Add(new BsonDocument(
                "$addFields",
                new BsonDocument
                {
            { "_filterPrice", priceExpression },
            { "_filterRating", ratingExpression }
                }
            ));

            // 3. Apply minimum price, maximum price, and minimum rating.
            var filterConditions = new BsonArray();

            if (minPrice.HasValue)
            {
                filterConditions.Add(
                    new BsonDocument(
                        "$gte",
                        new BsonArray { "$_filterPrice", minPrice.Value }
                    )
                );
            }

            if (maxPrice.HasValue)
            {
                filterConditions.Add(
                    new BsonDocument(
                        "$lte",
                        new BsonArray { "$_filterPrice", maxPrice.Value }
                    )
                );
            }

            if (minRating.HasValue)
            {
                filterConditions.Add(
                    new BsonDocument(
                        "$gte",
                        new BsonArray { "$_filterRating", minRating.Value }
                    )
                );
            }

            if (filterConditions.Count > 0)
            {
                pipeline.Add(new BsonDocument(
                    "$match",
                    new BsonDocument(
                        "$expr",
                        new BsonDocument("$and", filterConditions)
                    )
                ));
            }

            // 4. Choose the requested sort order.
            var sortDocument = sort switch
            {
                "price-low" => new BsonDocument
        {
            { "_filterPrice", 1 },
            { "_id", 1 }
        },

                "price-high" => new BsonDocument
        {
            { "_filterPrice", -1 },
            { "_id", 1 }
        },

                "rating" => new BsonDocument
        {
            { "_filterRating", -1 },
            { "_id", 1 }
        },

                _ => new BsonDocument("_id", 1)
            };

            // 5. Get the requested page and the total matching count
            // in the same database aggregation.
            pipeline.Add(new BsonDocument(
                "$facet",
                new BsonDocument
                {
            {
                "items",
                new BsonArray
                {
                    new BsonDocument("$sort", sortDocument),
                    new BsonDocument("$skip", (page - 1) * pageSize),
                    new BsonDocument("$limit", pageSize),

                    // Remove temporary fields before deserializing Product.
                    new BsonDocument(
                        "$project",
                        new BsonDocument
                        {
                            { "_filterPrice", 0 },
                            { "_filterRating", 0 }
                        }
                    )
                }
            },
            {
                "metadata",
                new BsonArray
                {
                    new BsonDocument("$count", "totalCount")
                }
            }
                }
            ));

            var result = await _collection
                .Aggregate<BsonDocument>(pipeline)
                .FirstOrDefaultAsync();

            if (result == null)
            {
                return (new List<Product>(), 0);
            }

            var products = result["items"]
                .AsBsonArray
                .Select(item =>
                    BsonSerializer.Deserialize<Product>(item.AsBsonDocument))
                .ToList();

            var metadata = result["metadata"].AsBsonArray;

            long totalCount = metadata.Count > 0
                ? metadata[0].AsBsonDocument["totalCount"].ToInt64()
                : 0;

            return (products, totalCount);
        }

        private static BsonDocument BuildPriceExpression(string fieldName)
        {
            var priceAsString = new BsonDocument(
                "$convert",
                new BsonDocument
                {
                    { "input", fieldName },
                    { "to", "string" },
                    { "onError", "" },
                    { "onNull", "" }
                }
            );

            return new BsonDocument(
                "$convert",
                new BsonDocument
                {
                    {
                        "input",
                        new BsonDocument(
                            "$trim",
                            new BsonDocument(
                                "input",
                                new BsonDocument(
                                    "$replaceAll",
                                    new BsonDocument
                                    {
                                        {
                                            "input",
                                            new BsonDocument(
                                                "$replaceAll",
                                                new BsonDocument
                                                {
                                                    {
                                                        "input",
                                                        new BsonDocument(
                                                            "$ifNull",
                                                            new BsonArray { priceAsString, "" }
                                                        )
                                                    },
                                                    { "find", "₹" },
                                                    { "replacement", "" }
                                                }
                                            )
                                        },
                                        { "find", "," },
                                        { "replacement", "" }
                                    }
                                )
                            )
                        )
                    },
                    { "to", "double" },
                    { "onError", 0 },
                    { "onNull", 0 }
                }
            );
        }

        private static bool TryParseSearchPrice(string search, out double price)
        {
            var normalizedSearch = search
                .Replace("₹", string.Empty)
                .Replace(",", string.Empty)
                .Trim();

            return double.TryParse(
                    normalizedSearch,
                    NumberStyles.AllowDecimalPoint,
                    CultureInfo.InvariantCulture,
                    out price)
                && price >= 0;
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
                    out rating)
                )
            {
                return true;
            }

            return false;
        }

        public static bool TryParseRating(double value, out double rating)
        {
            rating = value;
            return double.IsFinite(value);
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

        public static bool TryParseRatingCount(long value, out long count)
        {
            count = value;
            return true;
        }

        public static double ParsePrice(string? price)
        {
            if (string.IsNullOrWhiteSpace(price))
                return 0;

            string number = new string(
                price.Where(c => char.IsDigit(c) || c == '.' || c == ',').ToArray()
            ).Replace(",", "");

            return double.TryParse(
                number,
                NumberStyles.Any,
                CultureInfo.InvariantCulture,
                out double result
            ) ? result : 0;
        }

        public static string FormatPrice(BsonValue? price)
        {
            if (price == null || price.IsBsonNull)
                return string.Empty;

            return price.IsString ? price.AsString : price.ToString() ?? string.Empty;
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
                Ratings = new BsonDouble(createDto.Ratings),
                NoOfRatings = new BsonInt64(createDto.NoOfRatings),
                DiscountPrice = new BsonDecimal128(Decimal128.Parse(createDto.DiscountPrice)),
                ActualPrice = new BsonDecimal128(Decimal128.Parse(createDto.ActualPrice))
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
