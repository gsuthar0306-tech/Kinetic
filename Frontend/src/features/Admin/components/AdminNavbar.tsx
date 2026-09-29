import { ShieldUser } from "lucide-react";

export const AdminNavbar = () => {
  return (
    <>
      <main className="px-6 py-2 bg-white items-center">
        <div className="flex justify-between">
          <h1 className="shrink-0 text-lg font-black tracking-[0.14em] text-slate-950 sm:text-xl sm:tracking-[0.18em]">
            KENITEC
          </h1>
          <ShieldUser size={20} />
        </div>
      </main>
    </>
  );
};
