import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../components/Login/Login.jsx";
import MenuAside from "../components/MenuAside/MenuAside.jsx";
import Footer from "../components/Footer/Footer.jsx";
import RotaProtegida from "../components/RotaProtegida.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Tela de login */}
          <Route path="/" element={<Login />} />
          <Route path="/login/*" element={<Login />} />

          {/* Rotas que exigem autenticação */}
          <Route element={<RotaProtegida />}>
            <Route path="/admin/*" element={<MenuAside />} />
          </Route>

          {/* Redirecionamento para a página inicial */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}
