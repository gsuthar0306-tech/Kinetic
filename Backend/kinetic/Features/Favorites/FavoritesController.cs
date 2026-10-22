using System.Security.Claims;
using Kinetic.Features.Product;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using ProductModel = Kinetic.Features.Product.Product;

namespace Kinetic.Features.Favorites
{
    [ApiController]
    [Authorize]
    [Route("api/[controller]/[Action]")]
    public class FavoritesController : ControllerBase
    {
        private readonly FavoriteService _favoriteService;
        private readonly ProductService _productService;

        public FavoritesController(
            FavoriteService favoriteService,
            ProductService productService)
        {
            _favoriteService = favoriteService;
            _productService = productService;
        }

        private string? GetCurrentUserId()
        {
            return User.FindFirstValue(ClaimTypes.NameIdentifier);
        }

        // Convert MongoDB products into safe API response objects.
        private static ProductDto MapToDto(ProductModel product)
        {
            ProductService.TryParseRating(
                product.Ratings,
                out var rating
            );

            ProductService.TryParseRatingCount(
                product.NoOfRatings,
                out var ratingCount
            );

            return new ProductDto
            {
                Id = product.Id.ToString(),
                Name = product.Name,
                MainCategory = product.MainCategory,
                SubCategory = product.SubCategory,
                Image = product.Image,
                Images = product.Images,
                Link = product.Link,
                Ratings = rating,
                NoOfRatings = ratingCount,
                DiscountPrice = product.DiscountPrice,
                ActualPrice = product.ActualPrice
            };
        }

        private static List<ProductDto> MapToDtos(
            List<ProductModel> products)
        {
            return products.Select(MapToDto).ToList();
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var userId = GetCurrentUserId();

            if (string.IsNullOrWhiteSpace(userId))
                return Unauthorized();

            var products = await _favoriteService.GetAsync(userId);

            return Ok(MapToDtos(products));
        }

        [HttpPost]
        public async Task<IActionResult> Add(
            [FromBody] AddFavoriteDto dto)
        {
            var userId = GetCurrentUserId();

            if (string.IsNullOrWhiteSpace(userId))
                return Unauthorized();

            if (string.IsNullOrWhiteSpace(dto.ProductId))
                return BadRequest("Product ID is required.");

            if (!ObjectId.TryParse(dto.ProductId, out _))
                return BadRequest("Invalid product ID.");

            var product = await _productService.GetByIdAsync(dto.ProductId);

            if (product == null)
                return NotFound("Product not found.");

            var added = await _favoriteService.AddAsync(
                userId,
                dto.ProductId
            );

            if (!added)
                return BadRequest("Could not add this product to favorites.");

            var products = await _favoriteService.GetAsync(userId);

            return Ok(MapToDtos(products));
        }

        [HttpDelete("{productId}")]
        public async Task<IActionResult> Remove(string productId)
        {
            var userId = GetCurrentUserId();

            if (string.IsNullOrWhiteSpace(userId))
                return Unauthorized();

            if (!ObjectId.TryParse(productId, out _))
                return BadRequest("Invalid product ID.");

            var favoriteProducts = await _favoriteService.GetAsync(userId);

            if (!favoriteProducts.Any(
                product => product.Id.ToString() == productId))
            {
                return NotFound("Favorite product not found.");
            }

            var removed = await _favoriteService.RemoveAsync(
                userId,
                productId
            );

            if (!removed)
                return BadRequest("Could not remove this favorite.");

            var products = await _favoriteService.GetAsync(userId);

            return Ok(MapToDtos(products));
        }

        [HttpDelete]
        public async Task<IActionResult> Clear()
        {
            var userId = GetCurrentUserId();

            if (string.IsNullOrWhiteSpace(userId))
                return Unauthorized();

            await _favoriteService.ClearAsync(userId);

            return Ok(new List<ProductDto>());
        }
    }

    public class AddFavoriteDto
    {
        public string ProductId { get; set; } = string.Empty;
    }
}