import { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import logoLittera from "../../assets/Littera-logo.png";
import "./Login.css";
import MenuAside from "../MenuAside/MenuAside.jsx";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [logado, setLogado] = useState(false);
  const [erro, setErro] = useState(false);
  const [recuperando, setRecuperando] = useState(false);
  const [sucessoMsg, setSucessoMsg] = useState(false);
  const [msgErroRecuperacao, setMsgErroRecuperacao] = useState("");

  const logar = (event) => {
    event.preventDefault();

    if (username === "root" && password === "xyx123") {
      setLogado(true);
      setErro(false);
    } else {
      setLogado(false);
      setErro(true);
    }
  };

  const handleRecuperarSenha = (event) => {
    event.preventDefault();

    if (username === "root" && password.trim() !== "") {
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

  const mensagemErro = (
    <div style={{ color: "red" }}>
      <h3>Usuário ou senha incorretos!</h3>
    </div>
  );

  const exibeMenuAdmin = <MenuAside nomeUsuario={username} />;

  const esqueceuSenhaTela = (
    <div className="login-wrapper">
      <div className="container">
        <form onSubmit={handleRecuperarSenha}>
          <h1>Recuperar Senha</h1>
          <p>
            Insira o seu utilizador ("root") e defina uma nova senha de acesso.
          </p>

          <div className="input-field">
            <input
              type="text"
              placeholder="Usuário"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
            <label>
              <input type="checkbox" />
              Lembre de mim
            </label>
            <a href="#">Esqueceu sua senha?</a>
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

  return (
    <>
      {logado ? (
        exibeMenuAdmin
      ) : recuperando ? (
        <div>
          <img src={logoLittera} alt="Logotipo Littera" className="logo-img" />
          <br />
          {esqueceuSenhaTela}
        </div>
      ) : (
        <div className="login-wrapper">
          <img src={logoLittera} alt="Logotipo Littera" className="logo-img" />
          <br />
          <div className="container">
            <form onSubmit={logar}>
              <h1>Acesse o sistema</h1>

              <div className="input-field">
                <input
                  type="text"
                  placeholder="Usuário"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
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
                <label>
                  <input type="checkbox" />
                  Lembre de mim
                </label>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setRecuperando(true);
                    setErro(false);
                  }}
                >
                  Esqueceu sua senha?
                </a>
              </div>

              <button type="submit">Login</button>
              {erro ? mensagemErro : ""}
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;