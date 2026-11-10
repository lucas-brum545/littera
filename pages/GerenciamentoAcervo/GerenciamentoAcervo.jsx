import { useState, useEffect } from "react";
import DialogAcervo from '../../components/DialogAcervo/DialogAcervo'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { ImBooks } from 'react-icons/im';
import './GerenciamentoAcervo.css';
import { Alert, CircularProgress } from "@mui/material";
import {
  atualizarItemAcervo,
  criarItemAcervo,
  excluirItemAcervo,
  listarItensAcervo,
} from '../../services/api';

// Minúsculas e sem acentos, e não quebra com valores nulos
const normalizar = (texto) =>
  String(texto ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

function formatarDataHora(valor) {
  if (!valor) return "Não registrado";

  // Datas no formato YYYY-MM-DD são lidas em UTC para não recuar um dia por causa do fuso
  let data;
  if (typeof valor === "string" && /^\d{4}-\d{2}-\d{2}$/.test(valor)) {
    const [ano, mes, dia] = valor.split("-").map(Number);
    data = new Date(Date.UTC(ano, mes - 1, dia));
  } else {
    data = new Date(valor);
  }

  if (Number.isNaN(data.getTime())) return "Data inválida";

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeZone: "UTC",
  }).format(data);
}

function GerenciamentoAcervo() {
  const [itensAcervo, setItensAcervo] = useState([]);
  const [exibirDialog, setExibirDialog] = useState(false);
  const [itemParaEditar, setItemParaEditar] = useState(null);
  const [bancoCarregado, setBancoCarregado] = useState(false);
  const [erro, setErro] = useState('');
  const [feedback, setFeedback] = useState({ mensagem: '', tipo: '' });

  // Pesquisas independentes por tabela
  const [pesquisaLivro, setPesquisaLivro] = useState("");
  const [pesquisaRevista, setPesquisaRevista] = useState("");

  useEffect(() => {
    fetchItensAcervo();
  }, []);

  // Some com a mensagem de feedback depois de 10 segundos.
  // (Antes o setTimeout ficava solto no corpo do componente e era recriado a cada renderização.)
  useEffect(() => {
    if (!feedback.mensagem) return;
    const temporizador = setTimeout(() => setFeedback({ mensagem: '', tipo: '' }), 10000);
    return () => clearTimeout(temporizador);
  }, [feedback]);

  async function fetchItensAcervo() {
    try {
      setErro('');
      const dados = await listarItensAcervo();

      const itens = dados.map((item) => ({
        ...item,
        ano: item.ano ?? "",
        totalDisponivel: item.totalDisponivel ?? 1,
        totalEmprestados: item.totalEmprestados ?? 0,
        capa: item.capa ?? "",
        descricao: item.descricao ?? "",
        idioma: item.idioma ?? "",
        autor: item.autor ?? "",
        isbn: item.isbn ?? "",
        genero: item.genero ?? "",
        edicao: item.edicao ?? "",
        issn: item.issn ?? "",
        mesAnoPublicacao: item.mesAnoPublicacao ?? "",
      }));

      setItensAcervo(itens);
    } catch (error) {
      console.error("Erro ao carregar acervo:", error);
      setErro(error.message || 'Não foi possível carregar o acervo do servidor.');
    } finally {
      setBancoCarregado(true);
    }
  }

  // Filtragens independentes para as tabelas de Livros e Revistas
  const livrosFiltrados = itensAcervo
    .filter((item) => item.tipo === "LIVRO")
    .filter((livro) => {
      const termo = normalizar(pesquisaLivro);
      return [livro.titulo, livro.autor, livro.genero, livro.idioma]
        .some((campo) => normalizar(campo).includes(termo));
    });

  const revistasFiltradas = itensAcervo
    .filter((item) => item.tipo === "REVISTA")
    .filter((revista) => normalizar(revista.titulo).includes(normalizar(pesquisaRevista)));

  function abrirEdicao(item) {
    setItemParaEditar(item);
    setExibirDialog(true);
  }

  async function salvarItemAcervo(dados) {
    try {
      if (itemParaEditar) {
        await atualizarItemAcervo(itemParaEditar.codigo, dados);
      } else {
        await criarItemAcervo(dados);
      }

      await fetchItensAcervo();
      setExibirDialog(false);
      setItemParaEditar(null);
      setFeedback({ mensagem: 'Item do acervo salvo com sucesso!', tipo: 'success' });
    } catch (error) {
      console.error("Erro ao salvar item do acervo:", error);
      // alert porque o feedback da página fica atrás do dialog aberto.
      // error.message já traz o texto do backend (interceptor do services/api).
      alert(error.message || 'Erro ao salvar item no acervo.');
    }
  }

  async function excluirItem(codigo) {
    const confirmar = window.confirm(`Tem certeza que deseja excluir este item do acervo? Código: ${codigo}`);
    if (!confirmar) return;

    try {
      await excluirItemAcervo(codigo);
      setItensAcervo((atuais) => atuais.filter((item) => item.codigo !== codigo));
      setFeedback({ mensagem: 'Item excluído do acervo com sucesso!', tipo: 'success' });
    } catch (error) {
      console.error('Erro ao excluir item do acervo:', error);
      setFeedback({ mensagem: error.message || 'Erro ao excluir item.', tipo: 'error' });
    }
  }

  if (!bancoCarregado) {
    return (
      <div className="content-wrap" style={{ padding: "24px", textAlign: "left" }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress size="3rem" aria-label="Carregando acervo" />
        </div>
        <p>Carregando acervo...</p>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="content-wrap">
        <p className='aviso-tela' role="alert">{erro}</p>
        <button className="botao-novo" onClick={() => { setBancoCarregado(false); fetchItensAcervo(); }}>
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="content-wrap">
      {feedback.mensagem && (
        <div style={{ marginBottom: '20px' }}>
          <Alert variant='filled' severity={feedback.tipo}>
            {feedback.mensagem}
          </Alert>
        </div>
      )}
      <div className="gerenciamento-acervo">

        {exibirDialog && (
          <DialogAcervo
            acervoParaEditar={itemParaEditar}
            onCancelar={() => setExibirDialog(false)}
            onSalvar={salvarItemAcervo}
          />
        )}

        {/* CABEÇALHO */}
        <div className="cabecalho-acervo">
          <h1>Gerenciamento de Acervo</h1>
          <ImBooks className='icon'/>
          <p>Cadastre, pesquise, exclua ou edite itens do acervo.</p>
          <div className="container-botoes">
            <button className="botao-novo" onClick={() => {
              setItemParaEditar(null);
              setExibirDialog(true);
            }}>
              Cadastrar Novo Item
            </button>
          </div>
        </div>

        <br />

        {/* SECÇÃO DE REVISTAS */}
        <h1 className='subtitle'><ArrowForwardIcon fontSize='small' /> Revistas</h1>
        <div className="barra-pesquisa">
          <input
            type="text"
            placeholder="Pesquisar revista pelo título..."
            value={pesquisaRevista}
            onChange={(e) => setPesquisaRevista(e.target.value)}
          />
        </div>
        <br />
        <div className="tabela-container">
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Capa</th>
                <th>Título</th>
                <th>Edição</th>
                <th>ISSN</th>
                <th>Mês/Ano</th>
                <th>Ano</th>
                <th>Idioma</th>
                <th>Descrição</th>
                <th>Total Disponível</th>
                <th>Total Emprestado</th>
                <th>Localização</th>
                <th>Cadastrado em</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {revistasFiltradas.length > 0 ? (
                revistasFiltradas.map((revista) => (
                  <tr key={revista.codigo}>
                    <td>{revista.codigo}</td>
                    <td>
                      {revista.capa ? (
                        <img src={revista.capa} alt="Capa" style={{ width: "45px", height: "60px", objectFit: "contain" }} />
                      ) : (
                        "Sem capa"
                      )}
                    </td>
                    <td>{revista.titulo}</td>
                    <td>{revista.edicao}</td>
                    <td>{revista.issn}</td>
                    <td>{revista.mesAnoPublicacao}</td>
                    <td>{revista.ano}</td>
                    <td>{revista.idioma || "N/I"}</td>
                    <td>{revista.descricao ? revista.descricao : "Sem descrição"}</td>
                    <td>{revista.totalDisponivel}</td>
                    <td>{revista.totalEmprestados}</td>
                    <td>{revista.localizacao}</td>
                    <td>{formatarDataHora(revista.cadastradoEm)}</td>
                    <td className="acoes">
                      <button className="botao-editar" onClick={() => abrirEdicao(revista)}>Editar</button>
                      <button className="botao-excluir" onClick={() => excluirItem(revista.codigo)}>Excluir</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="14" style={{ textAlign: "center" }}>Nenhuma revista encontrada.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <br /><br />

        {/* SECÇÃO DE LIVROS */}
        <h1 className='subtitle'><ArrowForwardIcon fontSize='small' /> Livros</h1>
        <div className="barra-pesquisa">
          <input
            type="text"
            placeholder="Pesquisar livro pelo título, autor, gênero, idioma..."
            value={pesquisaLivro}
            onChange={(e) => setPesquisaLivro(e.target.value)}
          />
        </div>
        <br />
        <div className="tabela-container">
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Capa</th>
                <th>Título</th>
                <th>Autor</th>
                <th>Gênero</th>
                <th>ISBN</th>
                <th>Ano</th>
                <th>Idioma</th>
                <th>Total Disponível</th>
                <th>Localização</th>
                <th>Cadastrado em</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {livrosFiltrados.length > 0 ? (
                livrosFiltrados.map((livro) => (
                  <tr key={livro.codigo}>
                    <td>{livro.codigo}</td>
                    <td>
                      {livro.capa ? (
                        <img src={livro.capa} alt="Capa" style={{ width: "45px", height: "60px", objectFit: "contain" }} />
                      ) : (
                        "Sem capa"
                      )}
                    </td>
                    <td>{livro.titulo}</td>
                    <td>{livro.autor}</td>
                    <td>{livro.genero}</td>
                    <td>{livro.isbn}</td>
                    <td>{livro.ano}</td>
                    <td>{livro.idioma || "N/I"}</td>
                    <td>{livro.totalDisponivel}</td>
                    <td>{livro.localizacao}</td>
                    <td>{formatarDataHora(livro.cadastradoEm)}</td>
                    <td className="acoes">
                      <button className="botao-editar" onClick={() => abrirEdicao(livro)}>Editar</button>
                      <button className="botao-excluir" onClick={() => excluirItem(livro.codigo)}>Excluir</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="12" style={{ textAlign: "center" }}>Nenhum livro encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <br />
      </div>
    </div>
  );
}

export default GerenciamentoAcervo;