CREATE TABLE leitor (
    id                    SERIAL PRIMARY KEY,
    nome                  VARCHAR(100) NOT NULL,
    telefone              VARCHAR(20),
    email                 VARCHAR(120) UNIQUE,
    quantidade_emprestada INTEGER NOT NULL DEFAULT 0
        CONSTRAINT ck_qtd_emprestada CHECK (quantidade_emprestada >= 0)
);