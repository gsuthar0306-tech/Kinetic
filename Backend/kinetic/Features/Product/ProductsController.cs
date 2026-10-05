using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Kinetic.Features.Product
{
    [ApiController]
    [Route("api/[controller]/[Action]")]
    public class ProductsController : ControllerBase
    {
        private readonly ProductService _service;

        public ProductsController(ProductService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<List<ProductDto>>> GetAll()
        {
            var products = await _service.GetAllAsync();
            var dtos = products.Select(MapToDto).ToList();
            return Ok(dtos);
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
            if (string.IsNullOrWhiteSpace(createDto.Title))
                return BadRequest("Product title is required.");

            if (createDto.Price <= 0)
                return BadRequest("Product price must be greater than zero.");

            if (createDto.Stock < 0)
                return BadRequest("Product stock cannot be negative.");

            var product = new Product
            {
                dummyJsonId = createDto.DummyJsonId,
                images = createDto.Images,
                thumbnail = createDto.Thumbnail,
                tittle = createDto.Title,
                discription = createDto.Description,
                price = createDto.Price,
                discountPercentage = createDto.DiscountPercentage,
                category = createDto.Category,
                stock = createDto.Stock,
                rating = createDto.Rating,
                brand = createDto.Brand,

                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            var createdProduct = await _service.CreateAsync(product);
            return CreatedAtAction(
                nameof(GetById),
                new { id = createdProduct.Id.ToString() },
                MapToDto(createdProduct));
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<ActionResult<ProductDto>> Update(string id, [FromBody] UpdateProductDto updateDto)
        {
            var product = await _service.GetByIdAsync(id);
            if (product == null)
                return NotFound($"Product with id '{id}' not found.");

            if (string.IsNullOrWhiteSpace(updateDto.Title))
                return BadRequest("Product title is required.");

            if (updateDto.Price <= 0)
                return BadRequest("Product price must be greater than zero.");

            if (updateDto.Stock < 0)
                return BadRequest("Product stock cannot be negative.");

            product.dummyJsonId = updateDto.DummyJsonId;
            product.images = updateDto.Images;
            product.thumbnail = updateDto.Thumbnail;
            product.tittle = updateDto.Title;
            product.discription = updateDto.Description;
            product.price = updateDto.Price;
            product.discountPercentage = updateDto.DiscountPercentage;
            product.category = updateDto.Category;
            product.stock = updateDto.Stock;
            product.rating = updateDto.Rating;
            product.brand = updateDto.Brand;

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

        private static ProductDto MapToDto(Product product)
        {
            return new ProductDto
            {
                Id = product.Id.ToString(),
                DummyJsonId = product.dummyJsonId,
                Images = product.images,
                Thumbnail = product.thumbnail,
                Title = product.tittle,
                Description = product.discription,
                Price = product.price,
                DiscountPercentage = product.discountPercentage,
                Category = product.category,
                Stock = product.stock,
                Rating = product.rating,
                Brand = product.brand
            };
        }
    }
}
