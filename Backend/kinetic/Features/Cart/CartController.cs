using System.Security.Claims;
using Kinetic.Features.Cart;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Kinetic.Features.Cart
{
    [ApiController]
    [Authorize]
    [Route("api/[controller]/[Action]")]
    public class CartController : ControllerBase
    {
        private readonly CartService _cartService;

        public CartController(CartService cartService)
        {
            _cartService = cartService;
        }

        private string? GetCurrentUserId()
        {
            return User.FindFirstValue(ClaimTypes.NameIdentifier);
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var userId = GetCurrentUserId();

            if (string.IsNullOrWhiteSpace(userId))
            {
                return Unauthorized();
            }

            try
            {
                var cart = await _cartService.GetResponseAsync(userId);

                return Ok(cart);
            }
            catch (ArgumentException)
            {
                return Unauthorized();
            }
        }

        [HttpPost]
        public async Task<IActionResult> Add(
            [FromBody] AddCartItemDto dto)
        {
            var userId = GetCurrentUserId();

            if (string.IsNullOrWhiteSpace(userId))
            {
                return Unauthorized();
            }

            if (string.IsNullOrWhiteSpace(dto.ProductId))
            {
                return BadRequest("Product ID is required.");
            }

            if (dto.Quantity <= 0)
            {
                return BadRequest("Quantity must be greater than zero.");
            }

            try
            {
                await _cartService.AddAsync(
                    userId,
                    dto.ProductId,
                    dto.Quantity);

                var cart = await _cartService.GetResponseAsync(userId);

                return Ok(cart);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpPut]
        public async Task<IActionResult> Quantity(
            [FromBody] UpdateCartQuantityDto dto)
        {
            var userId = GetCurrentUserId();

            if (string.IsNullOrWhiteSpace(userId))
            {
                return Unauthorized();
            }

            if (string.IsNullOrWhiteSpace(dto.ProductId))
            {
                return BadRequest("Product ID is required.");
            }

            if (dto.Quantity <= 0)
            {
                return BadRequest(
                    "Quantity must be greater than zero.");
            }

            var cart = await _cartService.SetQuantityAsync(
                userId,
                dto.ProductId,
                dto.Quantity);

            if (cart == null)
            {
                return NotFound("Cart item not found.");
            }

            return Ok(await _cartService.GetResponseAsync(userId));
        }

        [HttpDelete("{productId}")]
        public async Task<IActionResult> Remove(string productId)
        {
            var userId = GetCurrentUserId();

            if (string.IsNullOrWhiteSpace(userId))
            {
                return Unauthorized();
            }

            if (string.IsNullOrWhiteSpace(productId))
            {
                return BadRequest("Product ID is required.");
            }

            var cart = await _cartService.RemoveAsync(
                userId,
                productId);

            if (cart == null)
            {
                return NotFound("Cart not found.");
            }

            return Ok(await _cartService.GetResponseAsync(userId));
        }

        [HttpDelete]
        public async Task<IActionResult> Clear()
        {
            var userId = GetCurrentUserId();

            if (string.IsNullOrWhiteSpace(userId))
            {
                return Unauthorized();
            }

            await _cartService.ClearAsync(userId);

            return Ok(await _cartService.GetResponseAsync(userId));
        }
    }

    public class AddCartItemDto
    {
        public string ProductId { get; set; } = string.Empty;

        public int Quantity { get; set; } = 1;
    }

    public class UpdateCartQuantityDto
    {
        public string ProductId { get; set; } = string.Empty;

        public int Quantity { get; set; }
    }
}