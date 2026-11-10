// Consultas a serviços públicos de terceiros (Google Books, Open Library e Crossref).
// Usa fetch puro, e NÃO o axios do services/api, de propósito: o axios do Littera
// anexa o token JWT a toda requisição, e ele não pode ser enviado a sites de terceiros.

// Opcional: chave pública do Google Books (restrinja por domínio no console do Google).
// Sem chave funciona, mas a cota é compartilhada e pode devolver 429 em horários de pico.
const GOOGLE_BOOKS_KEY = import.meta.env.VITE_GOOGLE_BOOKS_KEY ?? "";

/** "01041789" -> "0104-1789" */
export function formatarIssn(issn) {
  const limpo = String(issn || "").replace(/[^0-9Xx]/g, "").toUpperCase();
  return limpo.length === 8 ? `${limpo.slice(0, 4)}-${limpo.slice(4)}` : limpo;
}

// ------------------------------------------------------------------ utilitários

/** Remove tags HTML (o Google devolve <p>, <br>, <b>...) mantendo as quebras de linha. */
function textoLimpo(html) {
  if (!html) return "";
  const comQuebras = String(html)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n");
  const doc = new DOMParser().parseFromString(comQuebras, "text/html");
  return (doc.body.textContent || "").replace(/\n{3,}/g, "\n\n").trim();
}

/** "pt" -> "Português", "en" -> "Inglês" */
function nomeDoIdioma(codigo) {
  if (!codigo) return "";
  try {
    const nome = new Intl.DisplayNames(["pt-BR"], { type: "language" }).of(codigo);
    return nome ? nome.charAt(0).toUpperCase() + nome.slice(1) : "";
  } catch {
    return "";
  }
}

function extrairAno(texto) {
  return Number(String(texto ?? "").match(/\d{4}/)?.[0]) || null;
}

// ------------------------------------------------------------------ Google Books

/** Tem boa cobertura de livros brasileiros, com descrição e idioma. */
async function buscarNoGoogleBooks(isbn) {
  const chave = GOOGLE_BOOKS_KEY ? `&key=${encodeURIComponent(GOOGLE_BOOKS_KEY)}` : "";
  const resposta = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=isbn:${encodeURIComponent(isbn)}&maxResults=1${chave}`
  );
  if (!resposta.ok) {
    throw new Error(
      resposta.status === 429
        ? "Limite de consultas do Google Books atingido. Tente novamente em instantes."
        : "O Google Books não respondeu."
    );
  }

  const json = await resposta.json();
  const info = json.items?.[0]?.volumeInfo;
  if (!info) return null;

  const miniatura = info.imageLinks?.thumbnail ?? info.imageLinks?.smallThumbnail ?? "";

  return {
    titulo: info.title ?? "",
    autor: info.authors?.join(", ") ?? "",
    ano: extrairAno(info.publishedDate),
    genero: info.categories?.[0] ?? "",
    descricao: textoLimpo(info.description),
    idioma: nomeDoIdioma(info.language),
    capa: miniatura.replace(/^http:\/\//, "https://"), // evita conteúdo misto no site em HTTPS
  };
}

// ------------------------------------------------------------------ Open Library

async function buscarNoOpenLibrary(isbn) {
  const chave = `ISBN:${isbn}`;
  const resposta = await fetch(
    `https://openlibrary.org/api/books?bibkeys=${encodeURIComponent(chave)}&format=json&jscmd=data`
  );
  if (!resposta.ok) throw new Error("O Open Library não respondeu.");

  const livro = (await resposta.json())[chave];
  if (!livro) return null;

  return {
    titulo: livro.title ?? "",
    autor: livro.authors?.map((a) => a.name).join(", ") ?? "",
    ano: extrairAno(livro.publish_date),
    genero: livro.subjects?.[0]?.name ?? "",
    capa: livro.cover?.medium ?? livro.cover?.large ?? livro.cover?.small ?? "",
  };
}

/** O endpoint de dados do Open Library não traz descrição: ela fica na edição ou na obra (work). */
async function descricaoDoOpenLibrary(isbn) {
  try {
    const lerDescricao = (d) => (typeof d === "string" ? d : d?.value ?? "");

    const respostaEdicao = await fetch(`https://openlibrary.org/isbn/${encodeURIComponent(isbn)}.json`);
    if (!respostaEdicao.ok) return "";
    const edicao = await respostaEdicao.json();

    let texto = lerDescricao(edicao.description);
    const chaveObra = edicao.works?.[0]?.key;
    if (!texto && chaveObra) {
      const respostaObra = await fetch(`https://openlibrary.org${chaveObra}.json`);
      if (respostaObra.ok) texto = lerDescricao((await respostaObra.json()).description);
    }
    // Remove rodapés do tipo "---------- ([source][1])" que o Open Library costuma anexar
    return texto.split(/\r?\n-{5,}/)[0].trim();
  } catch {
    return "";
  }
}

// ------------------------------------------------------------------ API pública

/**
 * Busca um livro pelo ISBN. Consulta o Google Books (melhor para livros brasileiros) e o
 * Open Library ao mesmo tempo e junta os resultados, dando preferência ao Google.
 * Devolve { titulo, autor, ano, genero, capa, descricao, idioma } ou null se nenhum achou.
 * Lança erro só se as duas fontes falharem.
 */
export async function buscarLivroPorIsbn(isbn) {
  const [google, openLibrary] = await Promise.allSettled([
    buscarNoGoogleBooks(isbn),
    buscarNoOpenLibrary(isbn),
  ]);

  if (google.status === "rejected" && openLibrary.status === "rejected") {
    throw google.reason;
  }

  const g = google.status === "fulfilled" ? google.value : null;
  const o = openLibrary.status === "fulfilled" ? openLibrary.value : null;
  if (!g && !o) return null;

  // Só vai ao Open Library buscar a descrição se o Google não trouxe uma
  const descricao = g?.descricao || (o ? await descricaoDoOpenLibrary(isbn) : "");

  return {
    titulo: g?.titulo || o?.titulo || "",
    autor: g?.autor || o?.autor || "",
    ano: g?.ano || o?.ano || null,
    genero: g?.genero || o?.genero || "",
    capa: g?.capa || o?.capa || "",
    descricao,
    idioma: g?.idioma || "",
  };
}

/**
 * Busca um periódico pelo ISSN na Crossref.
 * Devolve { titulo } ou null se o ISSN não existir lá.
 * Atenção: a Crossref cobre sobretudo revistas científicas; revistas comerciais
 * (de banca) muitas vezes não são encontradas e precisam ser preenchidas à mão.
 */
export async function buscarRevistaPorIssn(issn) {
  const resposta = await fetch(
    `https://api.crossref.org/journals/${encodeURIComponent(formatarIssn(issn))}`
  );
  if (resposta.status === 404) return null;
  if (!resposta.ok) {
    throw new Error("A Crossref não respondeu. Tente novamente em instantes.");
  }

  const json = await resposta.json();
  const titulo = json?.message?.title;
  return titulo ? { titulo } : null;
}