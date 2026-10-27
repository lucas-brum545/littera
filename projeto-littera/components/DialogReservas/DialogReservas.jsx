import { Dialog, DialogContent, DialogTitle, Stack, DialogActions, Button, TextField, Select, MenuItem, InputLabel, FormControl, Autocomplete } from "@mui/material";
import { useState, useEffect } from "react";
import { listarItensAcervo, listarUsuarios } from "../../services/api";
import dayjs from "dayjs";
import DatePicker from "react-datepicker";

export default function DialogReservas({ reservaParaEditar, onCancelar, onSalvar }) {
    const [dataReserva, setDataReserva] = useState(null);
    const [formulario, setFormulario] = useState({
        usuarioId: '',
        itemCodigo: '',
        status: 'PENDENTE'
    });
    const [tipo, setTipo] = useState('LIVRO');
    const [usuarios, setUsuarios] = useState([]);
    const [itensAcervo, setItensAcervo] = useState([])

    // rotina que carrega os usuarios para selecao
    useEffect(() => {
        async function carregarUsuarios() {
            try {
                const data = await listarUsuarios();
                setUsuarios(data);
            } catch (error) {
                console.error('Erro ao buscar usuários:', error);
            }
        }
        carregarUsuarios();
    }, []);

    // rotina que carrega os itens de acervo para selecao
    useEffect(() => {
        async function carregarAcervo() {
            try {
                const data = await listarItensAcervo();
                setItensAcervo(data);
            } catch (error) {
                console.error('Erro ao buscar acervo:', error);
            }
        }
        carregarAcervo();
    }, []);
    

    useEffect(() => {
        if (reservaParaEditar) {
            setFormulario({
                usuarioId: reservaParaEditar.usuarioId || '',
                itemCodigo: reservaParaEditar.itemCodigo || '',
                status: reservaParaEditar.status || 'PENDENTE'
            });
            setDataReserva(
                reservaParaEditar.dataReserva ? new Date(reservaParaEditar.dataReserva) : null
            );
        } else {
            setFormulario({ usuarioId: '', itemCodigo: '', status: 'PENDENTE' });
            setDataReserva(null);
        }
    }, [reservaParaEditar]);

    useEffect(() => {
        if (reservaParaEditar && itensAcervo.length > 0) {
            const item = itensAcervo.find((i) => i.codigo === Number(reservaParaEditar.codigoItemAcervo));
            if (item) setTipo(item.tipo);
        }
    }, [reservaParaEditar, itensAcervo]);

    // Na edição o item emprestado pode estar indisponível; no cadastro só os disponíveis
    const opcoesItens = itensAcervo.filter(
        (i) => i.tipo === tipo && (i.disponivel || reservaParaEditar)
    );

    const rotuloItem = (i) =>
        i.tipo === 'LIVRO'
            ? `${i.titulo} - ${i.autor} (${i.genero})`
            : `${i.titulo} - ed. ${i.edicao}`;

    function trocarTipo(e) {
        setTipo(e.target.value);
        setFormulario({ ...formulario, codigoItemAcervo: '' });
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setFormulario({ ...formulario, [name]: value });
    }
    
    function enviar(event) {
        event.preventDefault();
            
        const reserva = {
            usuarioId: formulario.usuarioId,
            itemCodigo: formulario.itemCodigo,
            status: formulario.status,
            dataReserva: dataReserva ? dayjs(dataReserva).format('YYYY-MM-DD') : null,
        };
    
        if (reservaParaEditar) {
            reserva.id = reservaParaEditar.id;
        }
            
        onSalvar(reserva);
    }

    return (
        <Dialog open fullWidth maxWidth="sm" sx={{ '& .MuiDialog-paper': { borderRadius: '10px', padding: '20px' } }}>
            <DialogTitle sx={{ fontWeight: 'bold', fontFamily: 'Arial', color: '#666' }}>
                {reservaParaEditar ? `Editar Reserva ID: ${reservaParaEditar.id}` : "Cadastrar Nova Reserva"}
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
                            disabled={!!reservaParaEditar}
                            renderInput={(params) => <TextField {...params} label="Selecionar usuário" required />}
                        />
                        <FormControl fullWidth disabled={!!reservaParaEditar}>
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
                            disabled={!!reservaParaEditar}
                            noOptionsText="Nenhum item disponível"
                            renderInput={(params) => (
                                <TextField {...params} label={tipo === 'LIVRO' ? 'Selecionar livro' : 'Selecionar revista'} required />
                            )}
                        />
                        <label style={{ fontSize: '14px', color: '#666', fontWeight: 'bold' }}>Data da Reserva</label>
                        <div className="campo-datepicker">
                            <DatePicker
                                selected={dataReserva}
                                onChange={(date) => setDataReserva(date)}
                                dateFormat="dd/MM/yyyy"
                                placeholderText="Selecione a data da reserva"
                                className="input-datepicker-mui"
                                wrapperClassName="date-picker-wrapper"
                            />
                        </div>
                        <FormControl fullWidth>
                            <InputLabel id="status-label">Status</InputLabel>
                            <Select 
                                labelId="status-label"
                                name="status"
                                value={formulario.status} 
                                onChange={handleChange} 
                                label="Status"
                            >
                                <MenuItem value={'PENDENTE'}>Pendente</MenuItem>
                                <MenuItem value={'CONCLUIDA'}>Concluída</MenuItem>
                            </Select>
                        </FormControl>
                    </Stack>
                    
                    <DialogActions sx={{ mt: 3 }}>
                        <Button type="button" onClick={() => onCancelar()} sx={{ fontWeight: 'bold', fontFamily: 'Arial' }}>
                            Cancelar
                        </Button>
                        <Button type="submit" variant="contained" color="success" sx={{ fontWeight: 'bold', fontFamily: 'Arial' }}>
                            {reservaParaEditar ? "Atualizar" : "Cadastrar"}
                        </Button>
                    </DialogActions>
                </form>
            </DialogContent>
        </Dialog>
    );
}