DROP TABLE IF EXISTS revista CASCADE;
DROP TABLE IF EXISTS livro CASCADE;
DROP TABLE IF EXISTS reserva CASCADE;
DROP TABLE IF EXISTS emprestimo CASCADE;
DROP TABLE IF EXISTS item_acervo CASCADE;
DROP TABLE IF EXISTS usuario CASCADE;

CREATE TABLE usuario (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    telefone VARCHAR(30) NOT NULL,
    data_nascimento DATE NOT NULL,
    senha_hash VARCHAR(72),
    tipo_usuario VARCHAR(6) NOT NULL DEFAULT 'LEITOR',
    quantidade_emprestada INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT ck_usuario_tipo_usuario CHECK (tipo_usuario IN ('LEITOR', 'ADMIN'))
);

CREATE TABLE item_acervo (
    codigo BIGSERIAL PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    ano INTEGER,
    disponivel BOOLEAN NOT NULL DEFAULT TRUE,
    tipo VARCHAR(10) NOT NULL,
    localizacao VARCHAR(50) NOT NULL,
    CONSTRAINT ck_tipo CHECK (tipo IN ('LIVRO', 'REVISTA'))
);

CREATE TABLE livro (
    codigo BIGINT PRIMARY KEY,
    autor VARCHAR(100) NOT NULL,
    isbn VARCHAR(20) NOT NULL,
    genero VARCHAR(50) NOT NULL,
    total_exemplares INTEGER NOT NULL DEFAULT 1,
    total_disponivel INTEGER NOT NULL DEFAULT 1,
    total_emprestados INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT fk_livro_item FOREIGN KEY (codigo) REFERENCES item_acervo(codigo) ON DELETE CASCADE
);

CREATE TABLE revista (
    codigo BIGSERIAL PRIMARY KEY,
    edicao VARCHAR(10) NOT NULL,
    issn VARCHAR(20) NOT NULL,
    mes_ano_publicacao VARCHAR(7),
    CONSTRAINT fk_revista_item FOREIGN KEY (codigo) REFERENCES item_acervo(codigo) ON DELETE CASCADE
);

CREATE TABLE reserva (
    id BIGSERIAL PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    item_codigo BIGINT NOT NULL,
    data_reserva DATE DEFAULT CURRENT_DATE,
    status VARCHAR(9) DEFAULT 'PENDENTE',
    CONSTRAINT fk_reserva_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id),
    CONSTRAINT fk_reserva_item FOREIGN KEY (item_codigo) REFERENCES item_acervo(codigo),
    CONSTRAINT ck_reserva_status CHECK (status IN ('PENDENTE', 'CONCLUIDA', 'CANCELADA'))
);

CREATE TABLE emprestimo (
    codigo BIGSERIAL PRIMARY KEY,
    codigo_usuario BIGINT NOT NULL,
    codigo_item_acervo BIGINT NOT NULL,
    data_emprestimo DATE NOT NULL DEFAULT CURRENT_DATE,
    data_devolucao DATE,  

    CONSTRAINT fk_emprestimo_usuario
        FOREIGN KEY (codigo_usuario)
        REFERENCES usuario (id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_emprestimo_item_acervo
        FOREIGN KEY (codigo_item_acervo)
        REFERENCES item_acervo (codigo)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT ck_datas
        CHECK (data_devolucao IS NULL OR data_devolucao >= data_emprestimo)
);

CREATE INDEX idx_emprestimo_usuario ON emprestimo (codigo_usuario);
CREATE INDEX idx_emprestimo_item ON emprestimo (codigo_item_acervo);

CREATE UNIQUE INDEX uq_item_emprestado
    ON emprestimo (codigo_item_acervo)
    WHERE data_devolucao IS NULL;