import { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { IoPeople } from "react-icons/io5";
import { IoArrowBack } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
import './GerenciamentoAcervo.css'
import {listarLivros} from '../../services/api'
import {listarRevistas} from '../../services/api'

function GerenciamentoAcervo() {
  const navigate = useNavigate();
  // itens do acervo (livros e revistas) agora vao vir de uma api
  const [livros, setLivros] = useState([])
  const [revistas, setRevistas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  // const usuariosFiltrados = usuarios.filter((usuario) =>
  //   usuario.nome.toLowerCase().includes(pesquisa.toLowerCase())
  // )



  useEffect(() => {
    const fetchItensAcervo = async () => {
      try {
        const data = await listarLivros();
        setLivros(data);
      } catch (error) {
        console.error('Erro ao buscar livros:', error);
        setErro('Erro ao buscar livros.');
      }
    };

    fetchItensAcervo();
  }, []);

  useEffect(() => {
    const fetchRevistas = async () => {
      try {
        const data = await listarRevistas();
        setRevistas(data);
      } catch (error) {
        console.error('Erro ao buscar revistas:', error);
        setErro('Erro ao buscar revistas.');
      }
    };

    fetchRevistas();
  }, []);

  const [pesquisa, setPesquisa] = useState('')
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [editando, setEditando] = useState(null)

  const [formulario, setFormulario] = useState({
    nome: '',
    email: '',
    telefone: '',
  })

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

  function editarItemAcervo(itemAcervo) {
    setEditando(itemAcervo.id)

    setFormulario({
      nome: itemAcervo.nome,
      email: itemAcervo.email,
      telefone: itemAcervo.telefone,
    })

    setMostrarFormulario(true)
  }

  function salvarItemAcervo(e) {
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

  
  return (
    <div className="content-wrap">
    <div className="gerenciamento-usuarios">
      <div className="cabecalho-usuarios">
          <h1>Gerenciamento de Acervo <IoPeople className='icon'/></h1>
          <p>Cadastre, pesquise, edite ou exclua itens do acervo.</p>

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
          placeholder="Pesquisar livro pelo nome"
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

      <h1>Revistas</h1>
      <div className="tabela-container">
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Título</th>
              <th>Ano</th>
              <th>Disponível</th>
              <th>Tipo</th>
              <th>Edição</th>
              <th>ISSN</th>
              <th>Mes/Ano Publicação</th>
              <th>Localização</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {revistas.map((revista) => (
              <tr key={revista.codigo}>
                <td>{revista.codigo}</td>
                <td>{revista.titulo}</td>
                <td>{revista.ano}</td>
                <td>{revista.disponivel ? 'Sim' : 'Não'}</td>
                <td>{revista.tipoItemAcervo}</td>
                <td>{revista.edicao}</td>
                <td>{revista.issn}</td>
                <td>{revista.mesAnoPublicacao}</td>
                <td>{revista.localizacao}</td>
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
            ))}
          </tbody>
        </table>
      </div>

      <h1>Livros</h1>
      <br />

      <div className="tabela-container">
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Título</th>
              <th>Autor</th>
              <th>Ano</th>
              <th>Disponível</th>
              <th>Tipo</th>
              <th>Localização</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
              {livros.map((livro) => (
                <tr key={livro.codigo}>
                  <td>{livro.codigo}</td>
                  <td>{livro.titulo}</td>
                  <td>{livro.autor}</td>
                  <td>{livro.ano}</td>
                  <td>{livro.disponivel ? 'Sim' : 'Não'}</td>
                  <td>{livro.tipo}</td>
                  <td>{livro.localizacao}</td>
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
            }
          </tbody>
        </table>
      </div>
      <br />
      
      <br />
    </div>
    </div>
  )
}

export default GerenciamentoAcervo