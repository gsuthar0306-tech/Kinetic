using System.ComponentModel.DataAnnotations;

namespace Kinetic.Features.Orders
{
    public class CreateOrderDto
    {
        [Required]
        public string ShippingAddressId { get; set; } = string.Empty;

        [Required]
        [MinLength(1, ErrorMessage = "An order must contain at least one item.")]
        [MaxLength(50, ErrorMessage = "An order cannot contain more than 50 items.")]
        public List<CreateOrderItemDto> Items { get; set; } = new();

        [Required]
        [StringLength(30)]
        public string PaymentMethod { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Notes { get; set; }
    }

    public class CreateOrderItemDto
    {
        [Required]
        public string ProductId { get; set; } = string.Empty;

        [Range(1, 100)]
        public int Quantity { get; set; }
    }
}