
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../src/context/AuthContext";

export default function RotaProtegida() {
  const { autenticado } = useAuth();

  if (!autenticado) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
