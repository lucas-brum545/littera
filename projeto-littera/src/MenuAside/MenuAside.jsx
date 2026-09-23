import './MenuAside.css'

export default function MenuAside({ setTela }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        Littera
      </div>

      <nav className="sidebar-nav">
        <ul>
          <li className="has-submenu">
            <a href="#">Gerenciamento</a>

            <ul className="submenu">
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    setTela('leitores')
                  }}
                >
                  Gerenciamento de Leitores
                </a>
              </li>

              <li>
                <a href="#">Gerenciamento de Acervo</a>
              </li>

              <li>
                <a href="#">Gerenciamento de Empréstimos</a>
              </li>
            </ul>
          </li>

          <li className="logout">
            <a href="#">Sair</a>
          </li>
        </ul>
      </nav>
    </aside>
  )
}