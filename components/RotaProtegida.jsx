
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../src/context/AuthContext";
import { isTokenExpirado, encerrarSessaoExpirada } from "../services/token";

export default function RotaProtegida() {
  const { autenticado, carregando } = useAuth();
  const token = localStorage.getItem("token");

  if (carregando) {
    return null;
  }

  if (!autenticado || isTokenExpirado(token)) {
    encerrarSessaoExpirada("expirado");
    return <Navigate to="/login?sessao=expirado" replace />;
  }

  return <Outlet />;
}
