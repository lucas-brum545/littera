import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { isTokenExpirado, obterTempoRestanteToken, encerrarSessaoExpirada } from '../../services/token';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const token = localStorage.getItem("token");
    const salvo = localStorage.getItem("usuario");
    if (!token || isTokenExpirado(token)) {
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
      return null;
    }
    return salvo ? JSON.parse(salvo) : null;
  });
  const [carregando, setCarregando] = useState(true);

  const logout = useCallback((motivo = 'manual') => {
    setUsuario(null);
    encerrarSessaoExpirada(motivo);
  }, []);

  // Monitora o ciclo de vida do token em tempo real
  useEffect(() => {
    const tokenSalvo = localStorage.getItem('token');

    if (!tokenSalvo || isTokenExpirado(tokenSalvo)) {
      if (usuario) {
        logout('expirado');
      }
      setCarregando(false);
      return;
    }

    setCarregando(false);

    // Agenda um timer preciso para o momento exato em que o token do Spring Boot expirar
    const tempoRestante = obterTempoRestanteToken(tokenSalvo);
    let timerId = null;

    if (tempoRestante > 0) {
      timerId = setTimeout(() => {
        console.warn('Tempo limite do token atingido no cliente. Encerrando sessão...');
        logout('expirado');
      }, tempoRestante);
    }

    // Verifica também quando o usuário retorna à aba (ex: após suspensão do computador)
    function verificarAoFocar() {
      const tokenAtual = localStorage.getItem('token');
      if (!tokenAtual || isTokenExpirado(tokenAtual)) {
        logout('expirado');
      }
    }

    window.addEventListener('focus', verificarAoFocar);
    document.addEventListener('visibilitychange', verificarAoFocar);

    return () => {
      if (timerId) clearTimeout(timerId);
      window.removeEventListener('focus', verificarAoFocar);
      document.removeEventListener('visibilitychange', verificarAoFocar);
    };
  }, [usuario, logout]);

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

  const autenticado = Boolean(usuario && !isTokenExpirado(localStorage.getItem('token')));

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