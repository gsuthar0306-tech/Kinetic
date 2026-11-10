import { Outlet } from "react-router";
import Navbar from "./Navbar";
import Footer from "./Footer";

const PublicLayout = () => {
  return (
    <>
      <div className="flex min-h-screen flex-col bg-transparent pb-16 md:pb-0">
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default PublicLayout;
