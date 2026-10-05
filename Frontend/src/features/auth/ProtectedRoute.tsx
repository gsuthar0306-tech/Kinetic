import { Navigate, Outlet, useLocation } from "react-router";

import { useAuth } from "@/context/AuthContext";
import type { UserRole } from "@/features/auth/auth.types";

type ProtectedRouteProps = {
  allowedRoles?: UserRole[];
};

// const DEV_MODE = true;

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
