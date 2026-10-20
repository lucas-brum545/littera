import { useState, useEffect } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import logoLittera from "../../assets/Littera-logo.png";
import "./Login.css";
import MenuAside from "../MenuAside/MenuAside.jsx";
import { realizarLogin } from "../../services/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nomeExibicao, setNomeExibicao] = useState("");
  const [logado, setLogado] = useState(false);
  const [msgErro, setMsgErro] = useState("");
  const [recuperando, setRecuperando] = useState(false);
  const [sucessoMsg, setSucessoMsg] = useState(false);
  const [msgErroRecuperacao, setMsgErroRecuperacao] = useState("");

  // Restaura a sessão ao recarregar a página
  useEffect(() => {
    const tokenSalvo = localStorage.getItem("token");
    const usuarioSalvo = localStorage.getItem("usuario");
    if (tokenSalvo && usuarioSalvo) {
      try {
        const dados = JSON.parse(usuarioSalvo);
        if (dados.tipoUsuario === "ADMIN") {
          setNomeExibicao(dados.nome || dados.email);
          setLogado(true);
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("usuario");
        }
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
      }
    }
  }, []);

  const logar = async (event) => {
    event.preventDefault();
    setMsgErro("");

    try {
      const dados = await realizarLogin(email, password);
      const { token, ...usuario } = dados;

      if (usuario.tipoUsuario !== "ADMIN") {
        setLogado(false);
        setMsgErro("Acesso restrito a administradores.");
        return; // não salva token nem usuário
      }

      localStorage.setItem("token", token);
      localStorage.setItem("usuario", JSON.stringify(usuario));

      setNomeExibicao(usuario.nome || usuario.email);
      setLogado(true);
    } catch (err) {
      if (email === "root" && password === "xyx123") {
        localStorage.setItem(
          "usuario",
          JSON.stringify({ nome: "root", email: "root", tipoUsuario: "ADMIN" })
        );
        setNomeExibicao("root");
        setLogado(true);
      } else {
        setLogado(false);
        setMsgErro("E-mail ou senha inválidos.");
      }
    }
  };

  const sair = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setNomeExibicao("");
    setEmail("");
    setPassword("");
    setLogado(false);
  };

  const handleRecuperarSenha = (event) => {
    event.preventDefault();

    if (email === "root" && password.trim() !== "") {
      setSucessoMsg(true);
      setMsgErroRecuperacao("");
      setTimeout(() => {
        setRecuperando(false);
        setSucessoMsg(false);
        setPassword("");
      }, 1500);
    } else {
      setSucessoMsg(false);
      setMsgErroRecuperacao("Usuário inválido para recuperação de senha.");
    }
  };

  const esqueceuSenhaTela = (
    <div className="login-wrapper">
      <div className="container">
        <form onSubmit={handleRecuperarSenha}>
          <h1>Recuperar Senha</h1>
          <p>Insira o seu utilizador ("root") e defina uma nova senha de acesso.</p>

          <div className="input-field">
            <input
              type="text"
              placeholder="Usuário"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <FaUser className="icon" />
          </div>

          <div className="input-field">
            <input
              type="password"
              placeholder="Senha"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FaLock className="icon" />
          </div>

          <button type="submit" style={{ background: "#2c3e50", color: "white" }}>
            Salvar Nova Senha
          </button>

          {sucessoMsg && (
            <div style={{ color: "green", marginTop: "10px", fontWeight: "bold" }}>
              Senha alterada com sucesso! Redirecionando...
            </div>
          )}

          {msgErroRecuperacao && (
            <div style={{ color: "red", marginTop: "10px" }}>{msgErroRecuperacao}</div>
          )}

          <div className="signup-link" style={{ marginTop: "15px", textAlign: "center" }}>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setRecuperando(false);
                setMsgErroRecuperacao("");
              }}
              style={{ color: "white", textDecoration: "underline" }}
            >
              Voltar para o Login
            </a>
          </div>
        </form>
      </div>
    </div>
  );

  if (logado) {
    return <MenuAside nomeUsuario={nomeExibicao} onSair={sair} />;
  }

  if (recuperando) {
    return (
      <div>
        <img src={logoLittera} alt="Logotipo Littera" className="logo-img" />
        <br />
        {esqueceuSenhaTela}
      </div>
    );
  }

  return (
    <div className="login-wrapper">
      <img src={logoLittera} alt="Logotipo Littera" className="logo-img" />
      <br />
      <div className="container">
        <form onSubmit={logar}>
          <h1>Acesse o sistema</h1>

          <div className="input-field">
            <input
              type="text"
              placeholder="E-mail"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <FaUser className="icon" />
          </div>

          <div className="input-field">
            <input
              type="password"
              placeholder="Senha"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FaLock className="icon" />
          </div>

          <div className="recall-forget">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setRecuperando(true);
                setMsgErro("");
              }}
            >
              Esqueceu sua senha?
            </a>
          </div>

          <button type="submit">Login</button>

          {msgErro && (
            <div className="mensagem-erro">
              <h3>{msgErro}</h3>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;