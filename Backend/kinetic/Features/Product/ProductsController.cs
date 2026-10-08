using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Kinetic.Features.Product
{
    [ApiController]
    [Route("api/[controller]/[Action]")]
    public class ProductsController : ControllerBase
    {
        private readonly ProductService _service;
        private readonly ILogger<ProductsController> _logger;

        public ProductsController(
            ProductService service,
            ILogger<ProductsController> logger)
        {
            _service = service;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<PagedProductsDto>> GetAll(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 24,
            [FromQuery] string? categories = null)
        {
            if (page < 1)
                return BadRequest("Page must be greater than zero.");

            if (pageSize < 1 || pageSize > 100)
                return BadRequest("Page size must be between 1 and 100.");

            var selectedCategories = categories?
                .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
            var (products, totalCount) = await _service.GetPageAsync(
                page,
                pageSize,
                selectedCategories);
            return Ok(new PagedProductsDto
            {
                Items = products.Select(MapToDto).ToList(),
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize
            });
        }

        [HttpGet]
        public async Task<ActionResult<List<string>>> GetCategories()
        {
            return Ok(await _service.GetCategoriesAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDto>> GetById(string id)
        {
            var product = await _service.GetByIdAsync(id);
            if (product == null)
                return NotFound($"Product with id '{id}' not found.");

            return Ok(MapToDto(product));
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<ProductDto>> Create([FromBody] CreateProductDto createDto)
        {
            if (string.IsNullOrWhiteSpace(createDto.Name))
                return BadRequest("Product name is required.");

            try
            {
                var createdProduct = await _service.CreateAsync(createDto);
                return CreatedAtAction(
                    nameof(GetById),
                    new { id = createdProduct.Id.ToString() },
                    MapToDto(createdProduct));
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(ex.Message);
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<ActionResult<ProductDto>> Update(string id, [FromBody] UpdateProductDto updateDto)
        {
            var product = await _service.GetByIdAsync(id);
            if (product == null)
                return NotFound($"Product with id '{id}' not found.");

            if (string.IsNullOrWhiteSpace(updateDto.Name))
                return BadRequest("Product name is required.");

            product.Name = updateDto.Name;
            product.MainCategory = updateDto.MainCategory;
            product.SubCategory = updateDto.SubCategory;
            product.Image = updateDto.Image;
            product.Images = updateDto.Images;
            product.Link = updateDto.Link;
            product.Ratings = updateDto.Ratings;
            product.NoOfRatings = updateDto.NoOfRatings;
            product.DiscountPrice = updateDto.DiscountPrice;
            product.ActualPrice = updateDto.ActualPrice;

            var updatedProduct = await _service.UpdateAsync(id, product);
            if (updatedProduct == null)
                return NotFound($"Product with id '{id}' not found.");

            return Ok(MapToDto(updatedProduct));
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var deleted = await _service.DeleteAsync(id);
            if (!deleted)
                return NotFound($"Product with id '{id}' not found.");

            return NoContent();
        }

        private ProductDto MapToDto(Product product)
        {
            if (!ProductService.TryParseRating(product.Ratings, out var rating))
            {
                _logger.LogWarning(
                    "Product {ProductId} has an invalid ratings value {Ratings}; returning a rating of 0.",
                    product.Id,
                    product.Ratings);
            }

            if (!ProductService.TryParseRatingCount(product.NoOfRatings, out var ratingCount))
            {
                _logger.LogWarning(
                    "Product {ProductId} has an invalid no_of_ratings value {RatingCount}; returning a count of 0.",
                    product.Id,
                    product.NoOfRatings);
            }

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
    }
}
