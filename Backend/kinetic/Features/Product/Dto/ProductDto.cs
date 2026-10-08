using System.Text.Json.Serialization;

namespace Kinetic.Features.Product
{
    public class ProductDto
    {
        [JsonPropertyName("_id")]
        public string Id { get; set; } = string.Empty;

        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;

        [JsonPropertyName("main_category")]
        public string MainCategory { get; set; } = string.Empty;

        [JsonPropertyName("sub_category")]
        public string SubCategory { get; set; } = string.Empty;

        [JsonPropertyName("image")]
        public string Image { get; set; } = string.Empty;

        [JsonPropertyName("images")]
        public List<string> Images { get; set; } = [];

        [JsonPropertyName("link")]
        public string Link { get; set; } = string.Empty;

        [JsonPropertyName("ratings")]
        public double Ratings { get; set; }

        [JsonPropertyName("no_of_ratings")]
        public long NoOfRatings { get; set; }

        [JsonPropertyName("discount_price")]
        public string DiscountPrice { get; set; } = string.Empty;

        [JsonPropertyName("actual_price")]
        public string ActualPrice { get; set; } = string.Empty;
    }

    public class CreateProductDto
    {
        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;

        [JsonPropertyName("main_category")]
        public string MainCategory { get; set; } = string.Empty;

        [JsonPropertyName("sub_category")]
        public string SubCategory { get; set; } = string.Empty;

        [JsonPropertyName("image")]
        public string Image { get; set; } = string.Empty;

        [JsonPropertyName("images")]
        public List<string> Images { get; set; } = [];

        [JsonPropertyName("link")]
        public string Link { get; set; } = string.Empty;

        [JsonPropertyName("ratings")]
        public double Ratings { get; set; }

        [JsonPropertyName("no_of_ratings")]
        public long NoOfRatings { get; set; }

        [JsonPropertyName("discount_price")]
        public string DiscountPrice { get; set; } = string.Empty;

        [JsonPropertyName("actual_price")]
        public string ActualPrice { get; set; } = string.Empty;
    }

    public class UpdateProductDto : CreateProductDto
    {
    }

    public class PagedProductsDto
    {
        public List<ProductDto> Items { get; set; } = new();
        public long TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
    }
}
