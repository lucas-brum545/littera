CREATE TABLE revista (
	id		BIGSERIAL PRIMARY KEY,
	edicao	INTEGER NOT NULL,
	issn	VARCHAR(40) NOT NULL,
	mes_ano_publicacao	VARCHAR(30) NOT NULL
);

CREATE TABLE usuario (
	id	BIGSERIAL	PRIMARY KEY,
	nome	VARCHAR(40)	NOT NULL,
	telefone	VARCHAR(40)	NOT NULL,
	email	VARCHAR(40) NOT NULL,
	data_nascimento	DATE	NOT NULL,
	tipo_usuario	VARCHAR(255) NOT NULL DEFAULT 'LEITOR',
	quantidade_emprestada	INTEGER NOT NULL DEFAULT 0,
)

CREATE TABLE item_acervo (
    codigo INT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    ano INT,
	localizacao VARCHAR(50) not null,
    disponivel BOOLEAN	DEFAULT true
);

CREATE TABLE livro (
	codigo BIGSERIAL PRIMARY KEY NOT NULL,
	autor	VARCHAR(40)	NOT NULL,
	isbn	VARCHAR(13)	NOT NULL,
	genero	VARCHAR(40) NOT NULL,
	total_exemplares	INTEGER	NOT NULL,
	total_disponivel	INTEGER	NOT NULL,
	total_emprestados	INTEGER NOT NULL DEFAULT 0,
	renovacoes_utilizadas	INTEGER NOT NULL DEFAULT 0,
	nome_reservante	VARCHAR(40),
	quantidade_max_renovacoes	INTEGER	DEFAULT 2,
	CONSTRAINT fk_livro_item FOREIGN KEY (codigo) REFERENCES item_acervo(codigo) ON DELETE CASCADE
)

CREATE TABLE revista (
    codigo INT PRIMARY KEY,
    edicao VARCHAR(50),
    issn VARCHAR(50),
    mes_ano_publicacao VARCHAR(50),
    CONSTRAINT fk_revista_item FOREIGN KEY (codigo) REFERENCES item_acervo(codigo) ON DELETE CASCADE
)

CREATE TABLE administrador (
	id	BIGSERIAL	PRIMARY KEY,
	nome	VARCHAR(40)	NOT NULL,
	telefone	VARCHAR(40)	NOT NULL,
	email	VARCHAR(40)	NOT NULL,
	usuario	VARCHAR(40)	NOT NULL
)

CREATE TABLE reserva (
	id	BIGSERIAL	PRIMARY KEY,
	leitor_id	BIGSERIAL	NOT NULL,
	item_codigo	BIGSERIAL	NOT NULL,
	data_reserva	TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
	status	VARCHAR(50)	DEFAULT 'PENDENTE',
	usuario	VARCHAR(40)	NOT NULL,
	CONSTRAINT fk_reserva_leitor FOREIGN KEY (leitor_id) REFERENCES leitor(id),
    CONSTRAINT fk_reserva_item FOREIGN KEY (item_codigo) REFERENCES item_acervo(codigo),
	CONSTRAINT ck_reserva_status CHECK (status::text = ANY (ARRAY['PENDENTE'::character varying, 'CONCLUIDA'::character varying, 'CANCELADA'::character varying]::text[]));
)

CREATE TABLE emprestimo(
	codigo	BIGSERIAL	PRIMARY KEY,
	leitor_id	BIGSERIAL	NOT NULL,
	item_codigo	BIGSERIAL	NOT NULL,
	data_emprestimo	TIMESTAMPTZ	NOT NULL,
	data_devolucao	TIMESTAMPTZ	NOT NULL,
	CONSTRAINT fk_reserva_leitor FOREIGN KEY (leitor_id) REFERENCES leitor(id),
    CONSTRAINT fk_reserva_item FOREIGN KEY (item_codigo) REFERENCES item_acervo(codigo),
)


