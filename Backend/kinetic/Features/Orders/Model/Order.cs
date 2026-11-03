using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Kinetic.Features.Orders
{
    public enum OrderStatus
    {
        Pending,
        Confirmed,
        Processing,
        Shipped,
        Delivered,
        Cancelled
    }

    public enum PaymentStatus
    {
        Pending,
        Paid,
        Failed,
        Refunded
    }

    [BsonIgnoreExtraElements]
    public class Order
    {
        [BsonId]
        public ObjectId Id { get; set; }

        [BsonElement("orderNumber")]
        public string OrderNumber { get; set; } = string.Empty;

        [BsonElement("userId")]
        public ObjectId UserId { get; set; }

        [BsonElement("status")]
        [BsonRepresentation(BsonType.String)]
        public OrderStatus Status { get; set; } = OrderStatus.Pending;

        [BsonElement("paymentStatus")]
        [BsonRepresentation(BsonType.String)]
        public PaymentStatus PaymentStatus { get; set; } =
            PaymentStatus.Pending;

        [BsonElement("currency")]
        public string Currency { get; set; } = "INR";

        [BsonElement("items")]
        public List<OrderItem> Items { get; set; } = new();

        [BsonElement("subtotal")]
        [BsonRepresentation(BsonType.Decimal128)]
        public decimal Subtotal { get; set; }

        [BsonElement("shippingCost")]
        [BsonRepresentation(BsonType.Decimal128)]
        public decimal ShippingCost { get; set; }

        [BsonElement("discount")]
        [BsonRepresentation(BsonType.Decimal128)]
        public decimal Discount { get; set; }

        [BsonElement("tax")]
        [BsonRepresentation(BsonType.Decimal128)]
        public decimal Tax { get; set; }

        [BsonElement("total")]
        [BsonRepresentation(BsonType.Decimal128)]
        public decimal Total { get; set; }

        [BsonElement("shippingAddress")]
        public OrderShippingAddress ShippingAddress { get; set; } = new();

        [BsonElement("payment")]
        public OrderPayment Payment { get; set; } = new();

        [BsonElement("notes")]
        public string? Notes { get; set; }

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("updatedAt")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }

    public class OrderItem
    {
        [BsonElement("productId")]
        public ObjectId ProductId { get; set; }

        [BsonElement("productName")]
        public string ProductName { get; set; } = string.Empty;

        [BsonElement("productImage")]
        public string? ProductImage { get; set; }

        [BsonElement("sku")]
        public string? Sku { get; set; }

        [BsonElement("unitPrice")]
        [BsonRepresentation(BsonType.Decimal128)]
        public decimal UnitPrice { get; set; }

        [BsonElement("quantity")]
        public int Quantity { get; set; }

        [BsonElement("lineTotal")]
        [BsonRepresentation(BsonType.Decimal128)]
        public decimal LineTotal { get; set; }
    }

    public class OrderShippingAddress
    {
        [BsonElement("fullName")]
        public string FullName { get; set; } = string.Empty;

        [BsonElement("phone")]
        public string Phone { get; set; } = string.Empty;

        [BsonElement("addressLine1")]
        public string AddressLine1 { get; set; } = string.Empty;

        [BsonElement("addressLine2")]
        public string? AddressLine2 { get; set; }

        [BsonElement("city")]
        public string City { get; set; } = string.Empty;

        [BsonElement("state")]
        public string State { get; set; } = string.Empty;

        [BsonElement("postalCode")]
        public string PostalCode { get; set; } = string.Empty;

        [BsonElement("country")]
        public string Country { get; set; } = "India";
    }

    public class OrderPayment
    {
        [BsonElement("method")]
        public string Method { get; set; } = string.Empty;

        [BsonElement("providerOrderId")]
        public string? ProviderOrderId { get; set; }

        [BsonElement("transactionId")]
        public string? TransactionId { get; set; }

        [BsonElement("paidAt")]
        public DateTime? PaidAt { get; set; }
    }
}