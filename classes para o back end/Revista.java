
  
CREATE TABLE revista(
   id integer PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    editora VARCHAR(100),
    data_publicacao DATE,
    edicao INTEGER,
    preco NUMERIC(10, 2),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);