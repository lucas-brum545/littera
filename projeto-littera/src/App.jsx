import { useState } from 'react'
import './App.css'
import MenuAside from './MenuAside/MenuAside.jsx'
import GerenciamentoLeitores from './Components/GerenciamentoLeitores/GerenciamentoLeitores.jsx'

function App() {
  const [tela, setTela] = useState('inicio')

  return (
    <>
      <MenuAside setTela={setTela} />

      <main className="main-content">
        {tela === 'inicio' && (
          <>
            <h1>Painel Administrativo</h1>
            <p>Selecione uma opção no menu lateral para começar.</p>
          </>
        )}

        {tela === 'leitores' && <GerenciamentoLeitores />}
      </main>
    </>
  )
}

export default App