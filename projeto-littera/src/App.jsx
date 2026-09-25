import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../components/Login/Login.jsx';
import MenuAside from '../components/MenuAside/MenuAside.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota inicial: Tela de Login */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Rota do Painel Admin (MenuAside já lida com as sub-rotas de leitores, acervo e empréstimos) */}
        <Route path="/admin/*" element={<MenuAside />} />
      </Routes>
    </BrowserRouter>
  );
}