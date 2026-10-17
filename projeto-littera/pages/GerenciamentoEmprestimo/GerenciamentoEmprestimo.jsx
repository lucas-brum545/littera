import { useState, useEffect } from "react"
import './GerenciamentoEmprestimo.css'
import { useNavigate } from "react-router"
import { PiHandArrowDownDuotone } from "react-icons/pi";
import { IoArrowBack } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
import dayjs from "dayjs"
import { atualizarEmprestimo, criarEmprestimo, excluirEmprestimoApi, listarEmprestimos } from "../../services/api";
import DialogEmprestimos from "../../components/DialogEmprestimos/DialogEmprestimos";

export default function GerenciamentoEmprestimo(){
    const [pesquisa, setPesquisa] = useState('')
    const [mostrarFormulario, setMostrarFormulario] = useState(false)
    const [editar, setEditar] = useState(null)
    const [formulario, setFormulario] = useState([])
    const [emprestimos, setEmprestimos] = useState([])
    const [exibirDialog, setExibirDialog] = useState(false)
    const [emprestimoParaEditar, setEmprestimoParaEditar] = useState(null)
    const navigate = useNavigate()
    
    // Função declarada no escopo principal para poder ser reutilizada
    const fetchEmprestimos = async () => {
      try {
        const data = await listarEmprestimos();
        setEmprestimos(data);
      } catch (error) {
        console.error('Erro ao buscar empréstimos:', error);
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
            alert('Empréstimo salvo com sucesso!')
          }
       catch (error) {
          console.error('Erro ao salvar empréstimo:', error)
          alert('Erro ao salvar empréstimo na base de dados.')
        }

      setEditar(null)
      setMostrarFormulario(false)
    }

    async function excluirEmprestimo(codigo){
      const confirmar = window.confirm('Deseja excluir este empréstimo?')

      if(confirmar){
        try{
          await excluirEmprestimoApi(codigo)
          setEmprestimos(emprestimos.filter((emprestimo) => emprestimo.codigo !== codigo))
          alert('Empréstimo excluído com sucesso')
          await fetchEmprestimos()
        }
        catch(error){
          console.error('Erro ao excluir o empréstimo: ', error)
          alert('Não foi possível excluir o empréstimo')
        }
      }
    }

    return(<>
      <div className="content-wrap">
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
                  <th>Data de Empréstimo</th>
                  <th>Data de Devolução</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {emprestimos.length === 0 ? (
                  <tr>
                    <td colSpan="6">Nenhum empréstimo encontrado.</td>
                  </tr>
                ) : (
                  emprestimos.map((emp) => (
                    <tr key={emp.codigo}>
                      <td>{emp.codigo}</td>
                      <td>{emp.nomeUsuario}</td>
                      <td>{emp.tituloItemAcervo}</td>
                      <td>{emp.dataEmprestimo ? dayjs(emp.dataEmprestimo).format("DD/MM/YYYY") : ''}</td>
                      <td>{emp.dataDevolucao ? dayjs(emp.dataDevolucao).format("DD/MM/YYYY") : ''}</td>
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>)
}