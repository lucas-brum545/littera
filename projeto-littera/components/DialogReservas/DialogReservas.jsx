import { Dialog, DialogContent, DialogTitle, Stack, DialogActions, Button, TextField, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import { useState, useEffect } from "react";
import dayjs from "dayjs";

export default function DialogReservas({ reservaParaEditar, onCancelar, onSalvar }) {
    const [dataReserva, setDataReserva] = useState(null);
    const [formulario, setFormulario] = useState({
        usuarioId: '',
        itemCodigo: '',
        status: 'PENDENTE'
    });

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
                        <TextField 
                            label="Código do Usuário" 
                            name="usuarioId" 
                            required 
                            value={formulario.usuarioId}
                            onChange={handleChange}
                            variant="outlined" 
                            sx={{ background: 'white' }} 
                        />
                        <TextField 
                            label="Código do Item" 
                            name="itemCodigo" 
                            required 
                            value={formulario.itemCodigo}
                            onChange={handleChange}
                            variant="outlined" 
                            sx={{ background: 'white' }} 
                        />
                        <TextField 
                            label="Data da Reserva" 
                            name="dataReserva" 
                            required 
                            type="date" 
                            value={dataReserva ? dayjs(dataReserva).format('YYYY-MM-DD') : ''}
                            onChange={(e) => setDataReserva(e.target.value ? new Date(e.target.value) : null)}
                            variant="outlined" 
                            sx={{ background: 'white' }} 
                            InputLabelProps={{ shrink: true }}
                        />
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