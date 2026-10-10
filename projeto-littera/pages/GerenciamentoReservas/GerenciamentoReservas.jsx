import { useState } from "react"
import './GerenciamentoReservas.css'
import { useNavigate } from "react-router"
import { PiHandArrowDownDuotone } from "react-icons/pi"; // icone emprestimos
import { IoArrowBack } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
import dayjs from "dayjs"
import { useEffect } from "react";
import { listarReservas } from "../../services/api";
import { CiBookmarkCheck } from "react-icons/ci";

export default function GerenciamentoReservas(){
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
    const navigate = useNavigate()
    const [reservas, setReservas] = useState([])
    
    const reservasFiltradas = reservas.filter((reserva) =>
    reserva.nomeUsuario.toLowerCase().includes(pesquisa.toLowerCase())
    )
    
    
    function handleChange(e) {
      const { name, value } = e.target

      setFormulario({
        ...formulario,
        [name]: value,
      })
    }

    useEffect(() => {
      const fetchReservas = async () => {
        try {
          const data = await listarReservas();
          setReservas(data);
        } catch (error) {
          console.error('Erro ao buscar reservas:', error);
        }
      }
      fetchReservas()
      }, []);


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

   function editarReserva(reserva) {
    setEditar(reserva.id)

    setFormulario({
      nomeUsuario: reserva.nomeUsuario,
      emailUsuario: reserva.emailUsuario,
      tipoItem: reserva.tipoItem,
      itemTitulo: reserva.itemTitulo,
      dataEmprestimo: reserva.dataEmprestimo,
      dataDevolucao: reserva.dataDevolucao
    })

    setMostrarFormulario(true)
  }

  function salvarReserva(e){
    e.preventDefault()

    if (!formulario.nomeUsuario || !formulario.emailUsuario || !formulario.itemTitulo || !formulario.tipoItem || !formulario.dataDevolucao || !formulario.dataEmprestimo) {
      alert('Preencha todos os campos.')
      return
    }

    if (editar !== null) {
      setReservas(
        reservas.map((res) =>
          res.id === editar
            ? { ...res, ...formulario }
            : res
        )
      )
    } else {
      const novaReserva = {
        id: Date.now(),
        ...formulario,
      }

      setReservas([...reservas, novaReserva])
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

  function excluirReserva(id){
    const confirmar = window.confirm('Deseja excluir esta reserva?')

    if(confirmar){
      setReservas(reservas.filter((reserva) => reserva.id !== id))
    }
  }

    return(<>
      <div className="content-wrap">
        <div className="gerenciamento-emprestimos">
          {/* Cabeçalho alinhado com Flexbox */}
          <div className="cabecalho-emprestimos">
            <h1>Gerenciamento de Reservas <CiBookmarkCheck className="icon"/></h1>
            <p>Cadastre, pesquise, edite ou exclua reservas.</p>

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
                  <th>Código</th>
                  <th>Nome usuário</th>
                  <th>Título do item</th>
                  <th>Data de Reserva</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {reservasFiltradas.length > 0 ? (
                  reservasFiltradas.map((res) => (
                    <tr key={res.id}>
                      <td>{res.id}</td>
                      <td>{res.nomeUsuario}</td>
                      <td>{res.tituloItem}</td>
                      <td>{dayjs(res.dataReserva).format("DD/MM/YYYY")}</td>
                      <td>{res.status}</td>
                      <td className="acoes">
                        <button
                          className="botao-editar"
                          onClick={() => editarReserva(res)}
                        >
                          Editar
                        </button>

                        <button
                          className="botao-excluir"
                          onClick={() => excluirReserva(res.id)}
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