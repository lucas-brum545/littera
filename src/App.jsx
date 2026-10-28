import { useState, useEffect, useRef } from "react";
const TAMANHO_MAXIMO_IMAGEM = 5 * 1024 * 1024;

  function criarNovoItem() {
  return {
    tipo: "Livro",
    titulo: "",
    autor: "",
    editora: "",
    ano: "",
    genero: "",
    isbn: "",
    quantidade: 0,
    emprestados: 0,
    localizacao: "",
    capa: "",
    descricao: "",
    paginas: "",
    idioma: "",
    linkOpenLibrary: "",
    linkCrossref: "",
  };
}

function limparIdentificador(valor) {
  return String(valor || "")
    .replace(/[^0-9Xx]/g, "")
    .toUpperCase();
}
function validarISBN(valor) {
  const isbn = limparIdentificador(valor);

  if (/^\d{9}[\dX]$/.test(isbn)) {
    const soma = isbn.split("").reduce(
      (total, digito, indice) =>
        total + (digito === "X" ? 10 : Number(digito)) * (10 - indice),
      0
    );

    return soma % 11 === 0;
  }

  if (/^\d{13}$/.test(isbn)) {
    const soma = isbn.split("").reduce(
      (total, digito, indice) =>
        total + Number(digito) * (indice % 2 === 0 ? 1 : 3),
      0
    );

    return soma % 10 === 0;
  }

  return false;
}

function calcularDigitoISSN(seteDigitos) {
  const soma = seteDigitos
    .split("")
    .reduce(
      (total, digito, indice) =>
        total + Number(digito) * (8 - indice),
      0
    );

  const resultado = (11 - (soma % 11)) % 11;

  return resultado === 10 ? "X" : String(resultado);
}

function validarISSN(valor) {
  const issn = limparIdentificador(valor);

  if (!/^\d{7}[\dX]$/.test(issn)) {
    return false;
  }

  return calcularDigitoISSN(issn.slice(0, 7)) === issn[7];
}

function converterCodigoRevista(codigo) {
  const identificador = limparIdentificador(codigo);

  if (
    identificador.length === 13 &&
    identificador.startsWith("977")
  ) {
    const seteDigitos = identificador.slice(3, 10);

    return seteDigitos + calcularDigitoISSN(seteDigitos);
  }

  return identificador;
}

function formatarDataHora(valor) {
  if (!valor) return "Não registrado";

  const data = new Date(valor);

  if (Number.isNaN(data.getTime())) return "Data inválida";

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "medium",
  }).format(data);
}

function App() {
  const [livros, setLivros] = useState([]);
  const [bancoCarregado, setBancoCarregado] = useState(false);
  const [erroBanco, setErroBanco] = useState("");

  const [pesquisa, setPesquisa] = useState("");
  const [livroEditando, setLivroEditando] = useState(null);
  const [livroExcluindo, setLivroExcluindo] = useState(null);
  const livroEditandoRef = useRef(null);

  const [carregando, setCarregando] = useState(false);
  const [salvandoImagem, setSalvandoImagem] = useState(false);

  const [novoLivro, setNovoLivro] = useState(criarNovoItem());

  const [scannerAberto, setScannerAberto] = useState(false);
  const [mensagemScanner, setMensagemScanner] = useState("");

  const videoRef = useRef(null);
  const controlesScannerRef = useRef(null);
  const scannerAtivoRef = useRef(false);

  useEffect(() => {
  livroEditandoRef.current = livroEditando;
}, [livroEditando]);

  useEffect(() => {
    let cancelado = false;

    async function carregarAcervo() {
      try {
        setErroBanco("");

        const resposta = await fetch("/api/acervo");

        if (!resposta.ok) {
          throw new Error(
            `Erro ao consultar o acervo: HTTP ${resposta.status}`
          );
        }

        const dados = await resposta.json();

        if (cancelado) return;

        const itens = dados.map((item) => ({
          ...item,
          ano: item.ano ?? "",
          quantidade: item.quantidade ?? 0,
          emprestados: item.emprestados ?? 0,
          capa: item.capa ?? "",
          descricao: item.descricao ?? "",
          paginas: item.paginas ?? "",
          idioma: item.idioma ?? "",
          linkOpenLibrary: item.linkOpenLibrary ?? "",
          linkCrossref: item.linkCrossref ?? "",
}));

        setLivros(itens);
      } catch (erro) {
        console.error("Erro ao carregar acervo:", erro);

        if (!cancelado) {
          setErroBanco(
            "Não foi possível carregar o acervo do servidor."
          );
        }
      } finally {
        if (!cancelado) {
          setBancoCarregado(true);
        }
      }
    }

    carregarAcervo();

    return () => {
      cancelado = true;
    };
  }, []);


useEffect(() => {
  if (!scannerAberto) return;

  let cancelado = false;
  let leitor = null;

  async function iniciarScanner() {
    try {
      setMensagemScanner("Carregando leitor de código de barras...");

      // Carrega a biblioteca somente quando o scanner é aberto.
      const { BrowserMultiFormatReader } = await import("@zxing/browser");

      if (cancelado) return;

      leitor = new BrowserMultiFormatReader();

      setMensagemScanner("Solicitando acesso à câmera...");

      const dispositivos =
        await BrowserMultiFormatReader.listVideoInputDevices();

      if (cancelado) return;

      if (dispositivos.length === 0) {
        setMensagemScanner("Nenhuma câmera foi encontrada.");
        return;
      }

      const cameraTraseira = dispositivos.find((camera) =>
        /back|rear|traseira|environment/i.test(camera.label)
      );

      const cameraId = cameraTraseira
        ? cameraTraseira.deviceId
        : dispositivos[0].deviceId;

      setMensagemScanner(
        "Aponte a câmera para o código de barras."
      );

      const controles = await leitor.decodeFromVideoDevice(
        cameraId,
        videoRef.current,
        (resultado) => {
          if (!resultado || scannerAtivoRef.current) return;

          scannerAtivoRef.current = true;

          const codigo = resultado.getText();
          const valor = limparIdentificador(codigo);

          if (livroEditandoRef.current) {
            setLivroEditando((atual) => ({
              ...atual,
              isbn:
                atual.tipo === "Revista"
                  ? converterCodigoRevista(valor)
                  : valor,
            }));
          } else {
            setNovoLivro((atual) => ({
              ...atual,
              isbn:
                atual.tipo === "Revista"
                  ? converterCodigoRevista(valor)
                  : valor,
            }));
          }

          setScannerAberto(false);
          setMensagemScanner("");
        }
      );

      if (cancelado) {
        controles.stop();
        return;
      }

      controlesScannerRef.current = controles;
    } catch (erro) {
      console.error("Erro ao iniciar câmera:", erro);

      if (!cancelado) {
        setMensagemScanner(
          "Não foi possível abrir a câmera. Verifique as permissões."
        );
      }
    }
  }

  iniciarScanner();

  return () => {
    cancelado = true;

    controlesScannerRef.current?.stop();
    controlesScannerRef.current = null;

   // A câmera é encerrada pelos controles do scanner.

    scannerAtivoRef.current = false;
  };
}, [scannerAberto]);

  function abrirScanner() {
    scannerAtivoRef.current = false;
    setMensagemScanner("");
    setScannerAberto(true);
  }

  function fecharScanner() {
    setScannerAberto(false);
    setMensagemScanner("");
  }

  function selecionarImagem(event, destino) {
    const arquivo = event.target.files?.[0];
    event.target.value = "";

    if (!arquivo) return;

    if (!arquivo.type.startsWith("image/")) {
      alert("Selecione um arquivo de imagem.");
      return;
    }

    if (arquivo.size > TAMANHO_MAXIMO_IMAGEM) {
      alert("A imagem ultrapassa o limite de 5 MB.");
      return;
    }

    setSalvandoImagem(true);

    const leitor = new FileReader();

    leitor.onload = () => {
      if (typeof leitor.result !== "string") {
        alert("Não foi possível ler a imagem.");
        setSalvandoImagem(false);
        return;
      }

      if (destino === "novo") {
        setNovoLivro((atual) => ({
          ...atual,
          capa: leitor.result,
        }));
      } else {
        setLivroEditando((atual) => ({
          ...atual,
          capa: leitor.result,
        }));
      }

      setSalvandoImagem(false);
    };

    leitor.onerror = () => {
      alert("Erro ao carregar a imagem.");
      setSalvandoImagem(false);
    };

    leitor.readAsDataURL(arquivo);
  }

  function removerCapa(destino) {
    if (destino === "novo") {
      setNovoLivro((atual) => ({ ...atual, capa: "" }));
    } else {
      setLivroEditando((atual) => ({ ...atual, capa: "" }));
    }
  }

async function traduzirDescricaoEmSegundoPlano(textoOriginal, destino) {
  if (!textoOriginal?.trim()) return;

  try {
    const resposta = await fetch("/api/traducao/portugues", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ texto: textoOriginal }),
    });

    if (!resposta.ok) return;

    const resultado = await resposta.json();
    const traducao = resultado.traducao?.trim();

    if (!resultado.sucesso || !traducao) return;

    const atualizarDescricao = (atual) => {
      if (!atual) return atual;

      // Não substitui uma descrição que o usuário tenha editado.
      if (
        atual.descricao === textoOriginal ||
        !atual.descricao?.trim()
      ) {
        return { ...atual, descricao: traducao };
      }

      return atual;
    };

    if (destino === "novo") {
      setNovoLivro(atualizarDescricao);
    } else {
      setLivroEditando(atualizarDescricao);
    }
  } catch (erro) {
    console.error("Erro ao traduzir descrição:", erro);
  }
}

  async function buscarDados(destino = "novo") {
    const item = destino === "novo" ? novoLivro : livroEditando;

    if (!item) return;

    const tipo = item.tipo;
    const identificador = limparIdentificador(item.isbn);

    if (!identificador) {
      alert(tipo === "Livro" ? "Informe o ISBN." : "Informe o ISSN.");
      return;
    }

    if (
      tipo === "Livro" &&
      identificador.length !== 10 &&
      identificador.length !== 13
    ) {
      alert("O ISBN deve possuir 10 ou 13 caracteres.");
      return;
    }

    if (tipo === "Revista" && identificador.length !== 8) {
      alert("O ISSN deve possuir 8 caracteres.");
      return;
    }

    setCarregando(true);

    try {

const endpoint =
  tipo === "Livro"
    ? `/api/open-library/isbn/${encodeURIComponent(identificador)}`
    : `/api/periodicos/issn/${encodeURIComponent(identificador)}`;

      const resposta = await fetch(endpoint);
      const resultado = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          resultado.erro ||
            resultado.mensagem ||
            "Não foi possível encontrar os dados."
        );
      }

      if (!resultado.sucesso || !resultado.dados) {
        throw new Error("Dados não encontrados para esse identificador.");
      }

      const dados = resultado.dados;

      const atualizarFormulario = (atual) => ({
        ...atual,
        titulo: dados.titulo || atual.titulo,
        autor: dados.autor || atual.autor,
        editora: dados.editora || atual.editora,
        ano: dados.ano || atual.ano,
        genero: dados.genero || atual.genero,

        // Preserva o identificador informado pelo usuário.
        // Não substitui o ISBN/ISSN pelo valor retornado pela API.
        isbn: identificador,

        capa: atual.capa || dados.capa || "",

        // Mantém a descrição original enquanto a tradução ocorre em segundo plano.
        descricao: atual.descricao || dados.descricaoOriginal || dados.descricao || "",

        paginas: dados.paginas || atual.paginas,
        idioma: dados.idioma || atual.idioma,

     linkOpenLibrary:
     tipo === "Livro"
    ? dados.linkOpenLibrary || atual.linkOpenLibrary
    : "",

     linkCrossref:
     tipo === "Revista"
    ? dados.linkCrossref || atual.linkCrossref
    : "",
     });

      if (destino === "novo") {
        setNovoLivro(atualizarFormulario);
      } else {
        setLivroEditando(atualizarFormulario);
      }

if (
  tipo === "Livro" &&
  !item.descricao?.trim() &&
  dados.descricaoOriginal?.trim()
) {
  traduzirDescricaoEmSegundoPlano(
    dados.descricaoOriginal,
    destino
  );
}

      alert(
        tipo === "Livro"
          ? "Dados do livro encontrados com sucesso!"
          : "Dados do periódico encontrados com sucesso!"
      );
    } catch (erro) {
      console.error("Erro ao buscar dados:", erro);
      alert("Não foi possível buscar os dados.\n\n" + erro.message);
    } finally {
      setCarregando(false);
    }
  }

  const termo = pesquisa.toLowerCase();

  const livrosFiltrados = livros.filter((livro) =>
    [
      livro.tipo,
      livro.titulo,
      livro.autor,
      livro.editora,
      livro.genero,
      livro.isbn,
      livro.ano,
      livro.localizacao,
      livro.descricao,
    ].some((campo) =>
      String(campo || "").toLowerCase().includes(termo)
    )
  );

  async function cadastrarLivro(event) {
    event.preventDefault();

    const quantidade = Number(novoLivro.quantidade);
    const emprestados = Number(novoLivro.emprestados);

    if (quantidade < 0 || emprestados < 0) {
      alert("As quantidades não podem ser negativas.");
      return;
    }

    if (emprestados > quantidade) {
      alert(
        "A quantidade de exemplares emprestados não pode " +
          "ser maior que o total de exemplares."
      );
      return;
    }

    const novoItem = {
      ...novoLivro,
      ano: novoLivro.ano === "" ? null : Number(novoLivro.ano),
      quantidade,
      emprestados,
      paginas: novoLivro.paginas === "" ? null : Number(novoLivro.paginas),
      descricao: novoLivro.descricao || "",
      capa: novoLivro.capa || null,
      linkOpenLibrary: novoLivro.linkOpenLibrary || null,
      linkCrossref: novoLivro.linkCrossref || null,
    };

try {
  const resposta = await fetch("/api/acervo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(novoItem),
  });

  if (!resposta.ok) {
    let mensagem = `Erro HTTP ${resposta.status} ao cadastrar.`;

    try {
      const dadosErro = await resposta.json();

      mensagem = dadosErro.erro || dadosErro.message || mensagem;
    } catch {
      // Mantém a mensagem padrão se a resposta não for JSON válido.
    }

    throw new Error(mensagem);
  }

  const itemSalvo = await resposta.json();

  setLivros((atuais) => [...atuais, itemSalvo]);
  setNovoLivro(criarNovoItem());

  alert("Item cadastrado com sucesso!");
} catch (erro) {
  console.error("Erro ao cadastrar item:", erro);

  alert(erro.message || "Não foi possível cadastrar o item no banco de dados.");
}}

  function excluirLivro(id) {
    const livro = livros.find((item) => item.id === id);

    if (livro) setLivroExcluindo(livro);
  }

  async function confirmarExclusao() {
  if (!livroExcluindo) return;

  const id = livroExcluindo.id;

  try {
    const resposta = await fetch(`/api/acervo/${id}`, {
      method: "DELETE",
    });

    if (!resposta.ok) {
      const mensagem = await resposta.text();

      throw new Error(
        mensagem || `Erro HTTP ${resposta.status} ao excluir.`
      );
    }

    // Atualiza a lista somente depois da exclusão no servidor.
    setLivros((atuais) =>
      atuais.filter((livro) => livro.id !== id)
    );

    // Fecha a edição se o item excluído estiver sendo editado.
    if (livroEditando?.id === id) {
      setLivroEditando(null);
    }

    setLivroExcluindo(null);

    alert("Item excluído com sucesso!");
  } catch (erro) {
    console.error("Erro ao excluir item:", erro);

    alert(
      "Não foi possível excluir o item do banco de dados.\n\n" +
        erro.message
    );
  }
}

  async function atualizarLivro(event) {
    event.preventDefault();

    if (!livroEditando) return;

    const quantidade = Number(livroEditando.quantidade);
    if (
  livroEditando.paginas !== "" &&
  livroEditando.paginas != null &&
  (!Number.isInteger(Number(livroEditando.paginas)) ||
    Number(livroEditando.paginas) < 1)
) {
  alert("O número de páginas deve ser um número inteiro maior que zero.");
  return;
}
    const emprestados = Number(livroEditando.emprestados);

    if (quantidade < 0 || emprestados < 0) {
      alert("As quantidades não podem ser negativas.");
      return;
    }

    if (emprestados > quantidade) {
      alert(
        "A quantidade de exemplares emprestados não pode " +
          "ser maior que o total de exemplares."
      );
      return;
    }

    const itemAtualizado = {
      ...livroEditando,
      ano:
        livroEditando.ano === ""
          ? null
          : Number(livroEditando.ano),
      quantidade,
      emprestados,
      paginas:
        livroEditando.paginas === ""
          ? null
          : Number(livroEditando.paginas),
      descricao: livroEditando.descricao || "",
      capa: livroEditando.capa || null,
      linkOpenLibrary: livroEditando.linkOpenLibrary || null,
      linkCrossref: livroEditando.linkCrossref || null,
 };

    try {
      const resposta = await fetch(
        `/api/acervo/${livroEditando.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(itemAtualizado),
        }
      );
if (!resposta.ok) {
  let mensagem = `Erro HTTP ${resposta.status} ao atualizar.`;

  try {
    const dadosErro = await resposta.json();

    mensagem = dadosErro.erro || dadosErro.message || mensagem;
  } catch {
    // Mantém a mensagem padrão se a resposta não for JSON válido.
  }

  throw new Error(mensagem);
}

      const itemSalvo = await resposta.json();

      setLivros((atuais) =>
        atuais.map((livro) =>
          livro.id === itemSalvo.id ? itemSalvo : livro
        )
      );

      setLivroEditando(null);

      alert("Item atualizado com sucesso!");
    } catch (erro) {
  console.error("Erro ao atualizar item:", erro);

  alert(
    erro.message ||
      "Não foi possível atualizar o item no banco de dados."
  );
}
  }

  function campoIdentificador(item, destino) {
    return (
      <p>
        <label>
          {item.tipo === "Livro" ? "ISBN:" : "ISSN:"}
        </label>
        <br />

               <input
          type="text"
          required
          value={item.isbn}
          placeholder={
            item.tipo === "Livro"
              ? "Ex.: 9788535910663"
              : "Ex.: 2236-2886"
          }
       onChange={(event) => {
  const isbn = event.target.value;
  const identificador = limparIdentificador(isbn);

  let tipoDetectado = null;

  if (validarISBN(identificador)) {
    tipoDetectado = "Livro";
  } else if (validarISSN(identificador)) {
    tipoDetectado = "Revista";
  }

  const atualizarItem = (atual) => ({
    ...atual,
    isbn,
    ...(tipoDetectado ? { tipo: tipoDetectado } : {}),
  });

  if (destino === "novo") {
    setNovoLivro(atualizarItem);
  } else {
    setLivroEditando(atualizarItem);
  }
}}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();

              if (!carregando) {
                buscarDados(destino);
              }
            }
          }}
        />

        {" "}

        <button type="button" onClick={abrirScanner}>
         Ler código de barras
        </button>

        {" "}

        <button
          type="button"
          onClick={() => buscarDados(destino)}
          disabled={carregando}
        >
          {carregando ? "Buscando..." : "Buscar dados"}
        </button>
      </p>
    );
  }

  function campoCapa(item, destino) {
    return (
      <div
        style={{
          margin: "16px 0",
          padding: "12px",
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
      >
        <h3>Capa</h3>

        {item.capa ? (
          <img
            src={item.capa}
            alt={`Capa de ${item.titulo || "item"}`}
            style={{
              width: "120px",
              height: "170px",
              objectFit: "contain",
              display: "block",
              marginBottom: "12px",
            }}
          />
        ) : (
          <p>Nenhuma capa selecionada.</p>
        )}

        <p>
          <label>Selecionar imagem do dispositivo:</label>
          <br />
          <input
            type="file"
            accept="image/*"
            onChange={(event) => selecionarImagem(event, destino)}
          />
        </p>

        <p>
          <label>Ou informar uma URL de imagem:</label>
          <br />
          <input
            type="url"
            placeholder="https://exemplo.com/capa.jpg"
            value={
              item.capa.startsWith("data:image/") ? "" : item.capa
            }
            onChange={(event) => {
              const capa = event.target.value;

              if (destino === "novo") {
                setNovoLivro((atual) => ({ ...atual, capa }));
              } else {
                setLivroEditando((atual) => ({ ...atual, capa }));
              }
            }}
          />
        </p>

        {item.capa && (
          <button type="button" onClick={() => removerCapa(destino)}>
            Remover capa
          </button>
        )}

        {salvandoImagem && <p>Carregando imagem...</p>}

        <small>
          O limite por imagem é de 5 MB.
        </small>
      </div>
    );
  }


  function campoDescricao(item, destino) {
    const ehRevista = item.tipo === "Revista";

    return (
      <p>
        <label htmlFor={`descricao-${destino}`}>
          {ehRevista ? "Descrição da revista:" : "Sinopse do livro:"}
        </label>
        <br />

        <textarea
          id={`descricao-${destino}`}
          value={item.descricao || ""}
          rows={6}
          placeholder={
            ehRevista
              ? "Descreva o tema da edição, as matérias principais e outros conteúdos..."
              : "Escreva a sinopse, o resumo da história ou uma descrição do conteúdo do livro..."
          }
          onChange={(event) => {
            const descricao = event.target.value;

            if (destino === "novo") {
              setNovoLivro((atual) => ({
                ...atual,
                descricao,
              }));
            } else {
              setLivroEditando((atual) => ({
                ...atual,
                descricao,
              }));
            }
          }}
          style={{
            width: "100%",
            maxWidth: "650px",
            boxSizing: "border-box",
            padding: "10px",
            resize: "vertical",
          }}
        />
      </p>
    );
  }

  function campoTexto(rotulo, propriedade, item, destino, obrigatorio = true) {
    return (
      <p>
        <label>{rotulo}:</label>
        <br />
        <input
          type="text"
          required={obrigatorio}
          value={item[propriedade] ?? ""}
          onChange={(event) => {
            const valor = event.target.value;

            if (destino === "novo") {
              setNovoLivro((atual) => ({
                ...atual,
                [propriedade]: valor,
              }));
            } else {
              setLivroEditando((atual) => ({
                ...atual,
                [propriedade]: valor,
              }));
            }
          }}
        />
      </p>
    );
  }

  function campoAno(item, destino) {
    return (
      <p>
        <label>Ano de publicação:</label>
        <br />
        <input
          type="number"
          required
          value={item.ano ?? ""}
          onChange={(event) => {
            const ano = event.target.value;

            if (destino === "novo") {
              setNovoLivro((atual) => ({ ...atual, ano }));
            } else {
              setLivroEditando((atual) => ({ ...atual, ano }));
            }
          }}
        />
      </p>
    );
  }

  function campoQuantidade(item, propriedade, rotulo, destino) {
    return (
      <p>
        <label>{rotulo}:</label>
        <br />
        <input
          type="number"
          min="0"
          max={propriedade === "emprestados" ? item.quantidade : undefined}
          required
          value={item[propriedade] ?? 0}
          onChange={(event) => {
            const valor = event.target.value;

            if (destino === "novo") {
              setNovoLivro((atual) => ({
                ...atual,
                [propriedade]: valor,
              }));
            } else {
              setLivroEditando((atual) => ({
                ...atual,
                [propriedade]: valor,
              }));
            }
          }}
        />
      </p>
    );
  }

  if (!bancoCarregado) {
    return (
      <main style={{ padding: "24px" }}>
        <h1>LITTERA</h1>
        <p>Carregando o acervo local...</p>
      </main>
    );
  }

  return (
    <main style={{ padding: "20px" }}>
      <h1>Gerenciamento do Acervo - LITTERA</h1>

      {erroBanco && (
        <p
          role="alert"
          style={{
            color: "#b42318",
            padding: "10px",
            border: "1px solid #b42318",
          }}
        >
          {erroBanco}
        </p>
      )}

      <p>Total de itens cadastrados: {livros.length}</p>

      <hr />

      {/* CADASTRO */}

      <h2>Cadastrar</h2>

      <form onSubmit={cadastrarLivro}>
        <p>
          <label>Tipo:</label>
          <br />
          <select
            value={novoLivro.tipo}
            onChange={(event) => {
              const tipo = event.target.value;

              setNovoLivro((atual) => ({
                ...atual,
                tipo,
                isbn: "",
                titulo: "",
                autor: "",
                editora: "",
                ano: "",
                genero: "",
                capa: "",
                descricao: "",
                paginas: "",
                idioma: "",
                linkOpenLibrary: "",
                linkCrossref: "",
              }));
            }}
          >
            <option value="Livro">Livro</option>
            <option value="Revista">Revista</option>
          </select>
        </p>

        {campoIdentificador(novoLivro, "novo")}

        {campoTexto("Título", "titulo", novoLivro, "novo")}
        {campoTexto("Autor", "autor", novoLivro, "novo")}
        {campoTexto("Editora", "editora", novoLivro, "novo")}
        {campoAno(novoLivro, "novo")}
        {campoTexto("Gênero/Categoria", "genero", novoLivro, "novo")}

        {campoQuantidade(
          novoLivro,
          "quantidade",
          "Total de exemplares",
          "novo"
        )}

        {campoQuantidade(
          novoLivro,
          "emprestados",
          "Exemplares emprestados",
          "novo"
        )}

        {campoTexto(
          "Localização",
          "localizacao",
          novoLivro,
          "novo"
        )}

        {/* NOVO CAMPO: SINOPSE / DESCRIÇÃO */}
        {campoDescricao(novoLivro, "novo")}

        {campoCapa(novoLivro, "novo")}

        {novoLivro.paginas && (
          <p>
            <strong>Páginas:</strong> {novoLivro.paginas}
          </p>
        )}

        {novoLivro.idioma && (
          <p>
            <strong>Idioma:</strong> {novoLivro.idioma}
          </p>
        )}

                <button type="submit">Cadastrar item</button>

        {" "}

        <button
          type="button"
         onClick={() => {
  const valoresIniciais = criarNovoItem();

  const possuiDadosPreenchidos = Object.keys(valoresIniciais).some(
    (campo) => {
      if (campo === "tipo") {
        return false;
      }

      const valorAtual = novoLivro[campo] ?? "";
      const valorInicial = valoresIniciais[campo] ?? "";

      return String(valorAtual).trim() !== String(valorInicial).trim();
    }
  );

  if (possuiDadosPreenchidos) {
    const confirmar = window.confirm(
      "Existem dados preenchidos no cadastro. Deseja cancelar e perder esses dados?"
    );

    if (!confirmar) {
      return;
    }
  }

  setNovoLivro(criarNovoItem());
}}
        >
          Cancelar
        </button>
      </form>

      <hr />

      {/* PESQUISA */}

      <h2>Pesquisar</h2>

      <input
        type="search"
        placeholder="Título, autor, tipo, ISBN/ISSN ou descrição..."
        value={pesquisa}
        onChange={(event) => setPesquisa(event.target.value)}
      />

      {" "}

      <button type="button" onClick={() => setPesquisa("")}>
        Limpar pesquisa
      </button>

      {/* LISTAGEM */}

      <h2>Itens</h2>

      <div style={{ overflowX: "auto" }}>
        <table
          border="1"
          cellPadding="8"
          style={{
            borderCollapse: "collapse",
            width: "100%",
          }}
        >
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Capa</th>
              <th>Título</th>
              <th>Autor</th>
              <th>Editora</th>
              <th>Ano</th>
              <th>Categoria</th>
              <th>ISBN/ISSN</th>
              <th>Páginas</th>
              <th>Idioma</th>
              <th>Sinopse/Descrição</th>
              <th>Total</th>
              <th>Disponíveis</th>
              <th>Emprestados</th>
              <th>Localização</th>
              <th>Cadastrado em</th>
              <th>Última atualização</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {livrosFiltrados.map((livro) => (
              <tr key={livro.id}>
                <td>{livro.tipo}</td>

                <td>
                  {livro.capa ? (
                    <img
                      src={livro.capa}
                      alt={`Capa de ${livro.titulo}`}
                      style={{
                        width: "70px",
                        height: "100px",
                        objectFit: "contain",
                      }}
                    />
                  ) : (
                    "Sem capa"
                  )}
                </td>

                <td>{livro.titulo}</td>
                <td>{livro.autor}</td>
                <td>{livro.editora}</td>
                <td>{livro.ano}</td>
                <td>{livro.genero}</td>
                <td>{livro.isbn}</td>
                <td>{livro.paginas ?? "Não informado"}</td>
                <td>{livro.idioma || "Não informado"}</td>
                <td
                  style={{
                    minWidth: "180px",
                    maxWidth: "300px",
                    whiteSpace: "pre-wrap",
                    overflowWrap: "anywhere",
                  }}
                >
                  {livro.descricao ? (
                    <>
                      <span>
                        {livro.descricao.length > 150
                          ? `${livro.descricao.slice(0, 150)}...`
                          : livro.descricao}
                      </span>

                      {livro.descricao.length > 150 && (
                        <details>
                          <summary>Ver descrição completa</summary>
                          <p>{livro.descricao}</p>
                        </details>
                      )}
                    </>
                  ) : (
                    "Não informada"
                  )}
                </td>

                <td>{livro.quantidade}</td>

                <td>
                  {Number(livro.quantidade) -
                    Number(livro.emprestados)}
                </td>

                <td>{livro.emprestados}</td>
                <td>{livro.localizacao}</td>

                <td>{formatarDataHora(livro.cadastradoEm)}</td>

                <td>{formatarDataHora(livro.atualizadoEm)}</td>

                <td>
                  <button
                    type="button"
                    onClick={() => setLivroEditando({ ...livro })}
                  >
                    Atualizar
                  </button>

                  {" "}

                  <button
                    type="button"
                    onClick={() => excluirLivro(livro.id)}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}

            {livrosFiltrados.length === 0 && (
              <tr>
                <td colSpan="16">Nenhum item encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* EDIÇÃO */}

      {livroEditando && (
        <section>
          <hr />
          <h2>Atualizar item</h2>

          <form onSubmit={atualizarLivro}>
            <p>
              <label>Tipo:</label>
              <br />
              <select
                value={livroEditando.tipo}
                onChange={(event) =>
                  setLivroEditando((atual) => ({
                    ...atual,
                    tipo: event.target.value,
                  }))
                }
              >
                <option value="Livro">Livro</option>
                <option value="Revista">Revista</option>
              </select>
            </p>

            {campoIdentificador(livroEditando, "editando")}

            {campoTexto("Título", "titulo", livroEditando, "editando")}
            {campoTexto("Autor", "autor", livroEditando, "editando")}
            {campoTexto("Editora", "editora", livroEditando, "editando")}
            {campoAno(livroEditando, "editando")}

            {campoTexto(
              "Gênero/Categoria",
              "genero",
              livroEditando,
              "editando"
            )}

            {campoQuantidade(
              livroEditando,
              "quantidade",
              "Total de exemplares",
              "editando"
            )}

            {campoQuantidade(
              livroEditando,
              "emprestados",
              "Exemplares emprestados",
              "editando"
            )}

            {campoTexto(
              "Localização",
              "localizacao",
              livroEditando,
              "editando"
            )}

            {/* CAMPO EDITÁVEL: SINOPSE / DESCRIÇÃO */}
            {campoDescricao(livroEditando, "editando")}

            {campoCapa(livroEditando, "editando")}

           <p>
  <label htmlFor="paginas-edicao">Páginas:</label>
  <br />
  <input
    id="paginas-edicao"
    type="number"
    min="1"
    value={livroEditando.paginas ?? ""}
    onChange={(event) =>
      setLivroEditando((atual) => ({
        ...atual,
        paginas: event.target.value,
      }))
    }
  />
</p>

<p>
  <label htmlFor="idioma-edicao">Idioma:</label>
  <br />
  <input
    id="idioma-edicao"
    type="text"
    value={livroEditando.idioma ?? ""}
    onChange={(event) =>
      setLivroEditando((atual) => ({
        ...atual,
        idioma: event.target.value,
      }))
    }
    placeholder="Ex.: Português"
  />
</p>

            <button type="submit">Salvar alterações</button>

            {" "}

            <button
              type="button"
              onClick={() => setLivroEditando(null)}
            >
              Cancelar
            </button>
          </form>
        </section>
      )}

      {/* MODAL DO SCANNER */}

      {scannerAberto && (
        <div
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              fecharScanner();
            }
          }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 2000,
            backgroundColor: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-scanner"
            style={{
              background: "#fff",
              color: "#222",
              borderRadius: "12px",
              padding: "20px",
              width: "100%",
              maxWidth: "600px",
              boxSizing: "border-box",
            }}
          >
            <h2 id="titulo-scanner">Ler código de barras</h2>

            <p>
              Posicione o código de barras dentro da imagem.
              Mantenha o código iluminado e estável.
            </p>

            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              style={{
                width: "100%",
                maxHeight: "60vh",
                background: "#111",
                borderRadius: "8px",
              }}
            />

            <p aria-live="polite">{mensagemScanner}</p>

            <button type="button" onClick={fecharScanner}>
              Fechar câmera
            </button>
          </div>
        </div>
      )}

      {/* CONFIRMAR EXCLUSÃO */}

      {livroExcluindo && (
        <div
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setLivroExcluindo(null);
            }
          }}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
            zIndex: 1000,
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-confirmacao-exclusao"
            style={{
              backgroundColor: "#fff",
              color: "#222",
              padding: "24px",
              borderRadius: "10px",
              width: "100%",
              maxWidth: "400px",
              boxSizing: "border-box",
              textAlign: "center",
            }}
          >
            <h2 id="titulo-confirmacao-exclusao">
              Confirmar exclusão
            </h2>

            {livroExcluindo.capa && (
              <img
                src={livroExcluindo.capa}
                alt={`Capa de ${livroExcluindo.titulo}`}
                style={{
                  width: "120px",
                  height: "170px",
                  objectFit: "contain",
                }}
              />
            )}

            <p>
              <strong>{livroExcluindo.titulo}</strong>
            </p>

            <p>Autor: {livroExcluindo.autor}</p>

            <p>Tem certeza de que deseja excluir este item?</p>

            <button
              type="button"
              onClick={confirmarExclusao}
              style={{
                margin: "6px",
                padding: "10px 16px",
                backgroundColor: "#b42318",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Sim, excluir
            </button>

            <button
              type="button"
              onClick={() => setLivroExcluindo(null)}
              style={{
                margin: "6px",
                padding: "10px 16px",
                cursor: "pointer",
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default App;
