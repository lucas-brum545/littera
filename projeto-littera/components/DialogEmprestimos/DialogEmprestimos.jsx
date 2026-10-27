import { Dialog, DialogContent, DialogTitle, Stack, DialogActions, Button, TextField, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import './DialogEmprestimos.css'
import DatePicker from 'react-datepicker';
import Autocomplete from '@mui/material/Autocomplete';
import 'react-datepicker/dist/react-datepicker.css';
import { useState, useEffect } from 'react';
import { listarUsuarios, listarItensAcervo } from "../../services/api";
import dayjs from 'dayjs';

export default function DialogEmprestimos({ emprestimoParaEditar, onCancelar, onSalvar }) {
    const [dataEmprestimo, setDataEmprestimo] = useState(null);
    const [dataDevolucaoReal, setDataDevolucaoReal] = useState(null);
    const [formulario, setFormulario] = useState({
        codigoUsuario: '',
        codigoItemAcervo: '',
    });
    const [tipo, setTipo] = useState('LIVRO');
    const [usuarios, setUsuarios] = useState([]);
    const [itensAcervo, setItensAcervo] = useState([]);

    // carregar usuarios para selecao
    useEffect(() => {
        async function carregarUsuarios() {
            try {
                setUsuarios(await listarUsuarios());
            } catch (error) {
                console.error('Erro ao buscar usuários:', error);
            }
        }
        carregarUsuarios();
    }, []);

    // carregar acervo para selecao
    useEffect(() => {
        async function carregarAcervo() {
            try {
                setItensAcervo(await listarItensAcervo());
            } catch (error) {
                console.error('Erro ao buscar acervo:', error);
            }
        }
        carregarAcervo();
    }, []);

    useEffect(() => {
        if (emprestimoParaEditar) {
            setFormulario({
                codigoUsuario: emprestimoParaEditar.codigoUsuario || '',
                codigoItemAcervo: emprestimoParaEditar.codigoItemAcervo || '',
            });
            setDataEmprestimo(
                emprestimoParaEditar.dataEmprestimo ? dayjs(emprestimoParaEditar.dataEmprestimo).toDate() : null
            );
            setDataDevolucaoReal(
                emprestimoParaEditar.dataDevolucaoReal ? dayjs(emprestimoParaEditar.dataDevolucaoReal).toDate() : null
            );
        } else {
            setFormulario({ codigoUsuario: '', codigoItemAcervo: '' });
            setDataEmprestimo(new Date());
            setDataDevolucaoReal(null);
        }
    }, [emprestimoParaEditar]);

    // Na edição, descobre o tipo do item emprestado para mostrar a lista certa
    useEffect(() => {
        if (emprestimoParaEditar && itensAcervo.length > 0) {
            const item = itensAcervo.find((i) => i.codigo === Number(emprestimoParaEditar.codigoItemAcervo));
            if (item) setTipo(item.tipo);
        }
    }, [emprestimoParaEditar, itensAcervo]);

    // Na edição o item emprestado pode estar indisponível; no cadastro só os disponíveis
    const opcoesItens = itensAcervo.filter(
        (i) => i.tipo === tipo && (i.disponivel || emprestimoParaEditar)
    );

    const rotuloItem = (i) =>
        i.tipo === 'LIVRO'
            ? `${i.titulo} - ${i.autor} (${i.genero})`
            : `${i.titulo} - ed. ${i.edicao}`;

    function trocarTipo(e) {
        setTipo(e.target.value);
        setFormulario({ ...formulario, codigoItemAcervo: '' }); // limpa o item da outra categoria
    }

    function enviar(event) {
        event.preventDefault();

        const emprestimo = {
            codigoUsuario: formulario.codigoUsuario,
            codigoItemAcervo: formulario.codigoItemAcervo,
            dataEmprestimo: dataEmprestimo ? dayjs(dataEmprestimo).format('YYYY-MM-DD') : null,
            dataDevolucao: dataDevolucaoReal ? dayjs(dataDevolucaoReal).format('YYYY-MM-DD') : null,
        };

        if (emprestimoParaEditar) {
            emprestimo.id = emprestimoParaEditar.id;
        }

        onSalvar(emprestimo);
    }

    return (
        <Dialog open fullWidth maxWidth="sm" onClose={onCancelar}
            sx={{ '& .MuiDialog-paper': { borderRadius: '10px', padding: '20px', height:'1000px'} }}>
            <DialogTitle sx={{ fontWeight: 'bold', fontFamily: 'Arial', color: '#666' }}>
                {emprestimoParaEditar ? `Registrar Devolução / Editar Empréstimo ID: ${emprestimoParaEditar.id}` : "Cadastrar Novo Empréstimo"}
            </DialogTitle>
            <DialogContent>
                <form onSubmit={enviar}>
                    <Stack spacing={2} sx={{ mt: 2 }}>
                        <Autocomplete
                            disablePortal
                            options={usuarios}
                            getOptionLabel={(u) => `${u.nome} (${u.email})`}
                            isOptionEqualToValue={(opcao, valor) => opcao.id === valor.id}
                            value={usuarios.find((u) => u.id === Number(formulario.codigoUsuario)) || null}
                            onChange={(e, usuario) =>
                                setFormulario({ ...formulario, codigoUsuario: usuario ? usuario.id : '' })
                            }
                            disabled={!!emprestimoParaEditar}
                            renderInput={(params) => <TextField {...params} label="Selecionar usuário" required />}
                        />

                        <FormControl fullWidth disabled={!!emprestimoParaEditar}>
                            <InputLabel id="tipo-item-label">Tipo de item</InputLabel>
                            <Select
                                labelId="tipo-item-label"
                                label="Tipo de item"
                                value={tipo}
                                onChange={trocarTipo}
                            >
                                <MenuItem value="LIVRO">Livro</MenuItem>
                                <MenuItem value="REVISTA">Revista</MenuItem>
                            </Select>
                        </FormControl>

                        <Autocomplete
                            disablePortal
                            options={opcoesItens}
                            getOptionLabel={rotuloItem}
                            isOptionEqualToValue={(opcao, valor) => opcao.codigo === valor.codigo}
                            value={opcoesItens.find((i) => i.codigo === Number(formulario.codigoItemAcervo)) || null}
                            onChange={(e, item) =>
                                setFormulario({ ...formulario, codigoItemAcervo: item ? item.codigo : '' })
                            }
                            disabled={!!emprestimoParaEditar}
                            noOptionsText="Nenhum item disponível"
                            renderInput={(params) => (
                                <TextField {...params} label={tipo === 'LIVRO' ? 'Selecionar livro' : 'Selecionar revista'} required />
                            )}
                        />

                        <label style={{ fontSize: '14px', color: '#666', fontWeight: 'bold' }}>Data do Empréstimo</label>
                        <div className="campo-datepicker">
                            <DatePicker
                                selected={dataEmprestimo}
                                onChange={(date) => setDataEmprestimo(date)}
                                dateFormat="dd/MM/yyyy"
                                placeholderText="Selecione a data de empréstimo"
                                className="input-datepicker-mui"
                                wrapperClassName="date-picker-wrapper"
                                disabled={!!emprestimoParaEditar}
                            />
                        </div>

                        {emprestimoParaEditar && (
                            <>
                                <label style={{ fontSize: '14px', color: '#666', fontWeight: 'bold' }}>Data Real de Devolução (Baixa)</label>
                                <div className="campo-datepicker">
                                    <DatePicker
                                        selected={dataDevolucaoReal}
                                        onChange={(date) => setDataDevolucaoReal(date)}
                                        dateFormat="dd/MM/yyyy"
                                        placeholderText="Selecione a data em que o item foi devolvido"
                                        className="input-datepicker-mui"
                                        wrapperClassName="date-picker-wrapper"
                                        showYearDropdown
                                        scrollableYearDropdown
                                    />
                                </div>
                            </>
                        )}

                        {emprestimoParaEditar && emprestimoParaEditar.dataDevolucaoPrevista && (
                            <TextField
                                label="Data Prevista de Devolução (Regra)"
                                value={dayjs(emprestimoParaEditar.dataDevolucaoPrevista).format('DD/MM/YYYY')}
                                disabled
                                fullWidth
                            />
                        )}
                    </Stack>

                    <DialogActions sx={{ mt: 3 }}>
                        <Button type="button" onClick={onCancelar} sx={{ fontWeight: 'bold', fontFamily: 'Arial' }}>
                            Cancelar
                        </Button>
                        <Button type="submit" variant="contained" color="success" sx={{ fontWeight: 'bold', fontFamily: 'Arial' }}>
                            {emprestimoParaEditar ? "Concluir / Salvar" : "Cadastrar Empréstimo"}
                        </Button>
                    </DialogActions>
                </form>
            </DialogContent>
        </Dialog>
    );
}