import { useEffect, useMemo, useState } from "react";
import "./GerenciamentoReservas.css";
import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";
import { CircularProgress } from "@mui/material";
import dayjs from "dayjs";

import {
  atualizarReserva,
  criarReserva,
  excluirReservaApi,
  listarReservas,
} from "../../services/api";

import { CiBookmarkCheck } from "react-icons/ci";
import DialogReservas from "../../components/DialogReservas/DialogReservas";

export default function GerenciamentoReservas() {
  const [pesquisa, setPesquisa] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [exibirDialog, setExibirDialog] = useState(false);
  const [reservaParaEditar, setReservaParaEditar] = useState(null);
  const [reservas, setReservas] = useState([]);
  const [feedback, setFeedback] = useState({
    mensagem: "",
    tipo: "",
  });

  function normalizar(texto) {
    return String(texto ?? "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  const reservasFiltradas = useMemo(() => {
    const termo = normalizar(pesquisa.trim());

    if (!termo) {
      return reservas;
    }

    return reservas.filter((reserva) =>
      [
        reserva.id,
        reserva.nomeUsuario,
        reserva.tituloItemAcervo,
        reserva.status,
      ].some((campo) => normalizar(campo).includes(termo))
    );
  }, [reservas, pesquisa]);

  async function fetchReservas() {
    setErro("");
    setCarregando(true);

    try {
      const data = await listarReservas();

      if (!Array.isArray(data)) {
        throw new Error(
          "A API retornou um formato inesperado para as reservas."
        );
      }

      setReservas(data);
      return true;
    } catch (error) {
      console.error("Erro ao buscar reservas:", error);

      setErro(
        error.response?.data?.message ||
          error.response?.data?.erro ||
          error.message ||
          "Erro ao carregar reservas. Tente novamente."
      );

      return false;
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    let ativo = true;

    async function carregarReservas() {
      try {
        const data = await listarReservas();

        if (!ativo) return;

        if (!Array.isArray(data)) {
          throw new Error(
            "A API retornou um formato inesperado para as reservas."
          );
        }

        setReservas(data);
        setErro("");
      } catch (error) {
        if (!ativo) return;

        console.error("Erro ao buscar reservas:", error);

        setErro(
          error.response?.data?.message ||
            error.response?.data?.erro ||
            error.message ||
            "Erro ao carregar reservas. Tente novamente."
        );
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    carregarReservas();

    return () => {
      ativo = false;
    };
  }, []);

  useEffect(() => {
    if (!feedback.mensagem) {
      return;
    }

    const temporizador = setTimeout(() => {
      setFeedback({ mensagem: "", tipo: "" });
    }, 5000);

    return () => clearTimeout(temporizador);
  }, [feedback]);

  function abrirCadastro() {
    setReservaParaEditar(null);
    setExibirDialog(true);
  }

  function editarReserva(reserva) {
    setReservaParaEditar(reserva);
    setExibirDialog(true);
  }

  async function salvarReserva(dados) {
    try {
      if (reservaParaEditar) {
        await atualizarReserva(reservaParaEditar.id, dados);

        setFeedback({
          mensagem: "Reserva atualizada com sucesso!",
          tipo: "success",
        });
      } else {
        await criarReserva(dados);

        setFeedback({
          mensagem: "Reserva cadastrada com sucesso!",
          tipo: "success",
        });
      }

      setExibirDialog(false);
      setReservaParaEditar(null);

      await fetchReservas();
    } catch (error) {
      console.error("Erro ao salvar reserva:", error);

      setFeedback({
        mensagem:
          error.response?.data?.message ||
          error.response?.data?.erro ||
          error.message ||
          "Erro ao salvar reserva.",
        tipo: "error",
      });
    }
  }

  async function excluirReserva(id) {
    const confirmar = window.confirm(
      "Deseja realmente excluir esta reserva?"
    );

    if (!confirmar) {
      return;
    }

    try {
      await excluirReservaApi(id);

      setReservas((atuais) =>
        atuais.filter((reserva) => reserva.id !== id)
      );

      setFeedback({
        mensagem: "Reserva excluída com sucesso!",
        tipo: "success",
      });
    } catch (error) {
      console.error("Erro ao excluir reserva:", error);

      setFeedback({
        mensagem:
          error.response?.data?.message ||
          error.response?.data?.erro ||
          "Erro ao excluir reserva.",
        tipo: "error",
      });
    }
  }

  return (
    <div className="content-wrap">
      {feedback.mensagem && (
        <div style={{ marginBottom: "20px" }}>
          <Alert
            variant="filled"
            severity={feedback.tipo}
            icon={
              feedback.tipo === "success" ? (
                <CheckIcon fontSize="inherit" />
              ) : undefined
            }
          >
            {feedback.mensagem}
          </Alert>
        </div>
      )}

      <div className="gerenciamento-emprestimos">
        <div className="cabecalho-emprestimos">
          <h1>Gerenciamento de Reservas</h1>

          <CiBookmarkCheck className="icon" />

          <p>Cadastre, pesquise, edite ou exclua reservas.</p>

          {exibirDialog && (
            <DialogReservas
              key={reservaParaEditar?.id ?? "nova-reserva"}
              reservaParaEditar={reservaParaEditar}
              onSalvar={salvarReserva}
              onCancelar={() => {
                setExibirDialog(false);
                setReservaParaEditar(null);
              }}
            />
          )}

          <div className="container-botoes">
            <button
              type="button"
              className="botao-novo"
              onClick={abrirCadastro}
            >
              Cadastrar Nova Reserva
            </button>
          </div>
        </div>

        <div className="barra-pesquisa">
          <input
            type="text"
            placeholder="Pesquisar reserva por nome do usuário, título do item ou status"
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
          />
        </div>

        {erro && (
          <div style={{ marginTop: "15px" }}>
            <Alert
              severity="error"
              action={
                <button type="button" onClick={fetchReservas}>
                  Tentar novamente
                </button>
              }
            >
              {erro}
            </Alert>
          </div>
        )}

        {carregando ? (
          <div className="aviso-tela">
            <CircularProgress size="3rem" />
            <p>Carregando reservas...</p>
          </div>
        ) : (
          <div className="tabela-container">
            <table>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nome do usuário</th>
                  <th>Título do item</th>
                  <th>Data de Reserva</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {reservasFiltradas.length > 0 ? (
                  reservasFiltradas.map((reserva) => (
                    <tr key={reserva.id}>
                      <td>{reserva.id}</td>

                      <td>{reserva.nomeUsuario || "Não informado"}</td>

                      <td>
                        {reserva.tituloItemAcervo || "Não informado"}
                      </td>

                      <td>
                        {reserva.dataReserva &&
                        dayjs(reserva.dataReserva).isValid()
                          ? dayjs(reserva.dataReserva).format("DD/MM/YYYY")
                          : "Não informada"}
                      </td>

                      <td>{reserva.status}</td>

                      <td className="acoes">
                        <button
                          type="button"
                          className="botao-editar"
                          onClick={() => editarReserva(reserva)}
                        >
                          Editar
                        </button>

                        <button
                          type="button"
                          className="botao-excluir"
                          onClick={() => excluirReserva(reserva.id)}
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="nenhum-emprestimo">
                      {pesquisa.trim()
                        ? "Nenhuma reserva encontrada para essa pesquisa."
                        : "Nenhuma reserva cadastrada."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}