import { Dialog, DialogContent, DialogTitle, Stack, DialogActions, Button, TextField } from "@mui/material";
import './DialogEmprestimos.css'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';

export default function DialogEmprestimos({ emprestimoParaEditar, onCancelar, onSalvar }) {
    const [dataEmprestimo, setDataEmprestimo] = useState(null);
    const [dataDevolucaoReal, setDataDevolucaoReal] = useState(null);
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
            // Carrega a data real se já tiver sido devolvido, ou deixa vazia para preenchimento
            setDataDevolucaoReal(
                emprestimoParaEditar.dataDevolucaoReal ? new Date(emprestimoParaEditar.dataDevolucaoReal) : null
            );
        } else {
            setFormulario({ codigoUsuario: '', codigoItemAcervo: '' });
            setDataEmprestimo(new Date()); // Sugere a data de hoje para novo empréstimo
            setDataDevolucaoReal(null);   // Empréstimo novo começa sem devolução real
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
            // Envia a data real de devolução apenas quando estiver a dar baixa
            dataDevolucao: dataDevolucaoReal ? dayjs(dataDevolucaoReal).format('YYYY-MM-DD') : null,
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
                {emprestimoParaEditar ? `Registar Devolução / Editar Empréstimo ID: ${emprestimoParaEditar.id}` : "Cadastrar Novo Empréstimo"}
            </DialogTitle>
            <DialogContent>
                <form onSubmit={enviar}>
                    <div className="campo-dialog">
                        <Stack spacing={2} sx={{ mt: 2 }}>
                            <div className="campo-dialog" style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>     
                                <TextField 
                                    label="Código do Usuário" 
                                    name="codigoUsuario" 
                                    required 
                                    value={formulario.codigoUsuario}
                                    onChange={handleChange}
                                    variant="outlined" 
                                    disabled={!!emprestimoParaEditar} // Se for edição, o usuário/item não devem ser trocados, apenas devolvidos
                                    sx={{ background: 'white' }} 
                                />          
                                <TextField 
                                    label="Código do Item" 
                                    name="codigoItemAcervo" 
                                    required 
                                    value={formulario.codigoItemAcervo}
                                    onChange={handleChange}
                                    variant="outlined" 
                                    disabled={!!emprestimoParaEditar} // Impede trocar o livro num empréstimo já existente
                                    sx={{ background: 'white' }} 
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
                                        disabled={!!emprestimoParaEditar} // Geralmente a data de empréstimo original não se altera
                                    />
                                </div>
                                {/* Se estiver a editar/dar baixa, mostra o campo da Data Real de Devolução */}
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
                                {/* Informação apenas de leitura da Data Prevista (se já estiver em edição) */}
                                {emprestimoParaEditar && emprestimoParaEditar.dataDevolucaoPrevista && (
                                    <TextField
                                        label="Data Prevista de Devolução (Regra)"
                                        value={dayjs(emprestimoParaEditar.dataDevolucaoPrevista).format('DD/MM/YYYY')}
                                        disabled
                                        fullWidth
                                    />
                                )}

                            </div>
                        </Stack>
                        <DialogActions sx={{ mt: 3 }}>
                            <Button type="button" onClick={onCancelar} sx={{ fontWeight: 'bold', fontFamily: 'Arial' }}>
                                Cancelar
                            </Button>
                            <Button type="submit" variant="contained" color="success" sx={{ fontWeight: 'bold', fontFamily: 'Arial' }}>
                                {emprestimoParaEditar ? "Concluir / Salvar" : "Cadastrar Empréstimo"}
                            </Button>
                        </DialogActions>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}