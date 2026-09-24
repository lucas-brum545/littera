import { useState } from 'react';
import Login from '../Login/Login';
import Footer from '../Footer/Footer';
import GerenciamentoLeitores from '../GerenciamentoLeitores/GerenciamentoLeitores'
import './MenuAside.css';

export default function MenuAside() {
    const [saiu, setSaiu] = useState(false);
    const [clicouGerLeitores, setClicouGerLeitores] = useState(false)
    const [clicouGerAcervo, setClicouGerAcervo] = useState(false)
    const [clicouGerEmprestimos, setClicouGerEmprestimos] = useState(false)

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
                            <a href="#">Gerenciamento</a>
                            <ul className="submenu">
                                {/* parte da karol */}
                                <li><a href="#" onClick={clicarGerLeitores}>Leitores</a></li>
                                {/* parte do luiz */}
                                <li><a href="#" onClick={clicouGerAcervo}>Acervo</a></li> 
                                {/* parte da viviane */}
                                <li><a href="#" onClick={clicouGerEmprestimos}>Empréstimos</a></li>
                            </ul>
                        </li>
                        <li className="logout">
                            <a href="#" onClick={sair}>Sair</a>
                        </li>
                    </ul>
                </nav>
            </aside>
            {/* Área de Conteúdo ao lado do menu */}
            <main className="admin-main-content">
                <h1 className="admin-title">Painel Administrativo</h1>
                <p className="admin-subtitle">Selecione uma opção ao lado para começar</p>
            </main>
            <Footer></Footer>
        </div>
    );
}