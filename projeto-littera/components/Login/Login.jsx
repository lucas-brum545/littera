import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaUser, FaLock, FaKey } from "react-icons/fa";
import logoLittera from '../../assets/Littera-logo.png'; // Ajuste o caminho conforme a estrutura da sua pasta
import "./Login.css";
import MenuAside from "../MenuAside/MenuAside.jsx";

const Login = () => {
  // Estados para armazenar as entradas do usuário
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [logado, setLogado] = useState(false);
  const [erro, setErro] = useState(false);

  // senha a ser considerada
  const [storedPassword, setStoredPassword] = useState("xyx123");

  // recuperacao de senha
  const [recuperando, setRecuperando] = useState(false);
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");
  const [sucessoMsg, setSucessoMsg] = useState(false);
  const [msgErroRecuperacao, setMsgErroRecuperacao] = useState("");

  const navigate = useNavigate();

  // Função que executa o recadastro da nova senha
  const handleRecuperarSenha = (event) => {
    event.preventDefault();

    if (username !== "root") {
      setMsgErroRecuperacao("Utilizador administrativo inválido!");
      return;
    }

    if (novaSenha !== confirmaSenha) {
      setMsgErroRecuperacao("As novas senhas não coincidem!");
      return;
    }

    if (novaSenha.length < 4) {
      setMsgErroRecuperacao("A senha deve ter pelo menos 4 caracteres.");
      return;
    }

    // Atualiza a senha e comunica o sucesso
    setStoredPassword(novaSenha);
    setSucessoMsg(true);
    setMsgErroRecuperacao("");

    // Retorna para a tela de login após 2 segundos
    setTimeout(() => {
      setRecuperando(false);
      setSucessoMsg(false);
      setNovaSenha("");
      setConfirmaSenha("");
      setPassword("");
    }, 2000);
  };

  function logar(){
    if (username === "root" && password === "xyx123") {
      // e.preventDefault();
      setLogado(true)
      navigate('/admin');
    }
    else {
      // exibir em vermelho a mensagem de erro
      setErro(true)
    }
  }

  // Função que é chamada quando o formulário é enviado
  const handleSubmit = (event) => {
    // Impede que a página seja recarregada
    event.preventDefault();

    // Faz o console log das credenciais do usuário
    console.log("Dados de Login:", { username, password });
  };

  let mensagemErro = <div style={{ color: "red" }}>
                    <h3>Usuário ou senha incorretos!</h3>
                </div>
  
  // onde tudo comeca, de verdade
  let exibeMenuAdmin = <MenuAside></MenuAside>

  // rotina caso o vivente tenha esquecido a senha
  let esqueceuSenha = (
    <div className="container">
      <form onSubmit={handleRecuperarSenha}>
        <h1>Recuperar Senha</h1>
        <p style={{ color: "#666", fontSize: "14px", marginBottom: "15px" }}>
          Insira o seu utilizador ("root") e defina uma nova senha de acesso.
        </p>

        <div className="input-field">
          <input
            type="text"
            placeholder="Confirme o Usuário (root)"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <FaUser className="icon" />
        </div>

        <div className="input-field">
          <input
            type="password"
            placeholder="Nova Senha"
            required
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
          />
          <FaLock className="icon" />
        </div>

        <div className="input-field">
          <input
            type="password"
            placeholder="Confirme a Nova Senha"
            required
            value={confirmaSenha}
            onChange={(e) => setConfirmaSenha(e.target.value)}
          />
          <FaKey className="icon" />
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
          <div style={{ color: "red", marginTop: "10px" }}>
            {msgErroRecuperacao}
          </div>
        )}

        <div className="signup-link" style={{ marginTop: "15px", textAlign: "center" }}>
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); setRecuperando(false); setMsgErroRecuperacao(""); }}
            style={{ color: "#2c3e50", textDecoration: "underline" }}
          >
            Voltar para o Login
          </a>
        </div>
      </form>
    </div>
  );

  return <>
  
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
        <div>
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
                  onClick={(e) => { e.preventDefault(); setRecuperando(true); setErro(false); }}
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
  </>
};

export default Login;