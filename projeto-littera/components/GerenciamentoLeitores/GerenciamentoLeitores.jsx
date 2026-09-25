import { useState } from 'react'
import { useNavigate } from 'react-router'
import './GerenciamentoLeitores.css'

function GerenciamentoLeitores() {
  const navigate = useNavigate();
  const [leitores, setLeitores] = useState([
    {
      id: 1,
      nome: 'Maria Silva',
      email: 'maria@email.com',
      telefone: '(51) 99999-9999',
    },
    {
      id: 2,
      nome: 'João Santos',
      email: 'joao@email.com',
      telefone: '(51) 98888-8888',
    },
  ])

  const [pesquisa, setPesquisa] = useState('')
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [editando, setEditando] = useState(null)

  const [formulario, setFormulario] = useState({
    nome: '',
    email: '',
    telefone: '',
  })

  function handleChange(e) {
    const { name, value } = e.target

    setFormulario({
      ...formulario,
      [name]: value,
    })
  }

  function abrirCadastro() {
    setEditando(null)

    setFormulario({
      nome: '',
      email: '',
      telefone: '',
    })

    setMostrarFormulario(true)
  }

  function editarLeitor(leitor) {
    setEditando(leitor.id)

    setFormulario({
      nome: leitor.nome,
      email: leitor.email,
      telefone: leitor.telefone,
    })

    setMostrarFormulario(true)
  }

  function salvarLeitor(e) {
    e.preventDefault()

    if (!formulario.nome || !formulario.email || !formulario.telefone) {
      alert('Preencha todos os campos.')
      return
    }

    if (editando !== null) {
      setLeitores(
        leitores.map((leitor) =>
          leitor.id === editando
            ? { ...leitor, ...formulario }
            : leitor
        )
      )
    } else {
      const novoLeitor = {
        id: Date.now(),
        ...formulario,
      }

      setLeitores([...leitores, novoLeitor])
    }

    setFormulario({
      nome: '',
      email: '',
      telefone: '',
    })

    setEditando(null)
    setMostrarFormulario(false)
  }

  function excluirLeitor(id) {
    const confirmar = window.confirm(
      'Tem certeza que deseja excluir este leitor?'
    )

    if (confirmar) {
      setLeitores(leitores.filter((leitor) => leitor.id !== id))
    }
  }

  const leitoresFiltrados = leitores.filter((leitor) =>
    leitor.nome.toLowerCase().includes(pesquisa.toLowerCase())
  )

  return (
    <div className="gerenciamento-leitores">
      <div className="cabecalho-leitores">
        <div>
          <h1>Gerenciamento de Leitores</h1>
          <p>Cadastre, pesquise, edite ou exclua leitores.</p>
        </div>

        <button className="botao-novo" onClick={abrirCadastro}>
          + Novo leitor
        </button>

        <button type="button" className="botao-voltar" onClick={()=>navigate('/admin')}>
              ⬅️ Voltar
            </button>
      </div>

      <div className="barra-pesquisa">
        <input
          type="text"
          placeholder="Pesquisar leitor pelo nome"
          value={pesquisa}
          onChange={(e) => setPesquisa(e.target.value)}
        />
      </div>

      {mostrarFormulario && (
        <form className="formulario-leitor" onSubmit={salvarLeitor}>
          <h2>
            {editando !== null ? 'Editar leitor' : 'Novo leitor'}
          </h2>

          <div className="campo">
            <label>Nome</label>
            <input
              type="text"
              name="nome"
              value={formulario.nome}
              onChange={handleChange}
              placeholder="Digite o nome"
            />
          </div>

          <div className="campo">
            <label>E-mail</label>
            <input
              type="email"
              name="email"
              value={formulario.email}
              onChange={handleChange}
              placeholder="Digite o e-mail"
            />
          </div>

          <div className="campo">
            <label>Telefone</label>
            <input
              type="text"
              name="telefone"
              value={formulario.telefone}
              onChange={handleChange}
              placeholder="Digite o telefone"
            />
          </div>

          <div className="acoes-formulario">
            <button
              type="button"
              className="botao-cancelar"
              onClick={() => setMostrarFormulario(false)}
            >
              Cancelar
            </button>

            <button type="submit" className="botao-salvar">
              Salvar
            </button>
          </div>
        </form>
      )}

      <div className="tabela-container">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Telefone</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {leitoresFiltrados.length > 0 ? (
              leitoresFiltrados.map((leitor) => (
                <tr key={leitor.id}>
                  <td>{leitor.nome}</td>
                  <td>{leitor.email}</td>
                  <td>{leitor.telefone}</td>

                  <td className="acoes">
                    <button
                      className="botao-editar"
                      onClick={() => editarLeitor(leitor)}
                    >
                      Editar
                    </button>

                    <button
                      className="botao-excluir"
                      onClick={() => excluirLeitor(leitor.id)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="nenhum-leitor">
                  Nenhum leitor encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default GerenciamentoLeitores