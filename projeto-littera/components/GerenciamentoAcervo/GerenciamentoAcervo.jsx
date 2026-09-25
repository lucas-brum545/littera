import { useState } from "react"
import './GerenciamentoAcervo.css'

export default function GerenciamentoAcervo() {
  const [livros, setLivros] = useState([
    {
      id: 1,
      tipo: "Livro",
      titulo: "Dom Casmurro",
      autor: "Machado de Assis",
      editora: "Companhia das Letras",
      ano: 1899,
      genero: "Romance",
      isbn: "9788535910663",
      quantidade: 5,
      emprestados: 2,
      localizacao: "Estante A - Prateleira 3",
    },
    {
      id: 2,
      tipo: "Livro",
      titulo: "O Pequeno Príncipe",
      autor: "Antoine de Saint-Exupéry",
      editora: "Agir",
      ano: 1943,
      genero: "Literatura",
      isbn: "9788522031447",
      quantidade: 3,
      emprestados: 1,
      localizacao: "Estante B - Prateleira 2",
    },
  ]);

  const [pesquisa, setPesquisa] = useState("");
  const [livroEditando, setLivroEditando] = useState(null);

  // NOVO ITEM
  const [novoLivro, setNovoLivro] = useState({
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
  });

  // PESQUISAR
  const livrosFiltrados = livros.filter((livro) => {
    const termo = pesquisa.toLowerCase();

    return (
      livro.tipo.toLowerCase().includes(termo) ||
      livro.titulo.toLowerCase().includes(termo) ||
      livro.autor.toLowerCase().includes(termo) ||
      livro.editora.toLowerCase().includes(termo) ||
      livro.genero.toLowerCase().includes(termo) ||
      livro.isbn.includes(termo) ||
      livro.ano.toString().includes(termo)
    );
  });

  // CADASTRAR ITEM
  function cadastrarLivro(event) {
    event.preventDefault();

    const novoItem = {
      ...novoLivro,
      id: Date.now(),
      ano: Number(novoLivro.ano),
      quantidade: Number(novoLivro.quantidade),
      emprestados: Number(novoLivro.emprestados),
    };

    setLivros((livrosAtuais) => [
      ...livrosAtuais,
      novoItem,
    ]);

    // Limpa o formulário
    setNovoLivro({
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
    });
  }

  // EXCLUIR
  function excluirLivro(id) {
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir este item?"
    );

    if (confirmar) {
      setLivros((livrosAtuais) =>
        livrosAtuais.filter((livro) => livro.id !== id)
      );
    }
  }

  // ATUALIZAR
  function atualizarLivro(event) {
    event.preventDefault();

    setLivros((livrosAtuais) =>
      livrosAtuais.map((livro) =>
        livro.id === livroEditando.id
          ? {
              ...livroEditando,
              ano: Number(livroEditando.ano),
              quantidade: Number(livroEditando.quantidade),
              emprestados: Number(livroEditando.emprestados),
            }
          : livro
      )
    );

    setLivroEditando(null);
  }

  return (
    <div>
      <h1>Gerenciamento do Acervo - LITTERA</h1>

      <hr />

      {/* =========================
          CADASTRAR ITEM
          ========================= */}

      <h2>Cadastrar</h2>

      <form onSubmit={cadastrarLivro}>
        <p>
          <label>Tipo: </label>

          <select
            value={novoLivro.tipo}
            onChange={(event) =>
              setNovoLivro({
                ...novoLivro,
                tipo: event.target.value,
              })
            }
          >
            <option value="Livro">Livro</option>
            <option value="Revista">Revista</option>
          </select>
        </p>

        <p>
          <label>Título: </label>

          <input
            type="text"
            required
            value={novoLivro.titulo}
            onChange={(event) =>
              setNovoLivro({
                ...novoLivro,
                titulo: event.target.value,
              })
            }
          />
        </p>

        <p>
          <label>Autor: </label>

          <input
            type="text"
            required
            value={novoLivro.autor}
            onChange={(event) =>
              setNovoLivro({
                ...novoLivro,
                autor: event.target.value,
              })
            }
          />
        </p>

        <p>
          <label>Editora: </label>

          <input
            type="text"
            required
            value={novoLivro.editora}
            onChange={(event) =>
              setNovoLivro({
                ...novoLivro,
                editora: event.target.value,
              })
            }
          />
        </p>

        <p>
          <label>Ano de Publicação: </label>

          <input
            type="number"
            required
            value={novoLivro.ano}
            onChange={(event) =>
              setNovoLivro({
                ...novoLivro,
                ano: event.target.value,
              })
            }
          />
        </p>

        <p>
          <label>Gênero/Categoria: </label>

          <input
            type="text"
            required
            value={novoLivro.genero}
            onChange={(event) =>
              setNovoLivro({
                ...novoLivro,
                genero: event.target.value,
              })
            }
          />
        </p>

        <p>
          <label>ISBN: </label>

          <input
            type="text"
            required
            value={novoLivro.isbn}
            onChange={(event) =>
              setNovoLivro({
                ...novoLivro,
                isbn: event.target.value,
              })
            }
          />
        </p>

        <p>
          <label>Total de exemplares: </label>

          <input
            type="number"
            min="0"
            required
            value={novoLivro.quantidade}
            onChange={(event) =>
              setNovoLivro({
                ...novoLivro,
                quantidade: event.target.value,
              })
            }
          />
        </p>

        <p>
          <label>Exemplares emprestados: </label>

          <input
            type="number"
            min="0"
            max={novoLivro.quantidade}
            required
            value={novoLivro.emprestados}
            onChange={(event) =>
              setNovoLivro({
                ...novoLivro,
                emprestados: event.target.value,
              })
            }
          />
        </p>

        <p>
          <label>Localização: </label>

          <input
            type="text"
            required
            value={novoLivro.localizacao}
            onChange={(event) =>
              setNovoLivro({
                ...novoLivro,
                localizacao: event.target.value,
              })
            }
          />
        </p>

        <button type="submit">
          Cadastrar Item
        </button>
      </form>

      <hr />

      {/* =========================
          PESQUISA
          ========================= */}

      <h2>Pesquisar</h2>

      <input
        type="text"
        placeholder="Pesquisar por tipo, título, autor, ano, ISBN..."
        value={pesquisa}
        onChange={(event) => setPesquisa(event.target.value)}
      />

      <button onClick={() => setPesquisa("")}>
        Limpar pesquisa
      </button>

      <br />
      <br />

      {/* =========================
          LISTAGEM
          ========================= */}

      <table border="1">
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Título</th>
            <th>Autor</th>
            <th>Editora</th>
            <th>Ano de Publicação</th>
            <th>Gênero/Categoria</th>
            <th>ISBN</th>
            <th>Total de Exemplares</th>
            <th>Disponíveis</th>
            <th>Emprestados</th>
            <th>Localização</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {livrosFiltrados.map((livro) => (
            <tr key={livro.id}>
              <td>{livro.tipo}</td>
              <td>{livro.titulo}</td>
              <td>{livro.autor}</td>
              <td>{livro.editora}</td>
              <td>{livro.ano}</td>
              <td>{livro.genero}</td>
              <td>{livro.isbn}</td>

              <td>{livro.quantidade}</td>

              <td>
                {Number(livro.quantidade) -
                  Number(livro.emprestados)}
              </td>

              <td>{livro.emprestados}</td>

              <td>{livro.localizacao}</td>

              <td>
                <button
                  onClick={() =>
                    setLivroEditando(livro)
                  }
                >
                  Atualizar
                </button>

                <button
                  onClick={() =>
                    excluirLivro(livro.id)
                  }
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* =========================
          ATUALIZAÇÃO
          ========================= */}

      {livroEditando && (
        <div>
          <hr />

          <h2>Atualizar Item</h2>

          <form onSubmit={atualizarLivro}>
            <p>
              <label>Tipo: </label>

              <select
                value={livroEditando.tipo}
                onChange={(event) =>
                  setLivroEditando({
                    ...livroEditando,
                    tipo: event.target.value,
                  })
                }
              >
                <option value="Livro">Livro</option>
                <option value="Revista">Revista</option>
              </select>
            </p>

            <p>
              <label>Título: </label>

              <input
                type="text"
                value={livroEditando.titulo}
                onChange={(event) =>
                  setLivroEditando({
                    ...livroEditando,
                    titulo: event.target.value,
                  })
                }
              />
            </p>

            <p>
              <label>Autor: </label>

              <input
                type="text"
                value={livroEditando.autor}
                onChange={(event) =>
                  setLivroEditando({
                    ...livroEditando,
                    autor: event.target.value,
                  })
                }
              />
            </p>

            <p>
              <label>Editora: </label>

              <input
                type="text"
                value={livroEditando.editora}
                onChange={(event) =>
                  setLivroEditando({
                    ...livroEditando,
                    editora: event.target.value,
                  })
                }
              />
            </p>

            <p>
              <label>Ano de Publicação: </label>

              <input
                type="number"
                value={livroEditando.ano}
                onChange={(event) =>
                  setLivroEditando({
                    ...livroEditando,
                    ano: event.target.value,
                  })
                }
              />
            </p>

            <p>
              <label>Gênero/Categoria: </label>

              <input
                type="text"
                value={livroEditando.genero}
                onChange={(event) =>
                  setLivroEditando({
                    ...livroEditando,
                    genero: event.target.value,
                  })
                }
              />
            </p>

            <p>
              <label>ISBN: </label>

              <input
                type="text"
                value={livroEditando.isbn}
                onChange={(event) =>
                  setLivroEditando({
                    ...livroEditando,
                    isbn: event.target.value,
                  })
                }
              />
            </p>

            <p>
              <label>Total de exemplares: </label>

              <input
                type="number"
                min="0"
                value={livroEditando.quantidade}
                onChange={(event) =>
                  setLivroEditando({
                    ...livroEditando,
                    quantidade: event.target.value,
                  })
                }
              />
            </p>

            <p>
              <label>Exemplares emprestados: </label>

              <input
                type="number"
                min="0"
                max={livroEditando.quantidade}
                value={livroEditando.emprestados}
                onChange={(event) =>
                  setLivroEditando({
                    ...livroEditando,
                    emprestados: event.target.value,
                  })
                }
              />
            </p>

            <p>
              <label>Localização: </label>

              <input
                type="text"
                value={livroEditando.localizacao}
                onChange={(event) =>
                  setLivroEditando({
                    ...livroEditando,
                    localizacao: event.target.value,
                  })
                }
              />
            </p>

            <button type="submit">
              Salvar alterações
            </button>

            <button
              type="button"
              onClick={() =>
                setLivroEditando(null)
              }
            >
              Cancelar
            </button>
          </form>
        </div>
      )}
    </div>
  );
}