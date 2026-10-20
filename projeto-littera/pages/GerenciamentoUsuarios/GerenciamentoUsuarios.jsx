import { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { IoPeople } from "react-icons/io5";
import { IoArrowBack } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
import './GerenciamentoUsuarios.css'
import {listarUsuarios} from '../../services/api'

function GerenciamentoUsuarios() {
  const navigate = useNavigate();
  // usuarios agora vao vir de uma api
  const [usuarios, setUsuarios] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')


  useEffect(() => {
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

    fetchUsuarios();
  }, []);

  const [pesquisa, setPesquisa] = useState('')
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [editando, setEditando] = useState(null)

  const [formulario, setFormulario] = useState({
    nome: '',
    email: '',
    telefone: '',
  })

  if(carregando) return <p className='aviso-tela'>Carregando usuários...</p>
  if(erro) return <p className='aviso-tela'>{erro}</p>


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

  function editarUsuario(usuario) {
    setEditando(usuario.id)

    setFormulario({
      nome: usuario.nome,
      email: usuario.email,
      telefone: usuario.telefone,
    })

    setMostrarFormulario(true)
  }

  function salvarUsuario(e) {
    e.preventDefault()

    if (!formulario.nome || !formulario.email || !formulario.telefone) {
      alert('Preencha todos os campos.')
      return
    }

    if (editando !== null) {
      setUsuarios(
        usuarios.map((usuario) =>
          usuario.id === editando
            ? { ...usuario, ...formulario }
            : usuario
        )
      )
    } else {
      const novoUsuario = {
        id: Date.now(),
        ...formulario,
      }

      setUsuarios([...usuarios, novoUsuario])
    }

    setFormulario({
      nome: '',
      email: '',
      telefone: '',
    })

    setEditando(null)
    setMostrarFormulario(false)
  }

  function excluirUsuario(id) {
    const confirmar = window.confirm(
      'Tem certeza que deseja excluir este usuário?'
    )

    if (confirmar) {
      setUsuarios(usuarios.filter((usuario) => usuario.id !== id))
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

        <div className="container-botoes">
          <button className="botao-novo" onClick={abrirCadastro}>
            <FaPlus className='icon'/>
          </button>

          <button type="button" className="botao-voltar" onClick={()=>navigate('/admin')}>
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

      {mostrarFormulario && (
        <div className="formulario-usuario-wrapper">
        <form className="formulario-usuario" onSubmit={salvarUsuario}>
          <h2>
            {editando !== null ? 'Editar usuário' : 'Novo usuário'}
          </h2>
          <div className="campo">
            <input
              type="text"
              name="nome"
              value={formulario.nome}
              onChange={handleChange}
              placeholder="Digite o nome"
            />
          </div>
          <div className="campo">
            <input
              type="email"
              name="email"
              value={formulario.email}
              onChange={handleChange}
              placeholder="Digite o e-mail"
            />
          </div>

          <div className="campo">
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
        </div>
      )}

      <div className="tabela-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Telefone</th>
              <th>Quantidade Emprestada</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {usuariosFiltrados.length > 0 ? (
              usuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td>{usuario.id}</td>
                  <td>{usuario.nome}</td>
                  <td>{usuario.email}</td>
                  <td>{usuario.telefone}</td>
                  <td>{usuario.quantidadeEmprestada}</td>
                  <td className="acoes">
                    <button
                      className="botao-editar"
                      onClick={() => editarUsuario(usuario)}
                    >
                      Editar
                    </button>

                    <button
                      className="botao-excluir"
                      onClick={() => excluirUsuario(usuario.id)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="nenhum-usuario">
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