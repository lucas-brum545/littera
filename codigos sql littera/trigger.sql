CREATE OR REPLACE FUNCTION fn_emprestimo_inserido()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.data_devolucao IS NULL THEN
        UPDATE acervo
           SET disponivel = FALSE
         WHERE codigo = NEW.codigo_item_acervo
           AND disponivel = TRUE;
 
        IF NOT FOUND THEN
            RAISE EXCEPTION 'Item % não está disponível para empréstimo',
                NEW.codigo_item_acervo;
        END IF;
 
        UPDATE leitor
           SET quantidade_emprestada = quantidade_emprestada + 1
         WHERE id = NEW.codigo_leitor;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
 
CREATE TRIGGER trg_emprestimo_inserido
BEFORE INSERT ON emprestimo
FOR EACH ROW EXECUTE FUNCTION fn_emprestimo_inserido();
 

CREATE OR REPLACE FUNCTION fn_emprestimo_devolvido()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.data_devolucao IS NULL AND NEW.data_devolucao IS NOT NULL THEN
        UPDATE acervo
           SET disponivel = TRUE
         WHERE codigo = NEW.codigo_item_acervo;
 
        UPDATE leitor
           SET quantidade_emprestada = quantidade_emprestada - 1
         WHERE id = NEW.codigo_leitor;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
 
CREATE TRIGGER trg_emprestimo_devolvido
AFTER UPDATE OF data_devolucao ON emprestimo
FOR EACH ROW EXECUTE FUNCTION fn_emprestimo_devolvido();
 