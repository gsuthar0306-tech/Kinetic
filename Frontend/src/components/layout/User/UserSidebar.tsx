import { UserRound } from "lucide-react";
import { NavLink } from "react-router";
import { Heart, ShoppingBag } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import SinghOut from "@/components/subComponents/SinghOut";

// type Session = { name: string; email: string; type: string };

export type SideNavbarItem = {
  label: string;
  href: string;
  icon?: LucideIcon;
};

// function getSession(): Session | null {
//   const raw = localStorage.getItem("kinetic-session");
//   return raw ? (JSON.parse(raw) as Session) : null;
// }
const UserSidebar = () => {
  // const [session, setSession] = useState<Session | null>(null);
  const { user, logout } = useAuth();
  // useEffect(() => {
  //   const s = getSession();
  //   if (!s) {
  //     navigate("/login");
  //     return;
  //   }
  // }, [navigate]);

  if (!user) return null;

  const SideNavLinks: SideNavbarItem[] = [
    {
      label: "Overview & Account",
      href: "/profile",
    },
    {
      label: "Saved Wishlist",
      href: "/profile/favorites",
      icon: Heart,
    },
    {
      label: "Cart",
      href: "/profile/cart",
      icon: ShoppingBag,
    },
    {
      label: "Order",
      href: "/profile/order",
    },
    {
      label: "Security & Password",
      href: "/profile/setting&Password",
    },
  ];

  return (
    <>
      <main className="p-5  my-7 flex flex-col justify-around gap-5">
        <section className="flex gap-1.5 bg-white shadow-md border border-slate-200 rounded-2xl p-4">
          {/* <img
            src="https://m.media-amazon.com/images/M/MV5BMTMyNzkyNDkzMV5BMl5BanBnXkFtZTcwOTMzMTU4Ng@@._V1_.jpg"
            alt="Userimage"
            className="h-20 w-auto rounded-full"
          /> */}
          <div className="bg border-r border-slate-300 px-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-300 text-slate-950">
              <UserRound className="h-6 w-6" />
            </div>
          </div>
          <div>
            {/* <span>{session.type}</span> */}
            <h3 className="font-semibold">{user?.name}</h3>
            <h6 className="text-xs text-slate-700">{user?.email}</h6>
          </div>
        </section>
        <section className="bg-white border border-slate-200 shadow-md rounded-2xl p-4">
          <div className="gap-6 flex flex-col px-3">
            {SideNavLinks.map((link) => (
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
                {link.icon &&
                  (() => {
                    const Icon = link.icon;
                    return <Icon className="ml-2 inline-block h-4 w-4" />;
                  })()}
              </NavLink>
            ))}
          </div>
        </section>
        <SinghOut />
      </main>
    </>
  );
};

export default UserSidebar;
