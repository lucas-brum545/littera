import { FaUser, FaLock, FaGlobe } from "react-icons/fa"
import { useState } from "react"
import "./Login.css"

const paisesAmericaDoSul = [
    { sigla: "AR", nome: "Argentina" },
    { sigla: "BO", nome: "Bolívia" },
    { sigla: "BR", nome: "Brasil (Padrão)" },
    { sigla: "CL", nome: "Chile" },
    { sigla: "CO", nome: "Colômbia" },
    { sigla: "EC", nome: "Equador" },
    { sigla: "GY", nome: "Guiana" },
    { sigla: "PY", nome: "Paraguai" },
    { sigla: "PE", nome: "Peru" },
    { sigla: "SR", nome: "Suriname" },
    { sigla: "UY", nome: "Uruguai" },
    { sigla: "VE", nome: "Venezuela" }
];

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [paisSelecionado, setPaisSelecionado] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log({ username, password, paisSelecionado });
    }

  return (
    <div className="container">
        <header>
            <img className="logo" alt="Logo da Littera"/>
            <div className="contact-link">
                <p>
                    <a href="#">Contate-nos</a>
                </p>
            </div>
            <div className="signin-link">
                <p>
                    <a href="#">Iniciar Sessão</a>
                </p>
            </div>
            <div className="signup-link">
                <p>
                    <a href="#">Cadastrar-se</a>
                </p>
            </div>
        </header>
        <div className="title">
            <h1>Cadastre-se no Littera</h1>
            <p>ONG que garante acesso livre e gratuito ao conhecimento</p>
        </div>
        <form onSubmit={handleSubmit}>
            <h2 className="titulo">Informações da conta</h2>
            <input placeholder="Primeiro Nome" className="firstName" required/>
            <input placeholder="Segundo Nome" className="lastName" required/>
            <div>
                <label>E-mail</label>
                <input type="email" placeholder='E-mail' className="email" required onChange={(e) => setUsername(e.target.value)}/>
                <FaUser className="icon"/>
            </div>
            
            <div>
                <label>Senha</label>
                <input type="password" placeholder="Senha" className="senha" required onChange={(e) => setPassword(e.target.value)}/>
                <FaLock className="icon" />
            </div>

            <div>
                <select 
                    value={paisSelecionado} 
                    onChange={(e) => setPaisSelecionado(e.target.value)}
                    className="pais" required>
                    <option value="" disabled>
                        Selecione o seu país
                    </option>
                    {paisesAmericaDoSul.map((pais) => (
                        <option key={pais.sigla} value={pais.sigla}>
                            {pais.nome}
                        </option>
                    ))}
                </select>
                <FaGlobe className="icon" />
            </div>
            <button type="submit" className="submit">Iniciar minha Biblioteca</button>
        </form>
    </div>
  )
}

export default Login