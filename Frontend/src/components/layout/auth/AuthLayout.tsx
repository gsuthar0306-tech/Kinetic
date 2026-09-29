import { ArrowLeft, Sparkles } from "lucide-react";
import { NavLink, Outlet, useLocation } from "react-router";

import LoginImage from "@/assets/images/Gemini_Generated_Image_kk3g18kk3g18kk3g.png";

const sideContent = {
  login: {
    alt: "KINETIC technology collection",
    title: "Technology that moves with you.",
    description:
      "Sign in to keep your favourite gear and order details in one place.",
  },
  register: {
    alt: "Person using KINETIC technology",
    title: "Build your everyday, brilliantly.",
    description: "Create an account to collect the technology you love.",
  },
};

export default function AuthLayout() {
  const { pathname } = useLocation();
  const content =
    pathname === "/register" ? sideContent.register : sideContent.login;

  return (
    <div className="grid min-h-svh bg-slate-100 lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-slate-900 lg:block">
        <img
          src={LoginImage}
          alt={content.alt}
          className="absolute inset-0 h-full w-full object-cover opacity-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-indigo-950/10" />
        <div className="absolute inset-x-0 bottom-0 p-10 text-white xl:p-14">
          <p className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-white/75">
            <Sparkles className="size-4" /> KINETIC members
          </p>
          <h2 className="max-w-md text-4xl font-semibold leading-tight">
            {content.title}
          </h2>
          <p className="mt-4 max-w-md text-base leading-7 text-slate-200">
            {content.description}
          </p>
        </div>
      </aside>

      <main className="flex min-h-svh flex-col bg-[radial-gradient(circle_at_top_right,_#e0e7ff,_transparent_34%),linear-gradient(135deg,_#f8fafc,_#eef2ff)] p-6 sm:p-8 lg:p-8">
        <header className="flex items-center justify-between gap-4">
          <NavLink
            to="/"
            className="text-lg font-black tracking-[0.16em] text-slate-950 transition-opacity hover:opacity-70"
          >
            KINETIC
          </NavLink>
          <NavLink
            to="/"
            className="inline-flex items-center gap-2 whitespace-nowrap text-sm font-medium text-slate-500 transition-colors hover:text-slate-950"
          >
            <ArrowLeft className="size-4" />
            Back to shop
          </NavLink>
        </header>
        <div className="flex flex-1 items-center justify-center py-6 sm:py-8">
          <div className="w-full max-w-md rounded-3xl border border-white/80 bg-white/90 p-6 shadow-xl shadow-slate-300/40 backdrop-blur sm:p-7">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
