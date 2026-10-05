import { Navigate, useLocation } from "react-router-dom";
import { useApp } from "../context/AppState";
import { homeFor } from "../lib/constants";

export default function Guard({ roles, children }) {
  const { user } = useApp();
  const location = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (roles && !roles.includes(user.role)) return <Navigate to={homeFor(user.role)} replace />;
  return children;
}
