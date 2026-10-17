import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { IoPeople, IoArrowBack } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
import dayjs from "dayjs"
import './GerenciamentoUsuarios.css'
import { listarUsuarios, criarUsuario, atualizarUsuario, excluirUsuarioApi } from '../../services/api'
import DialogUsuarios from '../../components/DialogUsuarios/DialogUsuarios'

function GerenciamentoUsuarios() {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([])
  const [usuarioParaExcluir, setUsuarioParaExcluir] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [exibirDialog, setExibirDialog] = useState(false)
  const [usuarioParaEditar, setUsuarioParaEditar] = useState(null)

  const fetchUsuarios = async () => {
    try {
      setCarregando(true);
      const data = await listarUsuarios();
      setUsuarios(data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      setErro('Erro ao buscar usuários.');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const [pesquisa, setPesquisa] = useState('')
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [editando, setEditando] = useState(null)

  const [formulario, setFormulario] = useState({
    nome: '',
    email: '',
    telefone: '',
    dataNascimento: '',
    senha: '',
  })

  if (carregando) return <p className='aviso-tela'>Carregando usuários...</p>
  if (erro) return <p className='aviso-tela'>{erro}</p>

  function handleChange(e) {
    const { name, value } = e.target
    setFormulario({
      ...formulario,
      [name]: value,
    })
  }

  async function abrirEdicao(usuario) {
    setUsuarioParaEditar(usuario)
    setExibirDialog(true)
  }

  async function salvarUsuario(e) {
    // 1. Evita o recarregamento padrão da página e captura o evento
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }

    // 2. Certifique-se de que está a enviar o objeto com os dados do estado (formulario), 
    // e nunca o objeto 'e' do evento!
    try {
      if (usuarioParaEditar) {
        await atualizarUsuario(usuarioParaEditar.id, formulario);
      } else {
        await criarUsuario(formulario);
      }

      await fetchUsuarios();
      setExibirDialog(false);
      setUsuarioParaEditar(null);
      alert('Usuário salvo com sucesso!');
    } catch (error) {
      console.error('Detalhes do erro ao salvar usuário:', error);
      alert('Erro ao salvar usuário na base de dados.');
    }
  }

  async function excluirUsuario(id) {
    const confirmar = window.confirm('Tem certeza que deseja excluir este usuário? ID: ', id)

    if (confirmar) {
      try {
        await excluirUsuarioApi(id)
        setUsuarios(usuarios.filter((usuario) => usuario.id !== id))
        alert('Usuário excluído com sucesso')
        await fetchEmprestimos()
      } catch (error) {
        console.error('Erro ao excluir usuário:', error)
        alert('Não foi possível excluir o usuário.')
      }
    }
  }

  const usuariosFiltrados = usuarios.filter((usuario) =>
    usuario.nome.toLowerCase().includes(pesquisa.toLowerCase())
  )

  return (
    <div className="content-wrap">
      <div className="gerenciamento-usuarios">
        <div className="cabecalho-usuarios">
          <h1>Gerenciamento de Usuários <IoPeople className='icon'/></h1>
          <p>Cadastre, pesquise, edite ou exclua usuários.</p>
          
          {exibirDialog && (
            <DialogUsuarios
              usuarioParaEditar={usuarioParaEditar}
              onCancelar={() => setExibirDialog(false)}
              onSalvar={salvarUsuario}
            />
          )}

          <div className="container-botoes">
            <button className="botao-novo" onClick={() => {
              setUsuarioParaEditar(null)
              setExibirDialog(true)
            }}>
              <FaPlus className='icon'/>
            </button>
            <button type="button" className="botao-voltar" onClick={() => navigate('/admin')}>
              <IoArrowBack className='icon'/>
            </button>
          </div>
        </div>

        <div className="barra-pesquisa">
          <input
            type="text"
            placeholder="Pesquisar usuário pelo nome"
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
          />
        </div>

        <div className="tabela-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Telefone</th>
                <th>Data de Nascimento</th>
                <th>Tipo de Usuário</th>
                <th>Quantidade Emprestada</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.length > 0 ? (
                usuariosFiltrados.map((usuario) => (
                  <tr key={usuario.id}>
                    <td>{usuario.id}</td>
                    <td>{usuario.nome}</td>
                    <td>{usuario.email}</td>
                    <td>{usuario.telefone}</td>
                    <td>{usuario.dataNascimento ? dayjs(usuario.dataNascimento).format('DD/MM/YYYY') : '-'}</td>
                    <td>{usuario.tipoUsuario}</td>
                    <td>{usuario.quantidadeEmprestada}</td>
                    <td className="acoes">
                      <button className="botao-editar" onClick={() => abrirEdicao(usuario)}>
                        Editar
                      </button>
                      <button className="botao-excluir" onClick={() => excluirUsuario(usuario.id)}>
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="nenhum-usuario">
                    Nenhum usuário encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default GerenciamentoUsuarios