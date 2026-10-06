CREATE TABLE emprestimo (
    codigo             SERIAL PRIMARY KEY,
    codigo_leitor      INTEGER NOT NULL,
    codigo_item_acervo INTEGER NOT NULL,
    data_emprestimo    DATE NOT NULL DEFAULT CURRENT_DATE,
    data_devolucao     DATE,  
 
    CONSTRAINT fk_emprestimo_leitor
        FOREIGN KEY (codigo_leitor)
        REFERENCES leitor (id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
 
    CONSTRAINT fk_emprestimo_acervo
        FOREIGN KEY (codigo_item_acervo)
        REFERENCES acervo (codigo)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
 
    CONSTRAINT ck_datas
        CHECK (data_devolucao IS NULL OR data_devolucao >= data_emprestimo)
);
 
CREATE INDEX idx_emprestimo_leitor ON emprestimo (codigo_leitor);
CREATE INDEX idx_emprestimo_item   ON emprestimo (codigo_item_acervo);
 

CREATE UNIQUE INDEX uq_item_emprestado
    ON emprestimo (codigo_item_acervo)
    WHERE data_devolucao IS NULL;

   