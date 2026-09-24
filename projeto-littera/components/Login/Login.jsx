import { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import logoLittera from '../../assets/Littera-logo.png'; // Ajuste o caminho conforme a estrutura da sua pasta
import "./Login.css";
import MenuAside from "../MenuAside/MenuAside";

const Login = () => {
  // Estados para armazenar as entradas do usuário
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [logado, setLogado] = useState(false);
  const [erro, setErro] = useState(false);

  function logar(){
    if (username === "root" && password === "xyx123") {
      setLogado(true)
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
  
  let exibeMenuAdmin = <MenuAside></MenuAside>

  return (
  <>
  {logado? 
  exibeMenuAdmin:
  <div>
  <img 
          src={logoLittera} 
          alt="Logotipo Littera" 
          className="logo-img" 
        />
    <br />
    <div className="container">
      <form onSubmit={handleSubmit}>
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
          <a href="#">Esqueceu sua senha?</a>
        </div>
        <button onClick={logar} type="submit">Login</button>
        {erro?mensagemErro:""}
        <div className="signup-link">
          
        </div>
        
      </form>
    </div>
    {/* <p>
            Não tem uma conta? <a href="#">Registrar</a>
          </p> */}
    </div>
    
  }
    </>
  );
};

export default Login;