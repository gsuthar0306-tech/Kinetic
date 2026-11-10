import { NavLink, useNavigate } from "react-router";
import { Heart, ShoppingBag, UserRound, Home, Grid2X2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import ProductSearch from "./ProductSearch";

const mobileLinks = [
  { label: "Home", to: "/", icon: Home, end: true },
  { label: "Shop", to: "/store", icon: Grid2X2 },
  { label: "Wishlist", to: "/profile/favorites", icon: Heart },
  { label: "Cart", to: "/profile/cart", icon: ShoppingBag },
  { label: "Account", to: "/profile", icon: UserRound },
];

export default function Navbar() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { cartItems } = useCart();
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const goAccount = () => {
    if (!isAuthenticated) navigate("/login");
    else navigate(user?.role === "admin" ? "/admin" : "/profile");
  };

  return (
    <>
      <header className="sticky top-0 z-[100] border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto grid max-w-7xl grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-2 px-4 py-2.5 sm:gap-x-4 sm:px-6 md:grid-cols-[auto_minmax(0,1fr)_auto] md:gap-x-5 lg:grid-cols-[auto_minmax(16rem,1fr)_auto] lg:gap-x-8">
          <NavLink
            to="/"
            className="shrink-0 text-base font-black tracking-[0.12em] text-black sm:text-lg sm:tracking-[0.16em] lg:text-xl"
          >
            KINETIC
          </NavLink>
          <div className="min-w-0 w-full max-w-[10rem] justify-self-center md:max-w-[14rem] lg:mx-auto lg:max-w-sm">
            <ProductSearch />
          </div>
          <div className="flex items-center justify-self-end gap-1 sm:gap-1.5">
            <nav
              aria-label="Main navigation"
              className="hidden items-center gap-4 md:flex lg:gap-6"
            >
              <NavLink
                to="/store"
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${isActive ? "text-blue-600" : "text-slate-600 hover:text-blue-600"}`
                }
              >
                Store
              </NavLink>
              <NavLink
                to="/profile/favorites"
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${isActive ? "text-blue-600" : "text-slate-600 hover:text-blue-600"}`
                }
              >
                Wishlist
              </NavLink>
            </nav>
            <button
              onClick={goAccount}
              aria-label="Account"
              className="hidden rounded-full p-1.5 text-slate-700 transition-colors hover:bg-slate-100 md:inline-flex"
            >
              <UserRound size={18} />
            </button>
            <NavLink
              to="/profile/cart"
              aria-label="Cart"
              className="relative rounded-full p-1.5 text-slate-700 transition-colors hover:bg-slate-100"
            >
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-semibold text-white">
                  {cartCount}
                </span>
              )}
            </NavLink>
          </div>
        </div>
      </header>

      <nav
        aria-label="Main mobile navigation"
        className="fixed inset-x-0 bottom-0 z-[120] border-t border-slate-200 bg-white/95 shadow-[0_-5px_20px_rgba(15,23,42,.07)] backdrop-blur md:hidden"
      >
        <div className="mx-auto grid max-w-lg grid-cols-5 px-1 pt-1.5 pb-[calc(.35rem+env(safe-area-inset-bottom))]">
          {mobileLinks.map(({ label, to, icon: Icon, end }) => (
            <NavLink
              key={label}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex min-h-12 flex-col items-center justify-center gap-1 rounded-lg text-[10px] font-medium ${isActive ? "text-blue-600" : "text-slate-500"}`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`flex h-7 w-9 items-center justify-center rounded-xl ${isActive ? "bg-blue-50" : ""}`}
                  >
                    <Icon
                      size={20}
                      strokeWidth={isActive ? 2.4 : 1.8}
                      className={
                        label === "Wishlist" && isActive ? "fill-blue-100" : ""
                      }
                    />
                  </span>
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
}
