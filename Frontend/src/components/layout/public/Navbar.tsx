import { useNavigate, NavLink } from "react-router";
import { Heart, Menu, Search, ShoppingBag, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import ProductSearch from "./ProductSearch";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type NavLinkItem = {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
};

const navLinks: NavLinkItem[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Store",
    href: "/store",
  },
];

function Navbar() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const handleUserClick = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (user?.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/profile");
    }
  };

  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur relative z-[100] overflow-visible">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4 sm:h-18 sm:gap-5 sm:px-8">
        <a
          href="/"
          className="shrink-0 text-lg font-black tracking-[0.14em] text-slate-950 sm:text-xl sm:tracking-[0.18em]"
        >
          KINETIC
        </a>
        <div className="w-full min-w-0 max-w-xs">
          <ProductSearch />
        </div>

        <div className="flex items-center gap-1 text-slate-700">
          <div className="hidden items-center gap-6 lg:flex mx-5">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) =>
                  `text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "scale-105 text-slate-950"
                      : "text-slate-600 hover:scale-105 hover:text-slate-950"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
          <NavLink
            to="/profile/favorites"
            aria-label="Favorites"
            className={({ isActive }) =>
              `hidden rounded-full p-2.5 transition-colors hover:bg-slate-100 sm:block ${
                isActive ? "text-red-500" : "text-slate-950"
              }`
            }
          >
            {({ isActive }) => (
              <Heart
                className={`size-5 transition-colors ${
                  isActive ? "fill-red-500 text-red-500" : "text-slate-950"
                }`}
              />
            )}
          </NavLink>
          <Button
            size="icon"
            onClick={handleUserClick}
            aria-label={isAuthenticated ? "Profile" : "Login"}
            className="rounded-full p-2.5 transition-colors hover:bg-slate-100"
          >
            <UserRound className="size-5" />
          </Button>

          <NavLink
            to={"/profile/cart"}
            aria-label="Shopping bag"
            className="rounded-full p-2.5 transition-colors hover:bg-slate-100"
          >
            <ShoppingBag className="size-5" />
          </NavLink>

          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full lg:hidden"
                  aria-label="Open menu"
                />
              }
            >
              <Menu className="size-5" />
            </SheetTrigger>

            <SheetContent side="left">
              <div className="flex flex-col justify-between h-full">
                <div>
                  <SheetHeader>
                    <SheetTitle>KINETIC</SheetTitle>
                  </SheetHeader>

                  <nav className="flex flex-col gap-4 p-4">
                    {navLinks.map((link) => (
                      <NavLink
                        key={link.href}
                        to={link.href}
                        className={({ isActive }) =>
                          `text-sm font-medium transition-colors ${
                            isActive
                              ? "text-slate-950"
                              : "text-slate-600 hover:text-slate-950"
                          }`
                        }
                      >
                        {link.label}
                      </NavLink>
                    ))}
                  </nav>
                </div>
                <Button
                  variant="outline"
                  className="w-fit border-red-600 bg-transparent text-red-500 hover:bg-red-300/30 m-4"
                  onClick={handleUserClick}
                >
                  Sign out
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
