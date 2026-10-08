import "./App.css";
import { Routes, Route } from "react-router";

import PublicLayout from "@/components/layout/public/PublicLayout";
import AuthLayout from "@/components/layout/auth/AuthLayout";

import { LoginForm } from "@/features/auth/components/LoginForm";
import { RegisterForm } from "@/features/auth/components/RegisterForm";

import HomePage from "@/pages/home/HomePage";
import StorePage from "@/pages/store/StorePage";
import ProductDetails from "./pages/ProductDetails/ProductDetails";

import Cart from "./features/UserProfile/components/Cart";
import Favorites from "./features/UserProfile/components/Favorites";

import { FavoritesProvider } from "./context/FavoritesContext";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

import { Profile } from "./pages/User/Profile";
import UserLayout from "./components/layout/User/UserLayout";

import Admin from "./pages/Admin/Admin";
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

function App() {
  return (
    <>
      <AuthProvider>
        <FavoritesProvider>
          <CartProvider>
            <div className="min-h-screen container mx-auto bg-white">
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
                    <Route path="/admin" element={<Admin />} />
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
              <Toaster position="top-right" />
            </div>
          </CartProvider>
        </FavoritesProvider>
      </AuthProvider>
    </>
  );
}

export default App;
