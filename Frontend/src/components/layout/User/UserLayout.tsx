import { Outlet } from "react-router";
import UserSidebar from "./UserSidebar";

const UserLayout = () => {
  return (
    <>
      <main className="flex gap-2 px-5 justify-between bg-[#F8FAFC]">
        <div className="w-[20vw] h-auto">
          <UserSidebar />
        </div>
        <div className="w-[80vw]">
          <Outlet />
        </div>
      </main>
    </>
  );
};

export default UserLayout;
