import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import * as matchers from "@testing-library/jest-dom/matchers";
import GerenciamentoEmprestimo from "./GerenciamentoEmprestimo";

expect.extend(matchers);

vi.mock("../../services/api", () => ({
  listarEmprestimos: vi.fn(() =>
    Promise.resolve([
      {
        codigo: 1,
        nomeUsuario: "João Silva",
        tituloItemAcervo: "Clean Code",
        dataEmprestimo: "2026-05-01",
        dataDevolucaoPrevista: "2026-05-15",
      },
    ]),
  ),
  atualizarEmprestimo: vi.fn(),
  criarEmprestimo: vi.fn(),
  excluirEmprestimoApi: vi.fn(),
}));

describe("GerenciamentoEmprestimo Page", () => {
  it("deve carregar e exibir a lista de empréstimos na tabela", async () => {
    render(
      <BrowserRouter>
        <GerenciamentoEmprestimo />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Clean Code")).toBeInTheDocument();
      expect(screen.getByText("João Silva")).toBeInTheDocument();
    });
  });
});
