import { useState, useEffect } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import logoLittera from "../../assets/Littera-logo.png";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../src/context/AuthContext";
import Alert from '@mui/material/Alert';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recuperando, setRecuperando] = useState(false);
  const [sucessoMsg, setSucessoMsg] = useState(false);
  const [msgErroRecuperacao, setMsgErroRecuperacao] = useState("");

  useEffect(() => {
    const tokenSalvo = localStorage.getItem("token");
    const usuarioSalvo = localStorage.getItem("usuario");
    if (tokenSalvo && usuarioSalvo) {
      try {
        const dados = JSON.parse(usuarioSalvo);
        if (dados.tipoUsuario === "ADMIN") {
          navigate("/admin", { replace: true });
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("usuario");
        }
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
      }
    }
  }, [navigate]);

  const logar = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErro(false);

    try {
      // Chama diretamente a função login do AuthContext (que já gere o axios e o localStorage)
      await login(email, senha);
      
      setErro(false);
      navigate("/admin", { replace: true });

    } catch (error) {
      console.error("Erro ao tentar fazer login:", error);
      setErro(true);
    } finally {
      setLoading(false);
    }
  };

  const handleRecuperarSenha = (event) => {
    event.preventDefault();

    if (email === "root" && senha.trim() !== "") {
      setSucessoMsg(true);
      setMsgErroRecuperacao("");
      setTimeout(() => {
        setRecuperando(false);
        setSucessoMsg(false);
        setSenha("");
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
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
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

  return (
    <>
      {recuperando ? (
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
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                />
                <FaLock className="icon" />
              </div>

              <div className="recall-forget">
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
              <button type="submit" disabled={loading}>
                {loading ? "Entrando..." : "Login"}
              </button>
              <br />
              <br />
              {erro && (
                <Alert variant="filled" severity="error">
                  Usuário ou senha incorretos!
                </Alert>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;