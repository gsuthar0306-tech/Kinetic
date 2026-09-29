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
            var dtos = products.Select(p => new ProductDto
            {
                Id = p.Id.ToString(),
                Name = p.Name,
                Description = p.Description,
                Price = p.Price,
                Quantity = p.Quantity,
                CreatedAt = p.CreatedAt,
                UpdatedAt = p.UpdatedAt
            }).ToList();
            return Ok(dtos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDto>> GetById(string id)
        {
            var product = await _service.GetByIdAsync(id);
            if (product == null)
                return NotFound($"Product with id '{id}' not found.");

            var dto = new ProductDto
            {
                Id = product.Id.ToString(),
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                Quantity = product.Quantity,
                CreatedAt = product.CreatedAt,
                UpdatedAt = product.UpdatedAt
            };
            return Ok(dto);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<ProductDto>> Create([FromBody] CreateProductDto createDto)
        {
            if (string.IsNullOrWhiteSpace(createDto.Name))
                return BadRequest("Product name is required.");

            if (createDto.Price <= 0)
                return BadRequest("Product price must be greater than zero.");

            var product = new Product
            {
                Name = createDto.Name,
                Description = createDto.Description,
                Price = createDto.Price,
                Quantity = createDto.Quantity
            };

            var createdProduct = await _service.CreateAsync(product);
            var dto = new ProductDto
            {
                Id = createdProduct.Id.ToString(),
                Name = createdProduct.Name,
                Description = createdProduct.Description,
                Price = createdProduct.Price,
                Quantity = createdProduct.Quantity,
                CreatedAt = createdProduct.CreatedAt,
                UpdatedAt = createdProduct.UpdatedAt
            };
            return CreatedAtAction(nameof(GetById), new { id = createdProduct.Id.ToString() }, dto);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<ActionResult<ProductDto>> Update(string id, [FromBody] UpdateProductDto updateDto)
        {
            var product = await _service.GetByIdAsync(id);
            if (product == null)
                return NotFound($"Product with id '{id}' not found.");

            product.Name = updateDto.Name;
            product.Description = updateDto.Description;
            product.Price = updateDto.Price;
            product.Quantity = updateDto.Quantity;

            var updatedProduct = await _service.UpdateAsync(id, product);
            if (updatedProduct == null)
                return NotFound($"Product with id '{id}' not found.");

            var dto = new ProductDto
            {
                Id = updatedProduct.Id.ToString(),
                Name = updatedProduct.Name,
                Description = updatedProduct.Description,
                Price = updatedProduct.Price,
                Quantity = updatedProduct.Quantity,
                CreatedAt = updatedProduct.CreatedAt,
                UpdatedAt = updatedProduct.UpdatedAt
            };
            return Ok(dto);
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
    }
}
