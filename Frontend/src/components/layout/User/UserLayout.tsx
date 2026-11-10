import { Outlet } from "react-router";
import UserSidebar from "./UserSidebar";

export default function UserLayout() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-[var(--app-background)] text-slate-900">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-3 py-3 pb-20 sm:px-5 md:gap-4 md:pb-6 lg:flex-row lg:items-start lg:gap-5 lg:px-6 lg:py-5">
        <aside className="w-full shrink-0 lg:sticky lg:top-20 lg:w-48 xl:w-52">
          <UserSidebar />
        </aside>
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
