import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);

const Cart = () => {
  const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity } =
    useCart();
  const subtotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

  if (cartItems.length === 0) {
    return (
      <main className="min-h-[60vh] px-6 py-12">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-3xl pb-7 font-semibold border-b border-slate-300">
            Your Cart
          </h1>

          <div className="bg-white mt-12 flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-500">
            <h2 className="text-xl font-medium">Your cart is empty</h2>

            <p className="mt-2 text-sm text-gray-500">
              Add some products to your cart to see them here.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[60vh] px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-semibold pb-7 border-b border-slate-300">
          Your Cart
        </h1>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_350px]">
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-4 bg-white rounded-xl border border-dashed border-slate-500 p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <img
                  src={item.product.thumbnail}
                  alt={item.product.title}
                  className="h-28 w-28 rounded-lg object-contain"
                />

                <div className="flex min-w-0 flex-1 flex-col justify-between">
                  <div>
                    <h2 className="font-medium">{item.product.title}</h2>

                    <p className="mt-1 text-sm text-gray-500">
                      {formatPrice(item.product.price)}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center rounded-lg border">
                      <button
                        type="button"
                        onClick={() => decreaseQuantity(item.product.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                      >
                        <Minus size={16} />
                      </button>

                      <span className="min-w-10 text-center text-sm">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() => increaseQuantity(item.product.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.product.id)}
                      className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                      Remove
                    </button>
                  </div>
                </div>

                <div className="hidden text-right sm:block">
                  <p className="font-medium">
                    {formatPrice(item.product.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="h-fit rounded-xl border p-6 bg-white">
            <h2 className="text-xl font-semibold">Order Summary</h2>

            <div className="mt-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>

                <span>{formatPrice(subtotal)}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shipping</span>

                <span>Free</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total products</span>

                <span>
                  {cartItems.reduce((total, item) => total + item.quantity, 0)}
                </span>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <span className="font-medium">Total</span>

                  <span className="font-semibold">{formatPrice(subtotal)}</span>
                </div>
              </div>

              <button
                type="button"
                className="mt-4 w-full rounded-lg bg-black px-4 py-3 text-sm font-medium text-white hover:bg-gray-800"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Cart;
