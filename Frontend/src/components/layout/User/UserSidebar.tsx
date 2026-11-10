import {
  Heart,
  LayoutDashboard,
  MapPin,
  Package,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { NavLink, useLocation } from "react-router";
import { useAuth } from "@/context/AuthContext";

export type SideNavbarItem = {
  label: string;
  href: string;
  icon?: LucideIcon;
};

type Item = { label: string; href: string; icon: LucideIcon };

const links: Item[] = [
  { label: "Overview", href: "/profile", icon: LayoutDashboard },
  { label: "Orders", href: "/profile/order", icon: Package },
  { label: "Wishlist", href: "/profile/favorites", icon: Heart },
  { label: "Bag & Cart", href: "/profile/cart", icon: ShoppingBag },
  { label: "Addresses", href: "/profile#addresses", icon: MapPin },
  { label: "Security", href: "/profile/setting&password", icon: ShieldCheck },
];

export default function UserSidebar() {
  const { user } = useAuth();
  const { pathname, hash } = useLocation();

  if (!user) return null;

  return (
    <aside className="rounded-xl border border-slate-200 bg-white p-2 shadow-sm lg:p-3">
      <p className="hidden px-2 pb-2 text-[10px] font-semibold uppercase tracking-[.15em] text-slate-400 lg:block">
        Account portal
      </p>
      <nav
        aria-label="Account navigation"
        className="grid grid-cols-3 gap-1 md:grid-cols-6 lg:grid-cols-1"
      >
        {links.map(({ label, href, icon: Icon }) => (
          <NavLink
            key={label}
            to={href}
            end={label === "Overview"}
            className={({ isActive }) => {
              const isSelected =
                label === "Addresses"
                  ? pathname === "/profile" && hash === "#addresses"
                  : isActive && !(label === "Overview" && hash === "#addresses");

              return `flex min-h-10 min-w-0 items-center justify-center gap-1.5 rounded-lg px-1.5 text-[11px] font-medium transition-colors sm:gap-2 sm:px-2 sm:text-xs lg:w-full lg:justify-start lg:px-3 lg:text-sm ${
                isSelected
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`;
            }}
          >
            <Icon size={16} className="shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
