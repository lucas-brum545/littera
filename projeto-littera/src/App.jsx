import { useState } from 'react'
import './App.css'
import MenuAside from './MenuAside/MenuAside.jsx'

function App() {

  return (
    <>
      <MenuAside />
      <main class="main-content">
        <h1>Painel Administrativo</h1>
        <p>Selecione uma opção no menu lateral para começar.</p>
    </main>
    </>
  )
}

export default App
