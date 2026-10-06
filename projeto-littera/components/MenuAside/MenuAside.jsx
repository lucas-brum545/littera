import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { IoPeople } from "react-icons/io5"; // icone leitores
import { ImBooks } from "react-icons/im"; // icone acervo
import { PiHandArrowDownDuotone } from "react-icons/pi"; // icone emprestimos
import { IoLogOutOutline } from "react-icons/io5"; // icone sair
import GerenciamentoLeitores from '../../pages/GerenciamentoLeitores/GerenciamentoLeitores';
import GerenciamentoAcervo from '../../pages/GerenciamentoAcervo/GerenciamentoAcervo';
import GerenciamentoEmprestimo from '../../pages/GerenciamentoEmprestimo/GerenciamentoEmprestimo';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LogoutIcon from '@mui/icons-material/Logout';
import './MenuAside.css';

export default function MenuAside(props) {
    const admArmazenado = localStorage.getItem("admin") || "Administrador"
    const navigate = useNavigate();

    function sair(e) {
        e.preventDefault(); // Evita que a página recarregue ou suba ao clicar no link
        setSaiu(true);
    }

    function clicarGerLeitores(e){
        e.preventDefault(); // Evita que a página recarregue ou suba ao clicar no link
        setClicouGerLeitores(true);
    }

    // Se o estado 'saiu' for verdadeiro, renderiza a tela de login diretamente
    if (saiu) {
        return <Login />;
    }

    if (clicouGerLeitores){
        return <GerenciamentoLeitores></GerenciamentoLeitores>;
    }

    return (
        <div className="admin-layout-container">
            {/* Menu Lateral (Aside) */}
            <aside className="sidebar">
                <div className="sidebar-logo" style={{ justifyContent: 'center' }} />
                <nav className="sidebar-nav">
                    <ul>
                        <li className="has-submenu">
                            <Link to="/admin"><AssignmentIcon style={{height:'30px', width:'30px', paddingRight:'7px'}}/>Gerenciamento</Link>
                            <ul className="submenu">
                                <li><Link to="/admin/leitores"><IoPeople className='icon'/>Leitores</Link></li>
                                <li><Link to="/admin/acervo"><ImBooks className='icon'/>Acervo</Link></li>
                                <li><Link to="/admin/emprestimos"><PiHandArrowDownDuotone className='icon'/>Empréstimos</Link></li>
                            </ul>
                        </li>
                        <li className="logout">
                            <Link to="/login"><LogoutIcon style={{height:'30px', width:'30px', paddingRight:'7px',paddingBottom:'0px'}}/>Sair</Link>
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
                    <Route path="leitores" element={<GerenciamentoLeitores />} />
                    <Route path="acervo" element={<GerenciamentoAcervo />} />
                    <Route path="emprestimos" element={<GerenciamentoEmprestimo />} />
                </Routes>
            </main>
        </div>
    );
}