
using Kinetic.Features.MongoDB;
using ProductModel = Kinetic.Features.Product.Product;
using Kinetic.Features.Users;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Kinetic.Features.Orders.Service
{
    public class OrderService
    {
        private readonly IMongoCollection<Order> _orders;
        private readonly IMongoCollection<User> _users;
        private readonly IMongoCollection<ProductModel> _products;
        public OrderService(MongoDbConfig dbConfig)
        {
            _orders = dbConfig.GetCollection<Order>("orders");
            _users = dbConfig.GetCollection<User>("users");
            _products = dbConfig.GetCollection<ProductModel>("products");
        }

        public async Task<OrderResponseDto?> CreateOrderAsync(
            string userId,
            CreateOrderDto dto)
        {
            if (!ObjectId.TryParse(userId, out var objectUserId))
                return null;

            var user = await _users
                .Find(u => u.Id == objectUserId)
                .FirstOrDefaultAsync();

            if (user == null)
                return null;

            // Find the selected saved address belonging to this user.
            var address = user.Addresses.FirstOrDefault(
                a => a.AddressId == dto.ShippingAddressId);

            if (address == null)
                throw new InvalidOperationException(
                    "Shipping address not found.");

            var orderItems = new List<OrderItem>();
            decimal subtotal = 0;

            foreach (var itemDto in dto.Items)
            {
                if (!ObjectId.TryParse(
                    itemDto.ProductId, out var productId))
                {
                    throw new InvalidOperationException(
                        $"Invalid product ID: {itemDto.ProductId}");
                }

                var product = await _products
                    .Find(p => p.Id == productId)
                    .FirstOrDefaultAsync();

                if (product == null)
                {
                    throw new InvalidOperationException(
                        $"Product not found: {itemDto.ProductId}");
                }

                // Use discounted price when available.
                decimal unitPrice = GetPrice(
                    product.DiscountPrice);

                if (unitPrice <= 0)
                {
                    unitPrice = GetPrice(product.ActualPrice);
                }

                if (unitPrice <= 0)
                {
                    throw new InvalidOperationException(
                        $"Invalid price for product: {product.Name}");
                }

                decimal lineTotal = unitPrice * itemDto.Quantity;
                subtotal += lineTotal;

                orderItems.Add(new OrderItem
                {
                    ProductId = product.Id,
                    ProductName = product.Name,
                    ProductImage = product.Image,
                    Sku = null,
                    UnitPrice = unitPrice,
                    Quantity = itemDto.Quantity,
                    LineTotal = lineTotal
                });
            }

            // Pricing policies can be added later.
            decimal shippingCost = 0;
            decimal discount = 0;
            decimal tax = 0;

            decimal total = subtotal
                + shippingCost
                + tax
                - discount;

            var order = new Order
            {
                OrderNumber = $"KIN-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString("N")[..8].ToUpper()}",
                UserId = user.Id,
                Status = OrderStatus.Pending,
                PaymentStatus = PaymentStatus.Pending,
                Currency = "INR",
                Items = orderItems,
                Subtotal = subtotal,
                ShippingCost = shippingCost,
                Discount = discount,
                Tax = tax,
                Total = total,
                ShippingAddress = new OrderShippingAddress
                {
                    FullName = address.FullName,
                    Phone = address.Phone,
                    AddressLine1 = address.AddressLine1,
                    AddressLine2 = address.AddressLine2,
                    City = address.City,
                    State = address.State,
                    PostalCode = address.PostalCode,
                    Country = address.Country
                },
                Payment = new OrderPayment
                {
                    Method = dto.PaymentMethod
                },
                Notes = dto.Notes,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _orders.InsertOneAsync(order);

            return ToResponseDto(order);
        }

        public async Task<List<OrderResponseDto>> GetMyOrdersAsync(
            string userId)
        {
            if (!ObjectId.TryParse(userId, out var objectUserId))
                return new List<OrderResponseDto>();

            var orders = await _orders
                .Find(o => o.UserId == objectUserId)
                .SortByDescending(o => o.CreatedAt)
                .ToListAsync();

            return orders.Select(ToResponseDto).ToList();
        }

        public async Task<OrderResponseDto?> GetMyOrderByIdAsync(
            string userId,
            string orderId)
        {
            if (!ObjectId.TryParse(userId, out var objectUserId)
                || !ObjectId.TryParse(orderId, out var objectOrderId))
            {
                return null;
            }

            var order = await _orders
                .Find(o => o.Id == objectOrderId
                    && o.UserId == objectUserId)
                .FirstOrDefaultAsync();

            return order == null ? null : ToResponseDto(order);
        }

        private static decimal GetPrice(BsonValue value)
        {
            if (value == null || value.IsBsonNull)
                return 0;

            try
            {
                return value.BsonType switch
                {
                    BsonType.Decimal128 =>
                        (decimal)value.AsDecimal128,

                    BsonType.Double =>
                        Convert.ToDecimal(value.AsDouble),

                    BsonType.Int32 =>
                        value.AsInt32,

                    BsonType.Int64 =>
                        value.AsInt64,

                    BsonType.String =>
                        decimal.TryParse(value.AsString, out var price)
                            ? price
                            : 0,

                    _ => 0
                };
            }
            catch
            {
                return 0;
            }
        }

        private static OrderResponseDto ToResponseDto(Order order)
        {
            return new OrderResponseDto
            {
                Id = order.Id.ToString(),
                OrderNumber = order.OrderNumber,
                UserId = order.UserId.ToString(),
                Status = order.Status,
                PaymentStatus = order.PaymentStatus,
                Currency = order.Currency,

                Items = order.Items.Select(item =>
                    new OrderItemResponseDto
                    {
                        ProductId = item.ProductId.ToString(),
                        ProductName = item.ProductName,
                        ProductImage = item.ProductImage,
                        Sku = item.Sku,
                        UnitPrice = item.UnitPrice,
                        Quantity = item.Quantity,
                        LineTotal = item.LineTotal
                    }).ToList(),

                Subtotal = order.Subtotal,
                ShippingCost = order.ShippingCost,
                Discount = order.Discount,
                Tax = order.Tax,
                Total = order.Total,

                ShippingAddress = order.ShippingAddress,
                Payment = order.Payment,
                Notes = order.Notes,
                CreatedAt = order.CreatedAt,
                UpdatedAt = order.UpdatedAt
            };
        }
    }
}
