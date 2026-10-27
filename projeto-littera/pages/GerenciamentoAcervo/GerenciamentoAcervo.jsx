import { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { IoPeople } from "react-icons/io5";
import { IoArrowBack } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
import './GerenciamentoAcervo.css'
import { atualizarItemAcervo, criarItemAcervo, excluirItemAcervo, listarItensAcervo } from '../../services/api'
import { ImBooks } from 'react-icons/im';

function GerenciamentoAcervo() {
  const navigate = useNavigate();
  const [itensAcervo, setItensAcervo] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [exibirDialog, setExibirDialog] = useState(false)
  const [erro, setErro] = useState('')
  const [itemParaEditar, setItemParaEditar] = useState(null)
  const [pesquisa, setPesquisa] = useState('')
  const [feedback, setFeedback] = useState({ mensagem: '', tipo: '' })

  // const usuariosFiltrados = usuarios.filter((usuario) =>
  //   usuario.nome.toLowerCase().includes(pesquisa.toLowerCase())
  // )

  useEffect(() => {
    const fetchItensAcervo = async () => {
      try {
        const data = await listarItensAcervo();
        setItensAcervo(data);
      } catch (error) {
        console.error('Erro ao buscar itens do acervo:', error);
        setErro('Erro ao buscar itens do acervo.');
      }
    };

    fetchItensAcervo();
  }, []);

  
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

  async function salvarItemAcervo(dados) {
     try {
          if (itemParaEditar) {
            await atualizarItemAcervo(itemParaEditar.id, dados);
          } else {
            await criarItemAcervo(dados);
          }
    
          await fetchItensAcervo();
          setExibirDialog(false);
          setItemParaEditar(null);
          setFeedback({ mensagem: 'Item do acervo salvo com sucesso!', tipo: 'success' })
    
        } catch (error) {
          const mensagemErro = error.response.data.message || 'Erro ao salvar item no acervo.';
          alert(mensagemErro)
        }
  }

  async function excluirItemAcervo(id) {
      const confirmar = window.confirm(`Tem certeza que deseja excluir este item do acervo? ID: ${id}`)
  
      if (confirmar) {
        try {
          await excluirItemAcervo(id)
          setItensAcervo(itensAcervo.filter((item) => item.id !== id))
          setFeedback({ mensagem: 'Item excluído do acervo com sucesso!', tipo: 'success' })
        } catch (error) {
          console.error('Erro ao excluir item do acervo:', error)
          const mensagemErro = error.response?.data?.message || 'Erro ao item do acervo.';
          setFeedback({ mensagem: mensagemErro, tipo: 'error' })
        }
      }
    }

  
  return (
    <div className="content-wrap">
    <div className="gerenciamento-usuarios">
      <div className="cabecalho-usuarios">
          <h1>Gerenciamento de Acervo <ImBooks className='icon'/></h1>
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

      {/* {exibirDialog && } */}

      {/* {mostrarFormulario && (
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
      )} */}

      {/* <h1>Revistas</h1>
      <br />
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
      <br />
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
      
      <br /> */}
    </div>
    </div>
  )
}

export default GerenciamentoAcervo