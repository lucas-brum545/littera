// import { useState } from 'react';
// import { Route, Routes } from 'react-router';
// import Login from '../Login/Login';
// import Footer from '../Footer/Footer';
// import GerenciamentoLeitores from '../GerenciamentoLeitores/GerenciamentoLeitores'
// import './MenuAside.css';
// import GerenciamentoAcervo from '../GerenciamentoAcervo/GerenciamentoAcervo';
// import GerenciamentoEmprestimo from '../GerenciamentoEmprestimo/GerenciamentoEmprestimo';

// export default function MenuAside() {
//     const [saiu, setSaiu] = useState(false);
//     const [clicouGerLeitores, setClicouGerLeitores] = useState(false)
//     const [clicouGerAcervo, setClicouGerAcervo] = useState(false)
//     const [clicouGerEmprestimos, setClicouGerEmprestimos] = useState(false)

//     function sair(e) {
//         e.preventDefault(); // Evita que a página recarregue ou suba ao clicar no link
//         setSaiu(true);
//     }

//     function clicarGerLeitores(e){
//         e.preventDefault(); // Evita que a página recarregue ou suba ao clicar no link
//         setClicouGerLeitores(true);
//     }

//     function clicarGerAcervo(e){
//         e.preventDefault(); // Evita que a página recarregue ou suba ao clicar no link
//         setClicouGerAcervo(true);
//     }

//     function clicarGerEmprestimos(e){
//         e.preventDefault(); // Evita que a página recarregue ou suba ao clicar no link
//         setClicouGerEmprestimos(true);
//     }

//     // Se o estado 'saiu' for verdadeiro, renderiza a tela de login diretamente
//     if (saiu) {
//         return <Login />;
//     }

//     if (clicouGerLeitores){
//         return <GerenciamentoLeitores></GerenciamentoLeitores>;
//     }

//     if(clicouGerAcervo){
//         return <GerenciamentoAcervo></GerenciamentoAcervo>
//     }

//     if(clicouGerEmprestimos){
//         return <GerenciamentoEmprestimo></GerenciamentoEmprestimo>
//     }

//     return (
//         <div className="admin-layout-container">
//             {/* Menu Lateral (Aside) */}
//             <aside className="sidebar">
//                 <div className="sidebar-logo" style={{ justifyContent: 'center' }} />
//                 <nav className="sidebar-nav">
//                     <ul>
//                         <li className="has-submenu">
//                             <a href="#">Gerenciamento</a>
//                             <ul className="submenu">
//                                 {/* parte da karol */}
//                                 <li><a href="#" onClick={clicarGerLeitores}>Leitores</a></li>
//                                 {/* parte do luiz */}
//                                 <li><a href="#" onClick={clicarGerAcervo}>Acervo</a></li> 
//                                 {/* parte da viviane */}
//                                 <li><a href="#" onClick={clicarGerEmprestimos}>Empréstimos</a></li>
//                             </ul>
//                         </li>
//                         <li className="logout">
//                             <a href="#" onClick={sair}>Sair</a>
//                         </li>
//                     </ul>
//                 </nav>
//             </aside>
//             {/* Área de Conteúdo ao lado do menu */}
//             <main className="admin-main-content">
//                 <h1 className="admin-title">Painel Administrativo</h1>
//                 <p className="admin-subtitle">Selecione uma opção ao lado para começar</p>
//             </main>
//             <Footer></Footer>
//         </div>
//     );
// }

import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Footer from '../Footer/Footer';
import GerenciamentoLeitores from '../GerenciamentoLeitores/GerenciamentoLeitores';
import GerenciamentoAcervo from '../GerenciamentoAcervo/GerenciamentoAcervo';
import GerenciamentoEmprestimo from '../GerenciamentoEmprestimo/GerenciamentoEmprestimo';
import './MenuAside.css';

export default function MenuAside() {
    const navigate = useNavigate();

    function sair(e) {
        e.preventDefault();
        navigate('/login'); // Redireciona para a tela de login via rota
    }

    return (
        <div className="admin-layout-container">
            {/* Menu Lateral (Aside) com links de navegação por rotas */}
            <aside className="sidebar">
                <div className="sidebar-logo" style={{ justifyContent: 'center' }} />
                <nav className="sidebar-nav">
                    <ul>
                        <li className="has-submenu">
                            <a href="#gerenciamento">Gerenciamento</a>
                            <ul className="submenu">
                                <li><Link to="/admin/leitores">Leitores</Link></li>
                                <li><Link to="/admin/acervo">Acervo</Link></li>
                                <li><Link to="/admin/emprestimos">Empréstimos</Link></li>
                            </ul>
                        </li>
                        <li className="logout">
                            <Link to="/login">Sair</Link>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* Área de Conteúdo que muda dinamicamente conforme a rota */}
            <main className="admin-main-content">
                <Routes>
                    {/* Tela inicial padrão do painel admin */}
                    <Route index element={
                        <>
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

            <Footer />
        </div>
    );
}