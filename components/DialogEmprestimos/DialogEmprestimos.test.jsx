import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import * as matchers from "@testing-library/jest-dom/matchers";
import DialogEmprestimos from "./DialogEmprestimos";

expect.extend(matchers);

describe("DialogEmprestimos Component", () => {
  it("deve renderizar o modal corretamente quando aberto", () => {
    const handleClose = vi.fn();
    const handleSave = vi.fn();

    render(
      <DialogEmprestimos
        open={true}
        onClose={handleClose}
        onSave={handleSave}
      />,
    );

    
    expect(
      screen.getByRole("heading", { name: /cadastrar novo empréstimo/i }),
    ).toBeInTheDocument();
  });
});
