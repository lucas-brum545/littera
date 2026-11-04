import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import GroupIcon from '@mui/icons-material/Group';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import { IoPeople } from "react-icons/io5"; // icone leitores
import { ImBooks } from "react-icons/im"; // icone acervo
import { PiHandArrowDownDuotone } from "react-icons/pi"; // icone emprestimos
import BookIcon from '@mui/icons-material/Book';
import { CiBookmarkCheck } from "react-icons/ci";
import { useAuth } from "../../src/context/AuthContext.jsx";
import GerenciamentoUsuarios from "../../pages/GerenciamentoUsuarios/GerenciamentoUsuarios.jsx";
import GerenciamentoAcervo from "../../pages/GerenciamentoAcervo/GerenciamentoAcervo.jsx";
import GerenciamentoEmprestimo from "../../pages/GerenciamentoEmprestimo/GerenciamentoEmprestimo";
import GerenciamentoReservas from "../../pages/GerenciamentoReservas/GerenciamentoReservas.jsx";
import AssignmentIcon from "@mui/icons-material/Assignment";
import LogoutIcon from "@mui/icons-material/Logout";
import "./MenuAside.css";

export default function MenuAside(props) {
    const [nomeUsuario, setNomeUsuario] = useState(props.nomeUsuario || "");
    const navigate = useNavigate();
    const { logout } = useAuth();

    // Sincroniza o nome do usuário logado via props ou localStorage
    useEffect(() => {
        if (props.nomeUsuario) {
            setNomeUsuario(props.nomeUsuario);
            return;
        }
        const usuarioSalvo = localStorage.getItem("usuario");
        if (usuarioSalvo) {
            try {
                const dados = JSON.parse(usuarioSalvo);
                setNomeUsuario(dados.nome || dados.email || "Administrador");
            } catch {
                setNomeUsuario("Administrador");
            }
        }
    }, [props.nomeUsuario]);

    // Função de saída integrada corretamente com o AuthContext e o Router
    function sair(e) {
        e.preventDefault();
        logout();
        navigate("/login", { replace: true });
    }

    return (
        <div className="admin-layout-container">
            {/* Menu Lateral (Aside) */}
            <aside className="sidebar">
                <div className="sidebar-logo" style={{ justifyContent: 'center' }} />
                <nav className="sidebar-nav">
                    <ul>
                        <li className="has-submenu">
                            <Link to="/admin"><AssignmentIcon sx={{paddingRight:'7px', fontSize: 28}}/>Gerenciamento</Link>
                            <ul className="submenu">
                                <li><Link to="/admin/usuarios"><GroupIcon sx={{paddingRight:'7px', fontSize: 28}}/>Usuários</Link></li>
                                <li><Link to="/admin/acervo"><MenuBookIcon sx={{paddingRight:'7px', fontSize: 28}}/>Acervo</Link></li>
                                <li><Link to="/admin/emprestimos"><CompareArrowsIcon sx={{paddingRight:'7px', fontSize: 28}}/>Empréstimos</Link></li>
                                <li><Link to="/admin/reservas"><BookIcon sx={{paddingRight:'7px', fontSize: 28}}/>Reservas</Link></li>
                            </ul>
                        </li>
                        <li className="logout">
                            <Link to="/login" onClick={sair}>
                                <LogoutIcon sx={{paddingRight:'7px', fontSize: 28}}/>Sair
                            </Link>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* Área de Conteúdo ao lado do menu */}
            <main className="admin-main-content">
                <Routes>
                    {/* Tela inicial padrão do painel admin */}
                    <Route index element={
                        <>
                            <span className='cabecalho-sessao'>
                                Olá, {nomeUsuario ? nomeUsuario.toUpperCase() : "ADMINISTRADOR"}!
                            </span>
                            <h1 className="admin-title">Painel Administrativo</h1>
                            <p className="admin-subtitle">Selecione uma opção ao lado para começar</p>
                        </>
                    } />
                    
                    {/* Sub-rotas do painel */}
                    <Route path="usuarios" element={<GerenciamentoUsuarios />} />
                    <Route path="acervo" element={<GerenciamentoAcervo />} />
                    <Route path="emprestimos" element={<GerenciamentoEmprestimo />} />
                    <Route path="reservas" element={<GerenciamentoReservas />} />
                </Routes>
            </main>
        </div>
    );
}