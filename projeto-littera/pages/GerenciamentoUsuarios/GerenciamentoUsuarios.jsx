import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router'
import { IoPeople, IoArrowBack } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
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
  const [pesquisa, setPesquisa] = useState('')
  const [feedback, setFeedback] = useState({ mensagem: '', tipo: '' })

  const normalizar = (texto) =>
    String(texto ?? '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // remove acentos

  // dentro do componente:
  const usuariosFiltrados = useMemo(() => {
    const termo = normalizar(pesquisa.trim())
    if (!termo) return usuarios

    return usuarios.filter((u) =>
      [u.id, u.nome, u.tipoUsuario].some((campo) =>
        normalizar(campo).includes(termo)
      )
    )
  }, [usuarios, pesquisa])

  const fetchUsuarios = async () => {
    setErro('')
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

  if (carregando && usuarios.length === 0) return <p className='aviso-tela'>Carregando usuários...</p>
  if (erro) return <p className='aviso-tela'>{erro}</p>

  async function abrirEdicao(usuario) {
    setUsuarioParaEditar(usuario)
    setExibirDialog(true)
  }

  // funciona tanto para edicao quanto para adicao
  async function salvarUsuario(dados) {
  try {
    if (usuarioParaEditar) {
      await atualizarUsuario(usuarioParaEditar.id, dados);
    } else {
      await criarUsuario(dados);
    }

    await fetchUsuarios();
    setExibirDialog(false);
    setUsuarioParaEditar(null);
    setFeedback({ mensagem: 'Usuário salvo com sucesso!', tipo: 'success' })

  } catch (error) {
    console.error('Detalhes do erro ao salvar usuário:', error);
    const mensagemErro = error.response?.data?.message || 'Erro ao salvar usuário.';
    alert(mensagemErro)
  }
}

  setTimeout(() => {
    setFeedback({ mensagem: '', tipo: '' });
  }, 10000);

  async function excluirUsuario(id) {
    const confirmar = window.confirm(`Tem certeza que deseja excluir este usuário? ID: ${id}`)

    if (confirmar) {
      try {
        await excluirUsuarioApi(id)
        setUsuarios(usuarios.filter((usuario) => usuario.id !== id))
        setFeedback({ mensagem: 'Usuário excluído com sucesso!', tipo: 'success' })
      } catch (error) {
        console.error('Erro ao excluir usuário:', error)
        const mensagemErro = error.response?.data?.message || 'Erro ao excluir usuário.';
        setFeedback({ mensagem: mensagemErro, tipo: 'error' })
      }
    }
  }

  return (
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
        </div>
      )}
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
            placeholder="Pesquisar usuário pelo nome ou tipo de usuário"
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
                <th>Bloqueado para Empréstimo</th>
                <th>Data Fim Bloqueio</th>
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
                    <td>{usuario.bloqueado ? 'SIM' : 'NÃO'}</td>
                    <td>{usuario?.dataFimBloqueio 
      ? dayjs(usuario.dataFimBloqueio).format('DD/MM/YYYY') 
      : '-'}</td>
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