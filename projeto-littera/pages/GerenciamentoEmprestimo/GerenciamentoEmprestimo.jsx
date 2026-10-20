import { useState, useEffect, useMemo } from "react"
import './GerenciamentoEmprestimo.css'
import { useNavigate } from "react-router"
import { PiHandArrowDownDuotone } from "react-icons/pi";
import { IoArrowBack } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import dayjs from "dayjs"
import { atualizarEmprestimo, criarEmprestimo, excluirEmprestimoApi, listarEmprestimos } from "../../services/api";
import DialogEmprestimos from "../../components/DialogEmprestimos/DialogEmprestimos";

export default function GerenciamentoEmprestimo(){
    const [pesquisa, setPesquisa] = useState('')
    const [editar, setEditar] = useState(null)
    const [erro, setErro] = useState("")
    const [carregando, setCarregando] = useState(false)
    const [formulario, setFormulario] = useState([])
    const [emprestimos, setEmprestimos] = useState([])
    const [exibirDialog, setExibirDialog] = useState(false)
    const [emprestimoParaEditar, setEmprestimoParaEditar] = useState(null)
    const [feedback, setFeedback] = useState({ mensagem: '', tipo: '' })
    const navigate = useNavigate()

    const normalizar = (texto) =>
      String(texto ?? '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // remove acentos

    const emprestimosFiltrados = useMemo(() => {
        const termo = normalizar(pesquisa.trim())
        if (!termo) return emprestimos
    
        return emprestimos.filter((u) =>
          [u.codigo, u.nomeUsuario, u.tituloItemAcervo].some((campo) =>
            normalizar(campo).includes(termo)
          )
        )
      }, [emprestimos, pesquisa])
    
    // Função declarada no escopo principal para poder ser reutilizada
    const fetchEmprestimos = async () => {
      setErro('')
      try {
        setCarregando(true)
        const data = await listarEmprestimos();
        setEmprestimos(data);
      } catch (error) {
        console.error('Erro ao buscar empréstimos:', error);
        setErro('Erro ao buscar empréstimos')
      }
      finally{
        setCarregando(false)
      }
    };

    useEffect(() => {
      fetchEmprestimos();
    }, []);

    function handleChange(e) {
      const { name, value } = e.target
      setFormulario({
        ...formulario,
        [name]: value,
      })
    }

    if (carregando && emprestimos.length === 0) return <p className='aviso-tela'>Carregando empréstimos...</p>
    if (erro) return <p className='aviso-tela'>{erro}</p>

   
    async function abrirEdicao(emprestimo){
      setEmprestimoParaEditar(emprestimo)
      setExibirDialog(true)
    }

    async function salvarEmprestimo(dadosDoFormulario){
       try {
            if (emprestimoParaEditar) {
              await atualizarEmprestimo(emprestimoParaEditar.codigo, dadosDoFormulario)
            } else {
              await criarEmprestimo(dadosDoFormulario)
            }
      
            await fetchEmprestimos() // Agora funciona perfeitamente!
            setExibirDialog(false)
            setEmprestimoParaEditar(null)
            setFeedback({ mensagem: 'Empréstimo salvo com sucesso!', tipo: 'success' })
          }
       catch (error) {
          console.error('Erro ao salvar empréstimo:', error)
          const mensagemErro = error.response?.data?.message || 'Erro ao salvar empréstimo.';
          setFeedback({ mensagem: mensagemErro, tipo: 'error' })
        }

      setEditar(null)
    }

    async function excluirEmprestimo(codigo){
      const confirmar = window.confirm('Deseja excluir este empréstimo?')

      if(confirmar){
        try{
          await excluirEmprestimoApi(codigo)
          setEmprestimos(emprestimos.filter((emprestimo) => emprestimo.codigo !== codigo))
          setFeedback({ mensagem: 'Empréstimo excluído com sucesso!', tipo: 'success' })
          await fetchEmprestimos()
        }
        catch(error){
          console.error('Erro ao excluir o empréstimo: ', error)
          const mensagemErro = error.response?.data?.message || 'Erro ao excluir empréstimo.';
          alert(mensagemErro)
        }
      }
    }

    setTimeout(() => {
    setFeedback({ mensagem: '', tipo: '' });
    }, 10000);

    return(<>
      <div className="content-wrap">
        {feedback.mensagem &&  (
        <div style={{ marginBottom: '20px' }}>
          <Alert
            variant='filled'
            severity={feedback.tipo}
            icon={feedback.tipo === 'success' ? <CheckIcon fontSize="inherit" /> : undefined}
          >
            {feedback.mensagem}
          </Alert>
        </div>
      )}
        <div className="gerenciamento-emprestimos">
          <div className="cabecalho-emprestimos">
            <h1>Gerenciamento de Empréstimos <PiHandArrowDownDuotone className="icon"/></h1>
            <p>Cadastre, pesquise, edite ou exclua empréstimos.</p>
            
            {exibirDialog &&
              <DialogEmprestimos
                emprestimoParaEditar={emprestimoParaEditar}
                onCancelar={() => setExibirDialog(false)}
                onSalvar={salvarEmprestimo} 
              />
            }

            <div className="container-botoes">
              <button className="botao-novo" onClick={() => {
                setEmprestimoParaEditar(null)
                setExibirDialog(true)
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
              placeholder="Pesquisar empréstimo por nome do usuário, código ou título do item"
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
                  <th>Data de Empréstimo</th>
                  <th>Data de Devolução Prevista</th>
                  <th>Data de Devolução Real</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>

                {emprestimosFiltrados.length > 0 ? 
                  (emprestimosFiltrados.map((emp) => (
                    <tr key={emp.codigo}>
                      <td>{emp.codigo}</td>
                      <td>{emp.nomeUsuario}</td>
                      <td>{emp.tituloItemAcervo}</td>
                      <td>{emp.dataEmprestimo ? dayjs(emp.dataEmprestimo).format("DD/MM/YYYY") : ''}</td>
                      <td>{emp.dataDevolucaoPrevista ? dayjs(emp.dataDevolucaoPrevista).format("DD/MM/YYYY") : ''}</td>
                      <td>{emp.dataDevolucaoReal ? dayjs(emp.dataDevolucaoReal).format("DD/MM/YYYY") : '-'}</td>
                      <td className="acoes">
                        <button className="botao-editar" onClick={() => abrirEdicao(emp)}>
                          Editar
                        </button>
                        <button
                          className="botao-excluir"
                          onClick={() => excluirEmprestimo(emp.codigo)}
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                ))) : (
                    <tr><td colSpan="6">Nenhum empréstimo encontrado.</td></tr>
                )}
                {/* // ) : (
                //   emprestimos.map((emp) => (
                //     <tr key={emp.codigo}>
                //       <td>{emp.codigo}</td>
                //       <td>{emp.nomeUsuario}</td>
                //       <td>{emp.tituloItemAcervo}</td>
                //       <td>{emp.dataEmprestimo ? dayjs(emp.dataEmprestimo).format("DD/MM/YYYY") : ''}</td>
                //       <td>{emp.dataDevolucao ? dayjs(emp.dataDevolucao).format("DD/MM/YYYY") : ''}</td>
                //       <td className="acoes">
                //         <button className="botao-editar" onClick={() => abrirEdicao(emp)}>
                //           Editar
                //         </button>

                //         <button
                //           className="botao-excluir"
                //           onClick={() => excluirEmprestimo(emp.codigo)}
                //         >
                //           Excluir
                //         </button>
                //       </td>
                //     </tr>
                //   ))
                // ) */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>)
}