// 1. Buscando um livro pelo ISBN (BrasilAPI)
async function buscarLivro(isbn) {
  const res = await fetch(`https://brasilapi.com.br/api/isbn/v1/${isbn}`);
  const dados = await res.json();
  console.log(`Livro: ${dados.title} | Editora: ${dados.publisher}`);
}

// 2. Buscando um periódico pelo ISSN (Crossref)
async function buscarPeriodico(issn) {
  const res = await fetch(`https://api.crossref.org/journals/${issn}`);
  const dados = await res.json();
  console.log(`Periódico: ${dados.message.title} | Editora: ${dados.message.publisher}`);
}

buscarLivro('9788535914849');
buscarPeriodico('0100-4042'); // Química Nova (Periódico brasileiro)