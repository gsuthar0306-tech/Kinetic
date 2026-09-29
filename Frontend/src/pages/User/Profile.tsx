import {
  ArrowRight,
  Check,
  Heart,
  MapPin,
  Package,
  Pencil,
  ShoppingBag,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import type { PopconfirmProps } from "antd";
import { Popconfirm } from "antd";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

// type Session = {
//   id: string;
//   name: string;
//   email: string;
//   role: string;
//   password: string;
// };
type OrderItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};
type Order = {
  id: string;
  email: string;
  date: string;
  items: OrderItem[];
  total: number;
};

type Address = {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

const emptyAddress: Address = {
  street: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
};

// function getSession(): Session | null {
//   const raw = localStorage.getItem("kinetic-session");
//   return raw ? (JSON.parse(raw) as Session) : null;
// }

// function getOrdersForUser(email: string): Order[] {
//   const raw = localStorage.getItem("kinetic-orders");
//   const all: Order[] = raw ? JSON.parse(raw) : [];
//   return all.filter((o) => o.email === email);
// }

// function getAddressForUser(email: string): Address {
//   const raw = localStorage.getItem(`kinetic-address-${email}`);
//   return raw
//     ? { ...emptyAddress, ...(JSON.parse(raw) as Address) }
//     : emptyAddress;
// }

export function Profile() {
  const navigate = useNavigate();
  // const [session, setSession] = useState<Session | null>(null);
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [address, setAddress] = useState<Address>(emptyAddress);
  const [draftAddress, setDraftAddress] = useState<Address>(emptyAddress);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const { cartItems } = useCart();
  const { favorites } = useFavorites();

  const confirm: PopconfirmProps["onConfirm"] = () => {
    localStorage.removeItem("kinetic-session");
    toast.success("Signed successfully");
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  const cancel: PopconfirmProps["onCancel"] = (e) => {
    console.log(e);
    toast.error("Click on No");
  };

  // useEffect(() => {
  //   const s = getSession();
  //   if (!s) {
  //     navigate("/login");
  //     return;
  //   }
  //   setSession(s);
  //   setOrders(getOrdersForUser(s.email));
  //   const savedAddress = getAddressForUser(s.email);
  //   setAddress(savedAddress);
  //   setDraftAddress(savedAddress);
  // }, [navigate]);

  // if (!session) return null;

  const totalItems = orders.reduce(
    (sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0),
    0,
  );
  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const hasAddress = Object.values(address).some(Boolean);
  const stats: { icon: LucideIcon; label: string; value: string | number }[] = [
    { icon: Package, label: "Orders", value: orders.length },
    { icon: ShoppingBag, label: "Purchased", value: totalItems },
    { icon: Heart, label: "Liked", value: favorites.length },
    { icon: MapPin, label: "Address", value: hasAddress ? "Ready" : "Add" },
  ];

  const updateAddress = (field: keyof Address, value: string) => {
    setDraftAddress((current) => ({ ...current, [field]: value }));
  };

  const saveAddress = () => {
    localStorage.setItem(
      `kinetic-address-${user?.email}`,
      JSON.stringify(draftAddress),
    );
    setAddress(draftAddress);
    setIsEditingAddress(false);
  };

  const cancelAddressEdit = () => {
    setDraftAddress(address);
    setIsEditingAddress(false);
  };

  const addressFields: {
    key: keyof Address;
    label: string;
    placeholder: string;
  }[] = [
    { key: "street", label: "Street address", placeholder: "123 Main Street" },
    { key: "city", label: "City", placeholder: "New York" },
    { key: "state", label: "State", placeholder: "NY" },
    { key: "postalCode", label: "Postal code", placeholder: "10001" },
    { key: "country", label: "Country", placeholder: "United States" },
  ];

  if (user?.role === "user") {
    return (
      <main className="min-h-[70vh] bg-slate-50 px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-6xl">
          <section className="relative overflow-hidden rounded-2xl bg-slate-950 px-6 py-8 text-white shadow-sm sm:px-10 sm:py-10">
            <div className="absolute -right-16 -top-24 h-64 w-64 rounded-full border-[32px] border-amber-300/20" />
            <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-amber-300 text-slate-950">
                  <UserRound className="h-6 w-6" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">
                  Your account<span className="px-3">{user.role}</span>
                </p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                  Welcome back, {user.name}
                </h1>
                <p className="mt-2 text-sm text-slate-300">{user.email}</p>
              </div>
              <Popconfirm
                title="LOG OUT"
                description="Are you sure want to log out?"
                onConfirm={confirm}
                onCancel={cancel}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  variant="outline"
                  className="w-fit border-slate-600 bg-transparent text-white hover:bg-white hover:text-slate-950"
                >
                  Sign out
                </Button>
              </Popconfirm>
            </div>
          </section>

          <div className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
            <aside className="space-y-4">
              <button
                type="button"
                onClick={() => navigate("/favorites")}
                className="group flex w-full items-center justify-between rounded-xl border border-rose-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className="flex items-center gap-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-rose-50 text-rose-500">
                    <Heart className="h-5 w-5 fill-current" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-slate-950">
                      Favorites
                    </span>
                    <span className="mt-1 block text-xs text-slate-500">
                      {favorites.length} saved items
                    </span>
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1" />
              </button>
              <button
                type="button"
                onClick={() => navigate("/cart")}
                className="group flex w-full items-center justify-between rounded-xl border border-amber-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className="flex items-center gap-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                    <ShoppingBag className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-slate-950">
                      Shopping cart
                    </span>
                    <span className="mt-1 block text-xs text-slate-500">
                      {cartCount} items ready to buy
                    </span>
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1" />
              </button>
            </aside>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {stats.map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <Icon className="h-5 w-5 text-slate-400" />
                    <p className="mt-4 text-xs text-slate-500">{label}</p>
                    <p className="mt-1 text-xl font-semibold text-slate-950">
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                      Delivery details
                    </p>
                    <h2 className="mt-1 text-xl font-semibold text-slate-950">
                      Saved address
                    </h2>
                  </div>
                  {!isEditingAddress && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2"
                      onClick={() => setIsEditingAddress(true)}
                    >
                      <Pencil className="h-4 w-4" /> Edit
                    </Button>
                  )}
                </div>
                {isEditingAddress ? (
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    {addressFields.map((field) => (
                      <label
                        key={field.key}
                        className={
                          field.key === "street" ? "sm:col-span-2" : ""
                        }
                      >
                        <span className="mb-1.5 block text-xs font-medium text-slate-600">
                          {field.label}
                        </span>
                        <input
                          value={draftAddress[field.key]}
                          onChange={(event) =>
                            updateAddress(field.key, event.target.value)
                          }
                          placeholder={field.placeholder}
                          className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10"
                        />
                      </label>
                    ))}
                    <div className="flex gap-2 sm:col-span-2">
                      <Button onClick={saveAddress} className="gap-2">
                        <Check className="h-4 w-4" /> Save address
                      </Button>
                      <Button variant="ghost" onClick={cancelAddressEdit}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-5 flex items-start gap-3 rounded-lg bg-slate-50 p-4">
                    {" "}
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-slate-500" />
                    <p className="text-sm leading-6 text-slate-600">
                      {hasAddress ? (
                        <>
                          {address.street}
                          <br />
                          {address.city}, {address.state} {address.postalCode}
                          <br />
                          {address.country}
                        </>
                      ) : (
                        "Add a delivery address to make checkout faster."
                      )}
                    </p>
                  </div>
                )}
              </section>

              <section>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                      Your activity
                    </p>
                    <h2 className="mt-1 text-xl font-semibold text-slate-950">
                      Order history
                    </h2>
                  </div>
                  <span className="text-sm text-slate-500">
                    {totalSpent
                      ? `$${totalSpent.toFixed(2)} spent`
                      : "No purchases yet"}
                  </span>
                </div>
                {orders.length === 0 ? (
                  <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
                    <p className="text-sm text-slate-500">
                      Your completed orders will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="mt-4 flex flex-col gap-3">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                      >
                        <div className="flex justify-between text-sm text-slate-500">
                          <span>
                            {new Date(order.date).toLocaleDateString()}
                          </span>
                          <span className="font-semibold text-slate-950">
                            ${order.total.toFixed(2)}
                          </span>
                        </div>
                        <ul className="mt-3 flex flex-col gap-1.5">
                          {order.items.map((item) => (
                            <li
                              key={item.productId}
                              className="flex justify-between text-sm text-slate-700"
                            >
                              <span>
                                {item.name} × {item.quantity}
                              </span>
                              <span>
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      </main>
    );
  }
}
