
namespace Kinetic.Features.Orders
{
    public class OrderResponseDto
    {
        public string Id { get; set; } = string.Empty;

        public string OrderNumber { get; set; } = string.Empty;

        public string UserId { get; set; } = string.Empty;

        public OrderStatus Status { get; set; }

        public PaymentStatus PaymentStatus { get; set; }

        public string Currency { get; set; } = "INR";

        public List<OrderItemResponseDto> Items { get; set; } = new();

        public decimal Subtotal { get; set; }

        public decimal ShippingCost { get; set; }

        public decimal Discount { get; set; }

        public decimal Tax { get; set; }

        public decimal Total { get; set; }

        public OrderShippingAddress ShippingAddress { get; set; } = new();

        public OrderPayment Payment { get; set; } = new();

        public string? Notes { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }
    }

    public class OrderItemResponseDto
    {
        public string ProductId { get; set; } = string.Empty;

        public string ProductName { get; set; } = string.Empty;

        public string? ProductImage { get; set; }

        public string? Sku { get; set; }

        public decimal UnitPrice { get; set; }

        public int Quantity { get; set; }

        public decimal LineTotal { get; set; }
    }
}
