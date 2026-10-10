import { useState } from 'react';
import Login from '../Login/Login.jsx';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { IoPeople } from "react-icons/io5"; // icone leitores
import { ImBooks } from "react-icons/im"; // icone acervo
import { PiHandArrowDownDuotone } from "react-icons/pi"; // icone emprestimos
import { CiBookmarkCheck } from "react-icons/ci";
import GerenciamentoUsuarios from '../../pages/GerenciamentoUsuarios/GerenciamentoUsuarios.jsx';
import GerenciamentoAcervo from '../../pages/GerenciamentoAcervo/GerenciamentoAcervo.jsx';
import GerenciamentoEmprestimo from '../../pages/GerenciamentoEmprestimo/GerenciamentoEmprestimo';
import GerenciamentoReservas from '../../pages/GerenciamentoReservas/GerenciamentoReservas.jsx';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LogoutIcon from '@mui/icons-material/Logout';
import './MenuAside.css';

export default function MenuAside(props) {
    const admArmazenado = localStorage.getItem("admin") || "Administrador"
    const [saiu, setSaiu] = useState(false);
    const [clicouGerUsuarios, setClicouGerUsuarios] = useState(false);
    const [clicouGerAcervo, setClicouGerAcervo] = useState(false);
    const [clicouGerEmprestimos, setClicouGerEmprestimos] = useState(false);
    const navigate = useNavigate();

    function sair(e) {
        e.preventDefault(); // Evita que a página recarregue ou suba ao clicar no link
        setSaiu(true);
    }

    function clicarGerUsuarios(e){
        e.preventDefault(); // Evita que a página recarregue ou suba ao clicar no link
        setClicouGerUsuarios(true);
    }

    function clicarGerAcervo(e){
        e.preventDefault();
        setClicouGerAcervo(true);
    }

    function clicarGerEmprestimos(e){
        e.preventDefault();
        setClicouGerEmprestimos(true);
    }

    // Se o estado 'saiu' for verdadeiro, renderiza a tela de login diretamente
    if (saiu) {
        return <Login />;
    }

    if (clicouGerUsuarios){
        return <GerenciamentoUsuarios></GerenciamentoUsuarios>;
    }


    if (clicouGerAcervo){
        return <GerenciamentoAcervo></GerenciamentoAcervo>;
    }

    if (clicouGerEmprestimos){
        return <GerenciamentoEmprestimo></GerenciamentoEmprestimo>;
    }

    return (
        <div className="admin-layout-container">
            {/* Menu Lateral (Aside) */}
            <aside className="sidebar">
                <div className="sidebar-logo" style={{ justifyContent: 'center' }} />
                <nav className="sidebar-nav">
                    <ul>
                        <li className="has-submenu">
                            <Link to="/admin"><AssignmentIcon style={{height:'25px', width:'25px', paddingRight:'7px'}}/>Gerenciamento</Link>
                            <ul className="submenu">
                                <li><Link to="/admin/usuarios"><IoPeople style={{height:'25px', width:'25px', paddingRight:'7px'}}/>Usuários</Link></li>
                                <li><Link to="/admin/acervo"><ImBooks style={{height:'25px', width:'25px', paddingRight:'7px'}}/>Acervo</Link></li>
                                <li><Link to="/admin/emprestimos"><PiHandArrowDownDuotone style={{height:'25px', width:'25px', paddingRight:'7px'}}/>Empréstimos</Link></li>
                                <li><Link to="/admin/reservas"><CiBookmarkCheck style={{height:'25px', width:'25px', paddingRight:'7px'}}/>Reservas</Link></li>
                            </ul>
                        </li>
                        <li className="logout">
                            <Link to="/login"><LogoutIcon style={{height:'25px', width:'25px', paddingRight:'7px'}}/>Sair</Link>
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
                            <span className='cabecalho-sessao'>Olá, {admArmazenado.toUpperCase()}!</span>
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