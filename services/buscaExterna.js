// Consultas a serviços públicos de terceiros (Open Library e Crossref).
// Usa fetch puro, e NÃO o axios do services/api, de propósito: o axios do Littera
// anexa o token JWT a toda requisição, e ele não pode ser enviado a sites de terceiros.

/** "01041789" -> "0104-1789" */
export function formatarIssn(issn) {
  const limpo = String(issn || "").replace(/[^0-9Xx]/g, "").toUpperCase();
  return limpo.length === 8 ? `${limpo.slice(0, 4)}-${limpo.slice(4)}` : limpo;
}

/**
 * Busca um livro pelo ISBN no Open Library.
 * Devolve { titulo, autor, ano, genero, capa } ou null se o ISBN não existir lá.
 */
export async function buscarLivroPorIsbn(isbn) {
  const chave = `ISBN:${isbn}`;
  const resposta = await fetch(
    `https://openlibrary.org/api/books?bibkeys=${encodeURIComponent(chave)}&format=json&jscmd=data`
  );
  if (!resposta.ok) {
    throw new Error("O Open Library não respondeu. Tente novamente em instantes.");
  }

  const json = await resposta.json();
  const livro = json[chave];
  if (!livro) return null;

  return {
    titulo: livro.title ?? "",
    autor: livro.authors?.map((a) => a.name).join(", ") ?? "",
    ano: Number(livro.publish_date?.match(/\d{4}/)?.[0]) || null,
    genero: livro.subjects?.[0]?.name ?? "",
    capa: livro.cover?.medium ?? livro.cover?.large ?? livro.cover?.small ?? "",
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
