import { useState } from "react"
import './GerenciamentoReservas.css'
import { useNavigate } from "react-router"
import { PiHandArrowDownDuotone } from "react-icons/pi"; // icone emprestimos
import { IoArrowBack } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
import dayjs from "dayjs"
import { useEffect } from "react";
import { atualizarReserva, criarReserva, excluirReservaApi, listarReservas } from "../../services/api";
import { CiBookmarkCheck } from "react-icons/ci";
import DialogReservas from "../../components/DialogReservas/DialogReservas";

export default function GerenciamentoReservas(){
    const [pesquisa, setPesquisa] = useState('')
    const [editar, setEditar] = useState(null)
    const [exibirDialog, setExibirDialog] = useState(false)
    const [reservaParaEditar, setReservaParaEditar] = useState(null)
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

    const fetchReservas = async () => {
          try {
            const data = await listarReservas();
            setReservas(data);
          } catch (error) {
            console.error('Erro ao buscar reservas:', error);
          }
        };
    
        useEffect(() => {
          fetchReservas();
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

   async function editarReserva(reserva) {
    setReservaParaEditar(reserva)
    setExibirDialog(true)
    setEditar(reserva.id)
  }

  async function salvarReserva(dados){
    try {
      if (reservaParaEditar) {
        await atualizarReserva(reservaParaEditar.id, dados)
      } else {
        await criarReserva(dados)
      }

      await fetchReservas() // Agora funciona perfeitamente!
      setExibirDialog(false)
      setReservaParaEditar(null)
      alert('Reserva salva com sucesso!')
    }
    catch (error) {
      console.error('Erro ao salvar reserva:', error)
      alert('Erro ao salvar reserva na base de dados.')
    }

    setEditar(null)
  }

  async function excluirReserva(id){
    const confirmar = window.confirm('Deseja excluir esta reserva?')

    if(confirmar){
      try{
          await excluirReservaApi(id)
          setReservas(reservas.filter((reserva) => reserva.id !== id))
          alert('Reserva excluída com sucesso')
          await fetchEmprestimos()
      }
      catch(error){
          console.error('Erro ao excluir a reserva: ', error)
          alert('Não foi possível excluir a reserva')
      }
    }
  }

    return(<>
      <div className="content-wrap">
        <div className="gerenciamento-emprestimos">
          {/* Cabeçalho alinhado com Flexbox */}
          <div className="cabecalho-emprestimos">
            <h1>Gerenciamento de Reservas <CiBookmarkCheck className="icon"/></h1>
            <p>Cadastre, pesquise, edite ou exclua reservas.</p>
            {exibirDialog && (
              <DialogReservas
                reservaParaEditar={reservaParaEditar}
                onSalvar={salvarReserva}
                onCancelar={() => setExibirDialog(false)}
              />
            )}
            <div className="container-botoes">
              <button type="button" className="botao-novo" onClick={()=>{
                setReservaParaEditar(null);
                setExibirDialog(true);
              }}>
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
                      <td>{res.tituloItemAcervo}</td>
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