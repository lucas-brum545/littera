// declarando menuaside.css
import './MenuAside.css';
export default function MenuAside() {
    return (
        <aside class="sidebar">
        <div class="sidebar-header">
            Littera
        </div>
        
        <nav class="sidebar-nav">
            <ul>
                {/* <div className='titulo_menu'>Menu do Admin</div>        */}
                <li class="has-submenu">
                    <a href="#">Gerenciamento</a>
                    <ul class="submenu">
                        <li><a href="#">Gerenciamento de Leitores</a></li>
                        <li><a href="#">Gerenciamento de Acervo</a></li>
                        <li><a href="#">Gerenciamento de Empréstimos</a></li>
                    </ul>
                </li>
                <li class="logout">
                    <a href="#">Sair</a>
                </li>
            </ul>
        </nav>
    </aside>
    )
}