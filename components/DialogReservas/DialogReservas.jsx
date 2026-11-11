import {
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Autocomplete,
  Alert,
  CircularProgress,
} from "@mui/material";

import { useState, useEffect } from "react";

import {
  listarItensAcervo,
  listarUsuarios,
} from "../../services/api";

export default function DialogReservas({
  reservaParaEditar,
  onCancelar,
  onSalvar,
}) {
  const [formulario, setFormulario] = useState({
    usuarioId: reservaParaEditar?.usuarioId ?? "",
    itemCodigo: reservaParaEditar?.itemCodigo ?? "",
    status: reservaParaEditar?.status || "PENDENTE",
  });

  const [tipo, setTipo] = useState("LIVRO");
  const [usuarios, setUsuarios] = useState([]);
  const [itensAcervo, setItensAcervo] = useState([]);

  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erroCarregamento, setErroCarregamento] = useState("");
  const [erroFormulario, setErroFormulario] = useState("");

  // Carrega usuários e itens do acervo.
  useEffect(() => {
    async function carregarDados() {
      try {
        setCarregando(true);
        setErroCarregamento("");

        const [dadosUsuarios, dadosAcervo] = await Promise.all([
          listarUsuarios(),
          listarItensAcervo(),
        ]);

        if (!Array.isArray(dadosUsuarios)) {
          throw new Error("Formato inesperado na lista de usuários.");
        }

        if (!Array.isArray(dadosAcervo)) {
          throw new Error("Formato inesperado na lista do acervo.");
        }

        setUsuarios(dadosUsuarios);
        setItensAcervo(dadosAcervo);
      } catch (error) {
        console.error("Erro ao carregar dados da reserva:", error);

        setErroCarregamento(
          error.response?.data?.message ||
            error.response?.data?.erro ||
            error.message ||
            "Não foi possível carregar os dados necessários."
        );
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, []);

  // Identifica o tipo do item da reserva que está sendo editada.
  const itemDaReserva = reservaParaEditar
    ? itensAcervo.find(
        (item) =>
          String(item.codigo) ===
          String(reservaParaEditar.itemCodigo)
      )
    : null;

  const tipoAtual = reservaParaEditar
    ? itemDaReserva?.tipo || tipo
    : tipo;

  // Filtra os itens conforme o tipo selecionado.
  const opcoesItens = itensAcervo.filter(
    (item) => item.tipo === tipoAtual
  );

  // Formata a descrição dos itens do acervo.
  function rotuloItem(item) {
    if (item.tipo === "LIVRO") {
      return `${item.titulo} - ${
        item.autor || "Autor desconhecido"
      } (${item.genero || "Gênero não informado"})`;
    }

    return `${item.titulo} - ed. ${item.edicao || "Não informada"}`;
  }

  // Atualiza o tipo e limpa o item anteriormente selecionado.
  function trocarTipo(event) {
    setTipo(event.target.value);

    setFormulario((atual) => ({
      ...atual,
      itemCodigo: "",
    }));

    setErroFormulario("");
  }

  // Atualiza os campos controlados do formulário.
  function handleChange(event) {
    const { name, value } = event.target;

    setFormulario((atual) => ({
      ...atual,
      [name]: value,
    }));

    setErroFormulario("");
  }

  // Valida e envia os dados da reserva.
  async function enviar(event) {
    event.preventDefault();

    if (!formulario.usuarioId) {
      setErroFormulario("Selecione um usuário.");
      return;
    }

    if (!formulario.itemCodigo) {
      setErroFormulario("Selecione um item do acervo.");
      return;
    }

    if (
      reservaParaEditar &&
      !["PENDENTE", "CONCLUIDA"].includes(formulario.status)
    ) {
      setErroFormulario("Selecione um status válido.");
      return;
    }

    const reserva = {
      usuarioId: formulario.usuarioId,
      itemCodigo: formulario.itemCodigo,
      status: reservaParaEditar
        ? formulario.status
        : "PENDENTE",
    };

    if (reservaParaEditar) {
      reserva.id = reservaParaEditar.id;
    }

    try {
      setSalvando(true);
      setErroFormulario("");

      const resultado = await onSalvar(reserva);

      if (resultado === false) {
        return;
      }
    } catch (error) {
      console.error("Erro ao enviar reserva:", error);

      setErroFormulario(
        error.response?.data?.message ||
          error.response?.data?.erro ||
          "Não foi possível salvar a reserva."
      );
    } finally {
      setSalvando(false);
    }
  }

  return (
    <Dialog
      open
      fullWidth
      maxWidth="sm"
      onClose={salvando ? undefined : onCancelar}
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "10px",
          padding: "20px",
          minHeight: "400px",
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: "bold",
          fontFamily: "Arial",
          color: "#666",
        }}
      >
        {reservaParaEditar
          ? `Editar Reserva ID: ${reservaParaEditar.id}`
          : "Cadastrar Nova Reserva"}
      </DialogTitle>

      <DialogContent>
        {carregando ? (
          <Stack
            alignItems="center"
            justifyContent="center"
            spacing={2}
            sx={{ padding: 4 }}
          >
            <CircularProgress />
            <p>Carregando usuários e itens do acervo...</p>
          </Stack>
        ) : erroCarregamento ? (
          <Alert severity="error" sx={{ mt: 2 }}>
            {erroCarregamento}
          </Alert>
        ) : (
          <form onSubmit={enviar}>
            <Stack spacing={2} sx={{ mt: 2 }}>
              {erroFormulario && (
                <Alert severity="error">
                  {erroFormulario}
                </Alert>
              )}

              {/* Seleção do usuário */}
              <Autocomplete
                disablePortal
                options={usuarios}
                getOptionLabel={(usuario) =>
                  `${usuario.nome || usuario.username || "Usuário"} (${
                    usuario.email || ""
                  })`
                }
                isOptionEqualToValue={(opcao, valor) =>
                  String(opcao.id) === String(valor.id)
                }
                value={
                  usuarios.find(
                    (usuario) =>
                      String(usuario.id) ===
                      String(formulario.usuarioId)
                  ) || null
                }
                onChange={(event, usuario) =>
                  setFormulario((atual) => ({
                    ...atual,
                    usuarioId: usuario ? usuario.id : "",
                  }))
                }
                disabled={!!reservaParaEditar || salvando}
                noOptionsText="Nenhum usuário encontrado"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Selecionar usuário"
                    required
                  />
                )}
              />

              {/* Seleção do tipo de item */}
              <FormControl
                fullWidth
                disabled={!!reservaParaEditar || salvando}
              >
                <InputLabel id="tipo-item-label">
                  Tipo de item
                </InputLabel>

                <Select
                  labelId="tipo-item-label"
                  label="Tipo de item"
                  value={tipoAtual}
                  onChange={trocarTipo}
                >
                  <MenuItem value="LIVRO">Livro</MenuItem>
                  <MenuItem value="REVISTA">Revista</MenuItem>
                </Select>
              </FormControl>

              {/* Seleção do livro ou revista */}
              <Autocomplete
                disablePortal
                options={opcoesItens}
                getOptionLabel={rotuloItem}
                isOptionEqualToValue={(opcao, valor) =>
                  String(opcao.codigo) === String(valor.codigo)
                }
                value={
                  opcoesItens.find(
                    (item) =>
                      String(item.codigo) ===
                      String(formulario.itemCodigo)
                  ) || null
                }
                onChange={(event, item) =>
                  setFormulario((atual) => ({
                    ...atual,
                    itemCodigo: item ? item.codigo : "",
                  }))
                }
                disabled={!!reservaParaEditar || salvando}
                noOptionsText="Nenhum item encontrado para este tipo"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={
                      tipoAtual === "LIVRO"
                        ? "Selecionar livro"
                        : "Selecionar revista"
                    }
                    required
                  />
                )}
              />

              {/* Status disponível somente durante a edição */}
              {reservaParaEditar && (
                <FormControl fullWidth disabled={salvando}>
                  <InputLabel id="status-label">
                    Status
                  </InputLabel>

                  <Select
                    labelId="status-label"
                    name="status"
                    value={formulario.status}
                    onChange={handleChange}
                    label="Status"
                  >
                    <MenuItem value="PENDENTE">
                      Pendente
                    </MenuItem>

                    <MenuItem value="CONCLUIDA">
                      Concluída
                    </MenuItem>
                  </Select>
                </FormControl>
              )}
            </Stack>

            <DialogActions sx={{ mt: 3 }}>
              <Button
                type="button"
                onClick={onCancelar}
                disabled={salvando}
                sx={{
                  fontWeight: "bold",
                  fontFamily: "Arial",
                }}
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                color="success"
                variant="contained"
                disabled={salvando}
                sx={{
                  fontWeight: "bold",
                  fontFamily: "Arial",
                }}
              >
                {salvando
                  ? "Salvando..."
                  : reservaParaEditar
                    ? "Atualizar"
                    : "Cadastrar"}
              </Button>
            </DialogActions>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}