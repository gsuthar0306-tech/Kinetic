import "./App.css";
import { useEffect, useState } from "react";
import { Routes, Route } from "react-router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import PublicLayout from "@/components/layout/public/PublicLayout";
import AuthLayout from "@/components/layout/auth/AuthLayout";

import { LoginForm } from "@/features/auth/components/LoginForm";
import { RegisterForm } from "@/features/auth/components/RegisterForm";

import HomePage from "@/features/home/HomePage";
import StorePage from "@/features/store/StorePage";
import ProductDetails from "./features/Products/ProductDetails";

import Cart from "./features/UserProfile/components/Cart";
import Favorites from "./features/UserProfile/components/Favorites";

import { FavoritesProvider } from "./context/FavoritesContext";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

import { Profile } from "./features/UserProfile/Profile";
import UserLayout from "./components/layout/User/UserLayout";

import AdminLayout from "./components/layout/Admin/AdminLayout";
import AdminOrders from "./features/Admin/components/AdminOrders";
import AdminInventory from "./features/Admin/components/AdminInventory";
import AdminAnalytics from "./features/Admin/components/AdminAnalytics";
import AdminSetting from "./features/Admin/components/AdminSetting";

import ProtectedRoute from "./features/auth/ProtectedRoute";

import { Toaster } from "./components/ui/sonner";
import Order from "./features/UserProfile/components/Order";
import SAndpassword from "./features/UserProfile/components/SAndpassword";
import AdminAllusers from "./features/Admin/components/AdminAllusers";
import AdminDashboard from "./features/Admin/components/AdminDashboard";

function App() {
  const [isPreloading, setIsPreloading] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const timer = window.setTimeout(() => setIsPreloading(false), 700);
    return () => window.clearTimeout(timer);
  }, [prefersReducedMotion]);
  const showPreloader = isPreloading && prefersReducedMotion !== true;

  return (
    <>
      <AuthProvider>
        <FavoritesProvider>
          <CartProvider>
            <div className="min-h-screen bg-[var(--app-background)]">
              <Routes>
                <Route element={<PublicLayout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/store" element={<StorePage />} />
                  <Route path="/product/:id" element={<ProductDetails />} />

                  <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
                    <Route element={<UserLayout />}>
                      <Route path="/profile" element={<Profile />} />
                      <Route
                        path="/profile/favorites"
                        element={<Favorites />}
                      />
                      <Route path="/profile/cart" element={<Cart />} />
                      <Route path="/profile/order" element={<Order />} />
                      <Route
                        path="/profile/setting&password"
                        element={<SAndpassword />}
                      />
                    </Route>
                  </Route>
                </Route>

                <Route element={<AuthLayout />}>
                  <Route path="/login" element={<LoginForm />} />
                  <Route path="/register" element={<RegisterForm />} />
                </Route>

                <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
                  <Route element={<AdminLayout />}>
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/allusers" element={<AdminAllusers />} />
                    <Route path="/admin/order" element={<AdminOrders />} />
                    <Route
                      path="/admin/inventory"
                      element={<AdminInventory />}
                    />
                    <Route
                      path="/admin/analytics"
                      element={<AdminAnalytics />}
                    />
                    <Route path="/admin/setting" element={<AdminSetting />} />
                  </Route>
                </Route>
              </Routes>
              <AnimatePresence>
                {showPreloader && (
                  <motion.div
                    className="fixed inset-0 z-[200] flex items-center justify-center bg-[var(--app-background)]"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    aria-label="Loading KINETIC"
                    role="status"
                  >
                    <motion.div
                      className="flex flex-col items-center gap-5"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                    >
                      <span className="text-xl font-black tracking-[0.2em] text-blue-700">
                        KINETIC
                      </span>
                      <motion.span
                        className="h-7 w-7 rounded-full border-2 border-blue-100 border-t-blue-600"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 0.8,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
              <Toaster position="top-right" />
            </div>
          </CartProvider>
        </FavoritesProvider>
      </AuthProvider>
    </>
  );
}

export default App;
