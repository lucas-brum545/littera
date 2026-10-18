import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const salvo = localStorage.getItem("usuario");

    return salvo ? JSON.parse(salvo) : null;
  });

  function login(dadosUsuario) {
    localStorage.setItem("usuario", JSON.stringify(dadosUsuario));
    setUsuario(dadosUsuario);
  }

  function logout() {
    localStorage.removeItem("usuario");
    setUsuario(null);
  }

  const autenticado = Boolean(usuario);

  return (
    <AuthContext.Provider
      value={{ usuario, autenticado, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
