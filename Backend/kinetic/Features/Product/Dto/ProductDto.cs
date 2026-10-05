namespace Kinetic.Features.Product
{
    public class ProductDto
    {
        public string? Id { get; set; }
        public int? DummyJsonId { get; set; }
        public List<string> Images { get; set; } = new();
        public string Thumbnail { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public decimal DiscountPercentage { get; set; }
        public string Category { get; set; } = string.Empty;
        public int Stock { get; set; }
        public double Rating { get; set; }
        public string Brand { get; set; } = string.Empty;
    }

    public class CreateProductDto
    {
        public int? DummyJsonId { get; set; }
        public List<string> Images { get; set; } = new();
        public string Thumbnail { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public decimal DiscountPercentage { get; set; }
        public string Category { get; set; } = string.Empty;
        public int Stock { get; set; }
        public double Rating { get; set; }
        public string Brand { get; set; } = string.Empty;
    }

    public class UpdateProductDto
    {
        public int? DummyJsonId { get; set; }
        public List<string> Images { get; set; } = new();
        public string Thumbnail { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public decimal DiscountPercentage { get; set; }
        public string Category { get; set; } = string.Empty;
        public int Stock { get; set; }
        public double Rating { get; set; }
        public string Brand { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
