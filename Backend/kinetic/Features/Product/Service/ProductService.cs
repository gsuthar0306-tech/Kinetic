using MongoDB.Bson;
using MongoDB.Driver;
using Kinetic.Features.MongoDB;
using System.Globalization;
using MongoDB.Bson.Serialization;
using System.Text.RegularExpressions;

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
            // Build the pipeline as MongoDB JSON stages, then parse each stage to BSON.
            var pipeline = new List<BsonDocument>();

            var priceExpression = BuildPriceExpression("$discount_price");
            var actualPriceExpression = BuildPriceExpression("$actual_price");

            // 1. Search product name/category/subcategory; also allow exact price search.
            if (!string.IsNullOrWhiteSpace(search))
            {
                var searchPattern = Regex.Escape(search.Trim());

                var searchStage = BsonDocument.Parse("""
                {
                    "$match": {
                        "$or": [
                            { "name": { "$regex": "", "$options": "i" } },
                            { "main_category": { "$regex": "", "$options": "i" } },
                            { "sub_category": { "$regex": "", "$options": "i" } }
                        ]
                    }
                }
                """);

                var searchConditions = searchStage["$match"]["$or"].AsBsonArray;
                foreach (var condition in searchConditions)
                {
                    var fieldCondition = condition.AsBsonDocument.GetElement(0).Value.AsBsonDocument;
                    fieldCondition["$regex"] = searchPattern;
                }

                if (TryParseSearchPrice(search, out var searchPrice))
                {
                    searchConditions.Add(BsonDocument.Parse($$"""
                    {
                        "$expr": {
                            "$or": [
                                { "$eq": [{{priceExpression.ToJson()}}, {{searchPrice.ToString(CultureInfo.InvariantCulture)}}] },
                                { "$eq": [{{actualPriceExpression.ToJson()}}, {{searchPrice.ToString(CultureInfo.InvariantCulture)}}] }
                            ]
                        }
                    }
                    """));
                }

                pipeline.Add(searchStage);
            }

            // 2. Filter by selected categories.
            if (categories is { Count: > 0 })
            {
                var categoryStage = BsonDocument.Parse("""
                {
                    "$match": {
                        "main_category": {
                            "$in": []
                        }
                    }
                }
                """);

                categoryStage["$match"]["main_category"]["$in"] =
                    new BsonArray(categories.Select(category => BsonValue.Create(category)));

                pipeline.Add(categoryStage);
            }

            // 3. Normalize prices and ratings so filtering/sorting works across stored types.
            var addFieldsStage = BsonDocument.Parse("""
            {
                "$addFields": {
                    "_filterPrice": {},
                    "_filterRating": {
                        "$convert": {
                            "input": "$ratings",
                            "to": "double",
                            "onError": 0,
                            "onNull": 0
                        }
                    }
                }
            }
            """);

            addFieldsStage["$addFields"]["_filterPrice"] = priceExpression;
            pipeline.Add(addFieldsStage);

            // 4. Apply optional minimum/maximum price and minimum rating.
            var filterConditions = new BsonArray();

            if (minPrice.HasValue)
            {
                filterConditions.Add(BsonDocument.Parse($$"""
                { "$gte": ["$_filterPrice", {{minPrice.Value.ToString(CultureInfo.InvariantCulture)}}] }
                """));
            }

            if (maxPrice.HasValue)
            {
                filterConditions.Add(BsonDocument.Parse($$"""
                { "$lte": ["$_filterPrice", {{maxPrice.Value.ToString(CultureInfo.InvariantCulture)}}] }
                """));
            }

            if (minRating.HasValue)
            {
                filterConditions.Add(BsonDocument.Parse($$"""
                { "$gte": ["$_filterRating", {{minRating.Value.ToString(CultureInfo.InvariantCulture)}}] }
                """));
            }

            if (filterConditions.Count > 0)
            {
                var filterStage = BsonDocument.Parse("""
                {
                    "$match": {
                        "$expr": {
                            "$and": []
                        }
                    }
                }
                """);

                filterStage["$match"]["$expr"]["$and"] = filterConditions;
                pipeline.Add(filterStage);
            }

            // 5. Select the sort document.
            var sortDocument = sort switch
            {
                "price-low" => BsonDocument.Parse("""{ "_filterPrice": 1, "_id": 1 }"""),
                "price-high" => BsonDocument.Parse("""{ "_filterPrice": -1, "_id": 1 }"""),
                "rating" => BsonDocument.Parse("""{ "_filterRating": -1, "_id": 1 }"""),
                _ => BsonDocument.Parse("""{ "_id": 1 }""")
            };

            // 6. $facet returns the current page and total matching count in one aggregation.
            var skip = Math.Max(0, (page - 1) * pageSize);
            var facetStage = BsonDocument.Parse($$"""
            {
                "$facet": {
                    "items": [
                        { "$sort": {{sortDocument.ToJson()}} },
                        { "$skip": {{skip}} },
                        { "$limit": {{pageSize}} },
                        {
                            "$project": {
                                "_filterPrice": 0,
                                "_filterRating": 0
                            }
                        }
                    ],
                    "metadata": [
                        { "$count": "totalCount" }
                    ]
                }
            }
            """);

            pipeline.Add(facetStage);

            var result = await _collection
                .Aggregate<BsonDocument>(pipeline)
                .FirstOrDefaultAsync();

            if (result == null)
            {
                return (new List<Product>(), 0);
            }

            var products = result["items"]
                .AsBsonArray
                .Select(item => BsonSerializer.Deserialize<Product>(item.AsBsonDocument))
                .ToList();

            var metadata = result["metadata"].AsBsonArray;
            long totalCount = metadata.Count > 0
                ? metadata[0].AsBsonDocument["totalCount"].ToInt64()
                : 0;

            return (products, totalCount);
        }

        // Builds the MongoDB JSON expression used to normalize a price such as "₹1,299".
        private static BsonDocument BuildPriceExpression(string fieldName)
        {
            var priceAsString = $$"""
            {
                "$convert": {
                    "input": "{{fieldName}}",
                    "to": "string",
                    "onError": "",
                    "onNull": ""
                }
            }
            """;

            return BsonDocument.Parse($$"""
            {
                "$convert": {
                    "input": {
                        "$trim": {
                            "input": {
                                "$replaceAll": {
                                    "input": {
                                        "$replaceAll": {
                                            "input": {
                                                "$ifNull": [
                                                    {{priceAsString}},
                                                    ""
                                                ]
                                            },
                                            "find": "₹",
                                            "replacement": ""
                                        }
                                    },
                                    "find": ",",
                                    "replacement": ""
                                }
                            }
                        }
                    },
                    "to": "double",
                    "onError": 0,
                    "onNull": 0
                }
            }
            """);
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
                .Distinct<string>("main_category", Builders<Product>.Filter.Empty)
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
                out double result) ? result : 0;
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
            return await _collection.FindOneAndReplaceAsync(
                p => p.Id == productId,
                updatedProduct,
                new FindOneAndReplaceOptions<Product> { ReturnDocument = ReturnDocument.After });
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
