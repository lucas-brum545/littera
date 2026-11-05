import { useState, useEffect, useRef } from "react";
import DialogAcervo from '../../components/DialogAcervo/DialogAcervo'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { ImBooks } from 'react-icons/im';
import './GerenciamentoAcervo.css';
import { Alert, CircularProgress } from "@mui/material";

function criarNovoItem() {
  return {
    tipo: "LIVRO",
    titulo: "",
    autor: "",
    ano: "",
    genero: "",
    isbn: "",
    edicao: "",
    issn: "",
    mesAnoPublicacao: "",
    totalDisponivel: "",
    totalEmprestados: "",
    localizacao: "",
    capa: "",
    descricao: "",
    idioma: "",
  };
}

function formatarDataHora(valor) {
  if (!valor) return "Não registrado";

  // Se a string vier no formato YYYY-MM-DD (comum em datas vindas do SQL),
  // podemos evitar o desvio de fuso gerando a data baseada em UTC:
  let data;
  if (typeof valor === "string" && /^\d{4}-\d{2}-\d{2}$/.test(valor)) {
    const [ano, mes, dia] = valor.split("-").map(Number);
    data = new Date(Date.UTC(ano, mes - 1, dia));
  } else {
    data = new Date(valor);
  }

  if (Number.isNaN(data.getTime())) return "Data inválida";

  // Usamos timeZone: 'UTC' para garantir que o dia exibido seja exatamente 
  // o mesmo que está gravado na base de dados, sem o recuo de horário.
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeZone: "UTC",
  }).format(data);
}

function App() {
  const [itensAcervo, setItensAcervo] = useState([]);
  const [exibirDialog, setExibirDialog] = useState(false);
  const [itemParaEditar, setItemParaEditar] = useState(null);
  const [bancoCarregado, setBancoCarregado] = useState(false);
  const [erroBanco, setErroBanco] = useState("");
  const [erro, setErro] = useState('');
  const [feedback, setFeedback] = useState({ mensagem: '', tipo: '' });

  // Pesquisas independentes por tabela
  const [pesquisaLivro, setPesquisaLivro] = useState("");
  const [pesquisaRevista, setPesquisaRevista] = useState("");

  useEffect(() => {
    fetchItensAcervo();
  }, []);

  async function fetchItensAcervo() {
    try {
      setErroBanco("");
      const resposta = await fetch("/api/acervo");

      if (!resposta.ok) {
        throw new Error(`Erro ao consultar o acervo: HTTP ${resposta.status}`);
      }

      const dados = await resposta.json();

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
    } catch (erro) {
      console.error("Erro ao carregar acervo:", erro.response.data || erro.message || erro);
      setErro('Erro ao carregar acervo.');
      setErroBanco("Não foi possível carregar o acervo do servidor.");
    } finally {
      setBancoCarregado(true);
    }
  }

  // Filtragens independentes para as tabelas de Livros e Revistas
  const livrosFiltrados = itensAcervo
    .filter((item) => item.tipo === "LIVRO")
    .filter((livro) => {
      const termo = pesquisaLivro.toLowerCase();
      const titulo = (livro.titulo || "").toLowerCase();
      const autor = (livro.autor || "").toLowerCase();
      const genero = (livro.genero || "").toLowerCase();
      const idioma = (livro.idioma || "").toLowerCase();

      return (
        titulo.includes(termo) ||
        autor.includes(termo) ||
        genero.includes(termo) ||
        idioma.includes(termo)
      );
    });

  const revistasFiltradas = itensAcervo
    .filter((item) => item.tipo === "REVISTA")
    .filter((revista) => revista.titulo.toLowerCase().includes(pesquisaRevista.toLowerCase()));

  if (!bancoCarregado) {
    return (
      <div className="content-wrap" style={{ padding: "24px", textAlign: "left" }}>
        <CircularProgress sx={{display:'flex', justifyContent: 'center', color: 'primary'}} enableTrackSlot size="3rem" aria-label="Loading…" />
        <p>Carregando acervo...</p>
      </div>
    );
  }

  function abrirEdicao(item) {
    setItemParaEditar(item);
    setExibirDialog(true);
  }

  async function salvarItemAcervo(dados) {
    try {
      const url = itemParaEditar ? `/api/acervo/${itemParaEditar.codigo}` : "/api/acervo";
      const metodo = itemParaEditar ? "PUT" : "POST";

      const resposta = await fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });

      if (!resposta.ok) {
        const textoErro = await resposta.text();
        let mensagem = "Erro ao salvar item no acervo.";
        try {
          const jsonErro = JSON.parse(textoErro);
          mensagem = jsonErro.message || jsonErro.erro || mensagem;
        } catch {
          if (textoErro) mensagem = textoErro;
        }
        throw new Error(mensagem);
      }

      await fetchItensAcervo();
      setExibirDialog(false);
      setItemParaEditar(null);
      setFeedback({ mensagem: 'Item do acervo salvo com sucesso!', tipo: 'success' });

    } catch (error) {
      console.error("Erro ao salvar:", error);
      // Aqui tratamos com segurança a mensagem de erro sem depender de .response.data
      const mensagemErro = error.message || 'Erro ao salvar item no acervo.';
      alert(mensagemErro);
    }
  }

  async function excluirItem(codigo) {
    const confirmar = window.confirm(`Tem certeza que deseja excluir este item do acervo? Código: ${codigo}`);

    if (confirmar) {
      try {
        const resposta = await fetch(`/api/acervo/${codigo}`, { method: "DELETE" });
        if (!resposta.ok) throw new Error("Erro ao excluir item do servidor.");

        setItensAcervo(itensAcervo.filter((item) => item.codigo !== codigo));
        setFeedback({ mensagem: 'Item excluído do acervo com sucesso!', tipo: 'success' });
      } catch (error) {
        console.error('Erro ao excluir item do acervo:', error);
        setFeedback({ mensagem: error.message || 'Erro ao excluir item.', tipo: 'error' });
      }
    }
  }

  if (erro) return <p className='aviso-tela'>{erro}</p>;

  setTimeout(() => {
    setFeedback({ mensagem: '', tipo: '' });
    }, 10000);

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

        {erroBanco && <p role="alert" style={{ color: "#b42318", padding: "10px" }}>{erroBanco}</p>}

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

export default App;