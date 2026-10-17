import { Dialog, DialogContent, DialogTitle, Stack, DialogActions, Button, TextField } from "@mui/material";
import './DialogEmprestimos.css'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';

export default function DialogEmprestimos({ emprestimoParaEditar, onCancelar, onSalvar }) {
    const [dataEmprestimo, setDataEmprestimo] = useState(null);
    const [dataDevolucao, setDataDevolucao] = useState(null);
    const [formulario, setFormulario] = useState({
        codigoUsuario: '',
        codigoItemAcervo: '',
    });

    useEffect(() => {
        if (emprestimoParaEditar) {
            setFormulario({
                codigoUsuario: emprestimoParaEditar.codigoUsuario || '',
                codigoItemAcervo: emprestimoParaEditar.codigoItemAcervo || '',
            });
            setDataEmprestimo(
                emprestimoParaEditar.dataEmprestimo ? new Date(emprestimoParaEditar.dataEmprestimo) : null
            );
            setDataDevolucao(
                emprestimoParaEditar.dataDevolucao ? new Date(emprestimoParaEditar.dataDevolucao) : null
            );
        } else {
            setFormulario({ codigoUsuario: '', codigoItemAcervo: '' });
            setDataEmprestimo(null);
            setDataDevolucao(null);
        }
    }, [emprestimoParaEditar]);

    function handleChange(e) {
        const { name, value } = e.target;
        setFormulario({ ...formulario, [name]: value });
    }

    function enviar(event) {
        event.preventDefault();
        
        const emprestimo = {
            codigoUsuario: formulario.codigoUsuario,
            codigoItemAcervo: formulario.codigoItemAcervo,
            dataEmprestimo: dataEmprestimo ? dayjs(dataEmprestimo).format('YYYY-MM-DD') : null,
            dataDevolucao: dataDevolucao ? dayjs(dataDevolucao).format('YYYY-MM-DD') : null,
        };

        if (emprestimoParaEditar) {
            emprestimo.id = emprestimoParaEditar.id;
        }
        
        onSalvar(emprestimo);
    }

    return (
        <Dialog open fullWidth maxWidth="sm" onClose={onCancelar}
            sx={{ '& .MuiDialog-paper': { borderRadius: '10px', padding: '20px' } }}>
            <DialogTitle sx={{ fontWeight: 'bold', fontFamily: 'Arial', color: '#666' }}>
                {emprestimoParaEditar ? `Editar Empréstimo ID: ${emprestimoParaEditar.id}` : "Cadastrar Novo Empréstimo"}
            </DialogTitle>
            <DialogContent>
                {/* Substituído action por onSubmit para corrigir o warning */}
                <form onSubmit={enviar}>
                    <div className="campo-dialog">
                        <Stack spacing={2} sx={{ mt: 2 }}>
                            <div className="campo-dialog" style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>
                                <TextField 
                                    label="Codigo do usuário" 
                                    name="codigoUsuario" 
                                    required 
                                    value={formulario.codigoUsuario}
                                    onChange={handleChange}
                                    variant="outlined" 
                                    sx={{ background: 'white' }} 
                                />
                                <TextField 
                                    label="Código do item" 
                                    name="codigoItemAcervo" 
                                    required 
                                    value={formulario.codigoItemAcervo}
                                    onChange={handleChange}
                                    variant="outlined" 
                                    sx={{ background: 'white' }} 
                                />
                                <div className="campo-datepicker">
                                    <DatePicker
                                        selected={dataEmprestimo}
                                        required
                                        onChange={(date) => setDataEmprestimo(date)}
                                        dateFormat="dd/MM/yyyy"
                                        placeholderText="Selecione a data de empréstimo"
                                        className="input-datepicker-mui"
                                        wrapperClassName="date-picker-wrapper"
                                        showYearDropdown
                                        scrollableYearDropdown
                                        yearDropdownItemNumber={100}
                                    />
                                </div>
                                <div className="campo-datepicker">
                                    <DatePicker
                                        selected={dataDevolucao}
                                        required
                                        onChange={(date) => setDataDevolucao(date)}
                                        dateFormat="dd/MM/yyyy"
                                        placeholderText="Selecione a data de devolução"
                                        className="input-datepicker-mui"
                                        wrapperClassName="date-picker-wrapper"
                                        showYearDropdown
                                        scrollableYearDropdown
                                        yearDropdownItemNumber={100}
                                    />
                                </div>
                            </div>
                        </Stack>
                        <DialogActions sx={{ mt: 3 }}>
                            <Button type="button" onClick={onCancelar} sx={{ fontWeight: 'bold', fontFamily: 'Arial' }}>
                                Cancelar
                            </Button>
                            <Button type="submit" variant="contained" color="success" sx={{ fontWeight: 'bold', fontFamily: 'Arial' }}>
                                {emprestimoParaEditar ? "Atualizar" : "Cadastrar"}
                            </Button>
                        </DialogActions>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}