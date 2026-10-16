import { createContext, useState, useEffect } from 'react';
import api from '../../services/api';

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem('usuario');
    const tokenSalvo = localStorage.getItem('token');

    if (usuarioSalvo && tokenSalvo) {
      setUsuario(JSON.parse(usuarioSalvo));
    }
    setCarregando(false);
  }, []);

  async function login(email, senha) {
    const response = await api.post('/auth/login', { email, senha });
    const { token, id, nome, tipoUsuario } = response.data;
    const dadosUsuario = { id, nome, email, tipoUsuario };

    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(dadosUsuario));
    setUsuario(dadosUsuario);
    return dadosUsuario;
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ autenticado: !!usuario, usuario, login, logout, carregando }}>
      {children}
    </AuthContext.Provider>
  );
}