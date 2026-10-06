import { useState } from "react"
import './GerenciamentoEmprestimo.css'
import { useNavigate } from "react-router"
import { PiHandArrowDownDuotone } from "react-icons/pi"; // icone emprestimos
import { IoArrowBack } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
import dayjs from "dayjs"

export default function GerenciamentoEmprestimo(){
    const navigate = useNavigate()
    const [emprestimos, setEmprestimos] = useState([
        {
          id: 1,
          nomeUsuario: 'Maria Silva',
          emailUsuario: 'maria@email.com',
          tipoItem: 'Revista',
          itemTitulo: 'Super Interessante',
          dataEmprestimo: "2026-09-24",
          dataDevolucao: "2026-09-30" 
        },
        {
          id: 2,
          nomeUsuario: 'Maria Souza',
          emailUsuario: 'mariasouza@email.com',
          tipoItem: 'Livro',
          itemTitulo: 'Quem é voce alasca?',
          dataEmprestimo: "2026-09-24",
          dataDevolucao: "2026-09-30"
        },
        {
          id: 3,
          nomeUsuario: 'Joao Rafael',
          emailUsuario: 'joaorafa@email.com',
          tipoItem: 'Livro',
          itemTitulo: 'Maravilhas da matemática',
          dataEmprestimo: "2026-09-21",
          dataDevolucao: "2026-09-28"
        }
      ])
    
    const [pesquisa, setPesquisa] = useState('')
    const [mostrarFormulario, setMostrarFormulario] = useState(false)
    const [editar, setEditar] = useState(null)
    const [formulario, setFormulario] = useState(
        {
          nomeUsuario: '',
          emailUsuario: '',
          tipoItem: '',
          itemTitulo: '',
          dataEmprestimo: "",
          dataDevolucao: ""
        }
    )
    
    function handleChange(e) {
      const { name, value } = e.target

      setFormulario({
        ...formulario,
        [name]: value,
      })
    }

    function abrirCadastro() {
      setEditar(null)

      setFormulario({
          nomeUsuario: '',
          emailUsuario: '',
          tipoItem: '',
          itemTitulo: '',
          dataEmprestimo: "",
          dataDevolucao: "" 
      })

      setMostrarFormulario(true)
    }

   function editarEmprestimo(emprestimo) {
    setEditar(emprestimo.id)

    setFormulario({
      nomeUsuario: emprestimo.nomeUsuario,
      emailUsuario: emprestimo.emailUsuario,
      tipoItem: emprestimo.tipoItem,
      itemTitulo: emprestimo.itemTitulo,
      dataEmprestimo: emprestimo.dataEmprestimo,
      dataDevolucao: emprestimo.dataDevolucao
    })

    setMostrarFormulario(true)
  }

  function salvarEmprestimo(e){
    e.preventDefault()

    if (!formulario.nomeUsuario || !formulario.emailUsuario || !formulario.itemTitulo || !formulario.tipoItem || !formulario.dataDevolucao || !formulario.dataEmprestimo) {
      alert('Preencha todos os campos.')
      return
    }

    if (editar !== null) {
      setEmprestimos(
        emprestimos.map((emp) =>
          emp.id === editar
            ? { ...emp, ...formulario }
            : emp
        )
      )
    } else {
      const novoEmprestimo = {
        id: Date.now(),
        ...formulario,
      }

      setEmprestimos([...emprestimos, novoEmprestimo])
    }

    setFormulario({
      nomeUsuario: '',
      emailUsuario: '',
      tipoItem: '',
      itemTitulo: '',
      dataEmprestimo: "",
      dataDevolucao: "" 
    })

    setEditar(null)
    setMostrarFormulario(false)
  }

  function excluirEmprestimo(id){
    const confirmar = window.confirm('Deseja excluir este empréstimo?')

    if(confirmar){
      setEmprestimos(emprestimos.filter((emprestimo) => emprestimo.id !== id))
    }
  }

  const emprestimosFiltrados = emprestimos.filter((emprestimo) =>
    emprestimo.nomeUsuario.toLowerCase().includes(pesquisa.toLowerCase())
  )

    return(<>
      <div className="content-wrap">
        <div className="gerenciamento-emprestimos">
          {/* Cabeçalho alinhado com Flexbox */}
          <div className="cabecalho-emprestimos">
            <h1>Gerenciamento de Empréstimos <PiHandArrowDownDuotone className="icon"/></h1>
            <p>Cadastre, pesquise, edite ou exclua empréstimos.</p>

            <div className="container-botoes">
              <button type="button" className="botao-novo" onClick={abrirCadastro}>
                <FaPlus/>
              </button>
                
              <button type="button" className="botao-voltar" onClick={() => navigate('/admin')}>
                <IoArrowBack/>
              </button>
            </div>
          </div>

          <div className="barra-pesquisa">
            <input
              type="text"
              placeholder="Pesquisar empréstimo por nome do usuário"
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
            />
          </div>

          {mostrarFormulario && (
            <form className="formulario-emprestimo" onSubmit={salvarEmprestimo}>
              <h2>
                {editar !== null ? 'Editar empréstimo' : 'Novo empréstimo'}
              </h2>

              <div className="campo">
                <input
                  type="text"
                  name="nomeUsuario"
                  value={formulario.nomeUsuario}
                  onChange={handleChange}
                  placeholder="Digite o nome"
                />
              </div>

              <div className="campo">
                <input
                  type="email"
                  name="emailUsuario"
                  value={formulario.emailUsuario}
                  onChange={handleChange}
                  placeholder="Digite o e-mail"
                />
              </div>

              <div className="campo">
                <input
                  type="text"
                  name="tipoItem"
                  value={formulario.tipoItem}
                  onChange={handleChange}
                  placeholder="Livro ou Revista"
                />
              </div>

              <div className="campo">
                <input
                  type="text"
                  name="itemTitulo"
                  value={formulario.itemTitulo}
                  onChange={handleChange}
                  placeholder="Digite o título"
                />
              </div>

              <div className="campo">
                <label>Data de Empréstimo</label>
                <input
                  type="date"
                  name="dataEmprestimo"
                  value={formulario.dataEmprestimo}
                  onChange={handleChange}
                />
              </div>

              <div className="campo">
                <label>Data de Devolução</label>
                <input
                  type="date"
                  name="dataDevolucao"
                  value={formulario.dataDevolucao}
                  onChange={handleChange}
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
                  <th>ID</th>
                  <th>Nome</th>
                  <th>E-mail</th>
                  <th>Tipo de item</th>
                  <th>Título do item</th>
                  <th>Data de Empréstimo</th>
                  <th>Data de Devolução</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {emprestimosFiltrados.length > 0 ? (
                  emprestimosFiltrados.map((emp) => (
                    <tr key={emp.id}>
                      <td>{emp.id}</td>
                      <td>{emp.nomeUsuario}</td>
                      <td>{emp.emailUsuario}</td>
                      <td>{emp.tipoItem}</td>
                      <td>{emp.itemTitulo}</td>
                      <td>{dayjs(emp.dataEmprestimo).format("DD/MM/YYYY")}</td>
                      <td>{dayjs(emp.dataDevolucao).format("DD/MM/YYYY")}</td>
                      <td className="acoes">
                        <button
                          className="botao-editar"
                          onClick={() => editarEmprestimo(emp)}
                        >
                          Editar
                        </button>

                        <button
                          className="botao-excluir"
                          onClick={() => excluirEmprestimo(emp.id)}
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="nenhum-emprestimo">
                      Nenhum empréstimo encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>)
}