import { useState, useMemo } from "react";
import { Search, BookOpen, Newspaper, Check, AlertTriangle } from "lucide-react";
import "./App.css";

const PRAZO_DIAS = { livro: 14, revista: 7 };

const ACERVO = [
  { id: 1, titulo: "Dom Casmurro", autor: "Machado de Assis", ano: 1899, tipo: "livro" },
  { id: 2, titulo: "O Cortiço", autor: "Aluísio Azevedo", ano: 1890, tipo: "livro" },
];

function somarDias(dataISO, dias) {
  const d = new Date(dataISO + "T00:00:00");
  d.setDate(d.getDate() + dias);
  return d.toISOString().slice(0, 10);
}

export default function CadastroEmprestimo() {
  const hoje = new Date().toISOString().slice(0, 10);

  const [usuario, setUsuario] = useState({ nome: "", email: "" });
  const [tipo, setTipo] = useState("livro");
  const [campoBusca, setCampoBusca] = useState("titulo");
  const [busca, setBusca] = useState("");
  const [itemSelecionado, setItemSelecionado] = useState(null);
  const [dataEmprestimo, setDataEmprestimo] = useState(hoje);
  const [erros, setErros] = useState({});
  const [registros, setRegistros] = useState([]);

  const resultados = useMemo(() => {
    if (!busca.trim()) return [];
    const termo = busca.trim().toLowerCase();
    return ACERVO.filter((item) => {
      if (item.tipo !== tipo) return false;
      const valor = String(item[campoBusca]).toLowerCase();
      return valor.includes(termo);
    });
  }, [busca, campoBusca, tipo]);

  const prazoDias = PRAZO_DIAS[tipo];
  const dataDevolucao = somarDias(dataEmprestimo, prazoDias);

  const validar = () => {
    const e = {};
    if (!usuario.nome.trim()) e.nome = "Informe o nome do usuário.";
    if (!/^\S+@\S+\.\S+$/.test(usuario.email)) e.email = "Informe um e-mail válido.";
    setErros(e);
    return Object.keys(e).length === 0;
  };

  const registrarEmprestimo = (ev) => {
    ev.preventDefault();
    if (!validar()) return;

    setRegistros((r) => [
      {
        id: Date.now(),
        nome: usuario.nome,
        email: usuario.email,
        item: itemSelecionado,
        tipo,
        dataEmprestimo,
        dataDevolucao,
      },
      ...r,
    ]);

    setUsuario({ nome: "", email: "" });
    setBusca("");
    setItemSelecionado(null);
    setDataEmprestimo(hoje);
    setErros({});
  };

  const inputClasse = (campo) => `input${erros[campo] ? " input--error" : ""}`;

  return (
    <div className="cadastro-emprestimo">
      <div className="card">
        <h1 className="title">Cadastro de Empréstimo</h1>

        <form onSubmit={registrarEmprestimo} className="form">
          {/* Dados do usuário */}
          <div className="field-row">
            <div className="field">
              <label className="label">Nome do usuário</label>
              <input
                className={inputClasse("nome")}
                value={usuario.nome}
                onChange={(e) => setUsuario((u) => ({ ...u, nome: e.target.value }))}
                placeholder="Nome completo"
              />
              {erros.nome && <p className="error-text">{erros.nome}</p>}
            </div>
            <div className="field">
              <label className="label">E-mail</label>
              <input
                type="email"
                className={inputClasse("email")}
                value={usuario.email}
                onChange={(e) => setUsuario((u) => ({ ...u, email: e.target.value }))}
                placeholder="usuario@email.com"
              />
              {erros.email && <p className="error-text">{erros.email}</p>}
            </div>
          </div>

          {/* Tipo de item */}
          <div className="field">
            <label className="label label--block">Tipo de item</label>
            <div className="type-selector">
              {[
                { valor: "livro", label: "Livro (14 dias)", Icon: BookOpen },
                { valor: "revista", label: "Revista (7 dias)", Icon: Newspaper },
              ].map(({ valor, label, Icon }) => (
                <button
                  type="button"
                  key={valor}
                  onClick={() => {
                    setTipo(valor);
                    setItemSelecionado(null);
                  }}
                  className={`type-button${tipo === valor ? " type-button--active" : ""}`}
                >
                  <Icon className="icon" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Busca por filtro */ }
          <div className="field">
            <label className="label">Buscar {tipo === "livro" ? "livro" : "revista"}</label>
            <div style={{ display: "flex", gap: "8px", width: "100%", alignItems: "center" }}>
              <select
                value={campoBusca}
                onChange={(e) => setCampoBusca(e.target.value)}
                className="select"
                style={{ width: "110px", minWidth: "110px", flexShrink: 0 }}
              >
                <option value="titulo">Título</option>
                <option value="autor">Autor</option>
                <option value="ano">Ano</option>
              </select>
              <div style={{ position: "relative", flex: 1, width: "100%" }}>
                <Search className="icon search-icon" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#a8a29e" }} />
                <input
                  value={busca}
                  onChange={(e) => {
                    setBusca(e.target.value);
                    setItemSelecionado(null);
                  }}
                  placeholder={`Buscar por ${campoBusca}...`}
                  className="input"
                  style={{ width: "100%", paddingLeft: "36px", boxSizing: "border-box" }}
                />
              </div>
            </div>
            {erros.item && <p className="error-text">{erros.item}</p>}

            {busca && (
              <ul className="results-list">
                {resultados.length === 0 && <li className="results-empty">Nenhum resultado encontrado.</li>}
                {resultados.map((item) => (
                  <li
                    key={item.id}
                    onClick={() => setItemSelecionado(item)}
                    className={`result-item${
                      itemSelecionado?.id === item.id ? " result-item--selected" : ""
                    }`}
                  >
                    <span>
                      {item.titulo} — {item.autor} ({item.ano})
                    </span>
                    {itemSelecionado?.id === item.id && <Check className="icon" />}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Datas */}
          <div className="field-row">
            <div className="field">
              <label className="label">Data do empréstimo</label>
              <input
                type="date"
                value={dataEmprestimo}
                onChange={(e) => setDataEmprestimo(e.target.value)}
                className="input"
              />
            </div>
            <div className="field">
              <label className="label">Data de devolução</label>
              <input type="date" disabled value={dataDevolucao} className="input input--readonly" />
            </div>
          </div>

          {/* Aviso de Penalidade */}
          <div className="warning-box" style={{ display: "flex", gap: "8px", alignItems: "flex-start", marginTop: "4px" }}>
            <AlertTriangle className="warning-icon" style={{ width: "18px", height: "18px", color: "#d97706", flexShrink: 0 }} />
            <p className="warning-text" style={{ fontSize: "0.8rem", color: "#78716c", margin: 0 }}>
              <strong>Penalidade caso não devolva:</strong> 30 dias sem efetuar novos empréstimos (proporcional ao tempo que ficou sem devolver).
            </p>
          </div>

          <button type="submit" className="submit-button">
            Registrar empréstimo
          </button>
        </form>

        {/* Empréstimos Registrados */}
        {registros.length > 0 && (
          <div className="registros-section">
            <h2 className="registros-title">Empréstimos registrados</h2>
            <ul className="registros-list">
              {registros.map((r) => (
                <li key={r.id} className="registro-item">
                  <div>
                    <p className="registro-nome">
                      {r.item.titulo} <span className="registro-tipo">({r.tipo})</span>
                    </p>
                    <p className="registro-contato">
                      {r.nome} · {r.email}
                    </p>
                  </div>
                  <div className="registro-datas">
                    <p>Empréstimo: {r.dataEmprestimo}</p>
                    <p>Devolução: {r.dataDevolucao}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}