CREATE TABLE acervo (
    codigo             SERIAL PRIMARY KEY,
    titulo             VARCHAR(200) NOT NULL,
    ano                INTEGER CHECK (ano > 0),
    disponivel         BOOLEAN NOT NULL DEFAULT TRUE,
    tipo               VARCHAR(10) NOT NULL
        CONSTRAINT ck_tipo CHECK (tipo IN ('LIVRO', 'REVISTA')),
 
    -- campos de LIVRO
    autor              VARCHAR(100),
    isbn               VARCHAR(20) UNIQUE,
    genero             VARCHAR(50),
 
    -- campos de REVISTA
    edicao             VARCHAR(30),
    mes_ano_publicacao DATE, 
 
   
    CONSTRAINT ck_campos_por_tipo CHECK (
        (tipo = 'LIVRO'   AND autor IS NOT NULL
                          AND edicao IS NULL
                          AND mes_ano_publicacao IS NULL)
        OR
        (tipo = 'REVISTA' AND autor IS NULL AND isbn IS NULL
                          AND genero IS NULL)
    )
);