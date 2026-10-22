using Kinetic.Features.MongoDB;
using Kinetic.Features.Product;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Kinetic.Features.Cart
{
    public class CartService
    {
        private readonly IMongoCollection<Cart> _carts;
        private readonly ProductService _productService;

        public CartService(
            MongoDbConfig dbConfig,
            ProductService productService)
        {
            _carts = dbConfig.GetCollection<Cart>("carts");
            _productService = productService;
        }

        public async Task<Cart> GetOrCreateCartAsync(string userId)
        {
            if (!ObjectId.TryParse(userId, out _))
            {
                throw new ArgumentException("Invalid user ID.");
            }

            var cart = await _carts
                .Find(item => item.UserId == userId)
                .FirstOrDefaultAsync();

            if (cart != null)
            {
                return cart;
            }

            cart = new Cart
            {
                UserId = userId,
                Items = [],
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _carts.InsertOneAsync(cart);

            return cart;
        }

        public async Task<Cart> GetAsync(string userId)
        {
            return await GetOrCreateCartAsync(userId);
        }

        public async Task<Cart> AddAsync(
            string userId,
            string productId,
            int quantity = 1)
        {
            if (quantity <= 0)
            {
                throw new ArgumentException(
                    "Quantity must be greater than zero.");
            }

            var product = await _productService.GetByIdAsync(productId);

            if (product == null)
            {
                throw new KeyNotFoundException("Product not found.");
            }

            var cart = await GetOrCreateCartAsync(userId);

            var existingItem = cart.Items.FirstOrDefault(
                item => item.ProductId == productId);

            if (existingItem != null)
            {
                existingItem.Quantity += quantity;
            }
            else
            {
                cart.Items.Add(new CartItem
                {
                    ProductId = productId,
                    Quantity = quantity
                });
            }

            cart.UpdatedAt = DateTime.UtcNow;

            await _carts.ReplaceOneAsync(
                item => item.Id == cart.Id,
                cart);

            return cart;
        }

        public async Task<Cart?> SetQuantityAsync(
            string userId,
            string productId,
            int quantity)
        {
            if (quantity <= 0)
            {
                throw new ArgumentException(
                    "Quantity must be greater than zero.");
            }

            var cart = await _carts
                .Find(item => item.UserId == userId)
                .FirstOrDefaultAsync();

            if (cart == null)
            {
                return null;
            }

            var item = cart.Items.FirstOrDefault(
                current => current.ProductId == productId);

            if (item == null)
            {
                return null;
            }

            item.Quantity = quantity;
            cart.UpdatedAt = DateTime.UtcNow;

            await _carts.ReplaceOneAsync(
                current => current.Id == cart.Id,
                cart);

            return cart;
        }

        public async Task<Cart?> RemoveAsync(
            string userId,
            string productId)
        {
            var cart = await _carts
                .Find(item => item.UserId == userId)
                .FirstOrDefaultAsync();

            if (cart == null)
            {
                return null;
            }

            cart.Items.RemoveAll(
                item => item.ProductId == productId);

            cart.UpdatedAt = DateTime.UtcNow;

            await _carts.ReplaceOneAsync(
                item => item.Id == cart.Id,
                cart);

            return cart;
        }

        public async Task<bool> ClearAsync(string userId)
        {
            var cart = await _carts
                .Find(item => item.UserId == userId)
                .FirstOrDefaultAsync();

            if (cart == null)
            {
                return false;
            }

            cart.Items.Clear();
            cart.UpdatedAt = DateTime.UtcNow;

            await _carts.ReplaceOneAsync(
                item => item.Id == cart.Id,
                cart);

            return true;
        }

        public async Task<CartResponseDto> GetResponseAsync(string userId)
        {
            var cart = await GetAsync(userId);
            var result = new CartResponseDto();

            foreach (var item in cart.Items)
            {
                var product = await _productService.GetByIdAsync(
                    item.ProductId);

                if (product == null)
                {
                    continue;
                }

                ProductService.TryParseRating(
                    product.Ratings,
                    out var rating);

                ProductService.TryParseRatingCount(
                    product.NoOfRatings,
                    out var ratingCount);

                result.Items.Add(new CartItemResponseDto
                {
                    ProductId = product.Id.ToString(),
                    Quantity = item.Quantity,
                    Product = new CartProductDto
                    {
                        Id = product.Id.ToString(),
                        Name = product.Name,
                        MainCategory = product.MainCategory,
                        SubCategory = product.SubCategory,
                        Image = product.Image,
                        Images = product.Images,
                        DiscountPrice = product.DiscountPrice,
                        ActualPrice = product.ActualPrice,
                        Rating = rating,
                        NoOfRatings = ratingCount
                    }
                });
            }

            return result;
        }
    }

    public class CartResponseDto
    {
        public List<CartItemResponseDto> Items { get; set; } = [];
    }

    public class CartItemResponseDto
    {
        public string ProductId { get; set; } = string.Empty;

        public int Quantity { get; set; }

        public CartProductDto Product { get; set; } = new();
    }

    public class CartProductDto
    {
        public string Id { get; set; } = string.Empty;

        public string Name { get; set; } = string.Empty;

        public string MainCategory { get; set; } = string.Empty;

        public string SubCategory { get; set; } = string.Empty;

        public string Image { get; set; } = string.Empty;

        public List<string> Images { get; set; } = [];

        public string DiscountPrice { get; set; } = string.Empty;

        public string ActualPrice { get; set; } = string.Empty;

        public double Rating { get; set; }

        public long NoOfRatings { get; set; }
    }
}