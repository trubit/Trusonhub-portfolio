import { Navigate } from "react-router-dom";

import { useAuthStore } from "../../store/authStore";

export const ProtectedRoute = ({ children, adminOnly = false }) => {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  if (adminOnly && user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};
