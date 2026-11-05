import { createContext, useContext, useState, useEffect } from 'react';
import api from '../../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const salvo = localStorage.getItem("usuario");
    return salvo ? JSON.parse(salvo) : null;
  });
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const tokenSalvo = localStorage.getItem('token');
    if (tokenSalvo && usuario) {
      // Se necessário, podes validar a sessão aqui
    }
    setCarregando(false);
  }, [usuario]);

 async function login(email, senha) {
    // Note que passamos { email, senha } para bater com o record LoginRequest(String email, String senha)
    const response = await api.post('/api/auth/login', { email, senha });
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

  const autenticado = Boolean(usuario);

  return (
    <AuthContext.Provider value={{ autenticado, usuario, login, logout, carregando }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para facilitar o uso nos componentes (herdado do AuthContext2)
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}