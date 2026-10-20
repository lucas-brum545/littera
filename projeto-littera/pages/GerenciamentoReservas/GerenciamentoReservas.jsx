import { useMemo, useState } from "react"
import './GerenciamentoReservas.css'
import { useNavigate } from "react-router"
import { PiHandArrowDownDuotone } from "react-icons/pi"; // icone emprestimos
import { IoArrowBack } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import dayjs from "dayjs"
import { useEffect } from "react";
import { atualizarReserva, criarReserva, excluirReservaApi, listarReservas } from "../../services/api";
import { CiBookmarkCheck } from "react-icons/ci";
import DialogReservas from "../../components/DialogReservas/DialogReservas";

export default function GerenciamentoReservas(){
    const [pesquisa, setPesquisa] = useState('')
    const [editar, setEditar] = useState(null)
    const [carregando, setCarregando] = useState(false)
    const [erro, setErro] = useState('')
    const [exibirDialog, setExibirDialog] = useState(false)
    const [reservaParaEditar, setReservaParaEditar] = useState(null)
    const [feedback, setFeedback] = useState({ mensagem: '', tipo: '' })
    const navigate = useNavigate()
    const [reservas, setReservas] = useState([])
    
    const normalizar = (texto) =>
      String(texto ?? '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // remove acentos

    const reservasFiltradas = useMemo(() => {
            const termo = normalizar(pesquisa.trim())
            if (!termo) return reservas
        
            return reservas.filter((u) =>
              [u.id, u.nomeUsuario, u.tituloItemAcervo, u.status].some((campo) =>
                normalizar(campo).includes(termo)
              )
            )
          }, [reservas, pesquisa])
    
    
    function handleChange(e) {
      const { name, value } = e.target

      setFormulario({
        ...formulario,
        [name]: value,
      })
    }


  const fetchReservas = async () => {
    setErro('')
    try {
      setCarregando(true)
      const data = await listarReservas();
      setReservas(data);
    } catch (error) {
      console.error('Erro ao buscar reservas:', error);
      setErro('Erro ao carregar reservas')
    }
    finally{
      setCarregando(false)
    }
  };

  useEffect(() => {
    fetchReservas();
  }, []);

  if (carregando && reservas.length === 0) return <p className='aviso-tela'>Carregando reservas...</p>
  if (erro) return <p className='aviso-tela'>{erro}</p>


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
      setFeedback({ mensagem: 'Reserva cadastrada com sucesso!', tipo: 'success' })
    }
    catch (error) {
      console.error('Erro ao salvar reserva:', error)
      const mensagemErro = error.response?.data?.message || 'Erro ao salvar reserva.';
      alert(mensagemErro)
    }

    setEditar(null)
  }

  async function excluirReserva(id) {
    const confirmar = window.confirm('Deseja excluir esta reserva?')

    if (confirmar) {
      try {
        await excluirReservaApi(id)
        setReservas((atuais) => atuais.filter((reserva) => reserva.id !== id))
        setFeedback({ mensagem: 'Reserva excluída com sucesso!', tipo: 'success' })
      } catch (error) {
        const mensagemErro = error.response?.data?.message || 'Erro ao excluir reserva.';
        setFeedback({mensagem:'', tipo:''})
        alert(mensagemErro)
      }
    }
  }

    return(<>
      <div className="content-wrap">
        {feedback.mensagem && (
        <div style={{ marginBottom: '20px' }}>
          <Alert
            variant='filled'
            severity={feedback.tipo}
            icon={feedback.tipo === 'success' ? <CheckIcon fontSize="inherit" /> : undefined}
          >
            {feedback.mensagem}
          </Alert>
        </div>)}
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
              placeholder="Pesquisar empréstimo por nome do usuário, título do item ou status"
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