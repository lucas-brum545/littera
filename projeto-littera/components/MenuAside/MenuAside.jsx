import { useState } from 'react';
import Login from '../Login/Login';
import Footer from '../Footer/Footer';
import './MenuAside.css';

export default function MenuAside() {
    const [saiu, setSaiu] = useState(false);

    function sair(e) {
        e.preventDefault(); // Evita que a página recarregue ou suba ao clicar no link
        setSaiu(true);
    }

    // Se o estado 'saiu' for verdadeiro, renderiza a tela de login diretamente
    if (saiu) {
        return <Login />;
    }

    function gerLeitores(){
        return <GerenciamentoLeitores></GerenciamentoLeitores> // pegar a parte da karol
    }

    function gerAcervo(){
        return 
    }

    function gerLeitores(){
        return
    }
    
    function gerEmprestimos(){
        return
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
                                <li><a href="#" onClick={gerLeitores}>Leitores</a></li>
                                <li><a href="#" onClick={gerAcervo}>Acervo</a></li>
                                <li><a href="#" onClick={gerEmprestimos}>Empréstimos</a></li>
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