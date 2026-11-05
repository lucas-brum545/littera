import { Dialog, DialogContent, DialogTitle, Stack, DialogActions, Button, TextField, Select, MenuItem, InputLabel, FormControl, Autocomplete } from "@mui/material";
import { useState, useEffect } from "react";
import { listarItensAcervo, listarUsuarios } from "../../services/api";
import dayjs from "dayjs";
import DatePicker from "react-datepicker";

export default function DialogReservas({ reservaParaEditar, onCancelar, onSalvar }) {
    // Inicializa a data com HOJE por padrão caso não seja edição
    const [formulario, setFormulario] = useState({
        usuarioId: '',
        itemCodigo: '',
        status: 'PENDENTE'
    });
    const [tipo, setTipo] = useState('LIVRO');
    const [usuarios, setUsuarios] = useState([]);
    const [itensAcervo, setItensAcervo] = useState([]);

    // Rotina que carrega os usuários para seleção
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

    // Rotina que carrega os itens de acervo para seleção
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
        } else {
            setFormulario({ usuarioId: '', itemCodigo: '', status: 'PENDENTE' });
        }
    }, [reservaParaEditar]);

    useEffect(() => {
        if (reservaParaEditar && itensAcervo.length > 0) {
            const item = itensAcervo.find((i) => i.codigo === Number(reservaParaEditar.itemCodigo));
            if (item) setTipo(item.tipo);
        }
    }, [reservaParaEditar, itensAcervo]);

    // Mostra todos os itens do tipo selecionado, independentemente da disponibilidade
    const opcoesItens = itensAcervo.filter(
        (i) => i.tipo === tipo
    );

    const rotuloItem = (i) =>
        i.tipo === 'LIVRO'
            ? `${i.titulo} - ${i.autor || 'Autor desconhecido'} (${i.genero || 'Gênero N/I'})`
            : `${i.titulo} - ed. ${i.edicao || 'N/I'}`;

    function trocarTipo(e) {
        setTipo(e.target.value);
        setFormulario((atual) => ({ ...atual, itemCodigo: '' }));
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setFormulario((atual) => ({ ...atual, [name]: value }));
    }
    
    function enviar(event) {
        event.preventDefault();
            
        const reserva = {
            usuarioId: formulario.usuarioId,
            itemCodigo: formulario.itemCodigo,
            status: reservaParaEditar ? formulario.status : 'PENDENTE', // Define PENDENTE internamente se for novo cadastro
        };
    
        if (reservaParaEditar) {
            reserva.id = reservaParaEditar.id;
        }
            
        onSalvar(reserva);
    }

    return (
        <Dialog open fullWidth maxWidth="sm" sx={{ '& .MuiDialog-paper': { borderRadius: '10px', padding: '20px', height:'600px' } }}>
            <DialogTitle sx={{ fontWeight: 'bold', fontFamily: 'Arial', color: '#666' }}>
                {reservaParaEditar ? `Editar Reserva ID: ${reservaParaEditar.id}` : "Cadastrar Nova Reserva"}
            </DialogTitle>
            <DialogContent>
                <form onSubmit={enviar}>
                    <Stack spacing={2} sx={{ mt: 2 }}>
                        {/* Seletor de Usuário */}
                        <Autocomplete
                            disablePortal
                            options={usuarios}
                            getOptionLabel={(u) => `${u.nome || u.username} (${u.email || ''})`}
                            isOptionEqualToValue={(opcao, valor) => opcao.id === valor.id}
                            value={usuarios.find((u) => u.id === Number(formulario.usuarioId)) || null}
                            onChange={(e, usuario) =>
                                setFormulario((atual) => ({ ...atual, usuarioId: usuario ? usuario.id : '' }))
                            }
                            disabled={!!reservaParaEditar}
                            renderInput={(params) => <TextField {...params} label="Selecionar usuário" required />}
                        />

                        {/* Seletor do Tipo de Item */}
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

                        {/* Seletor do Livro ou Revista */}
                        <Autocomplete
                            disablePortal
                            options={opcoesItens}
                            getOptionLabel={rotuloItem}
                            isOptionEqualToValue={(opcao, valor) => opcao.codigo === valor.codigo}
                            value={opcoesItens.find((i) => i.codigo === Number(formulario.itemCodigo)) || null}
                            onChange={(e, item) =>
                                setFormulario((atual) => ({ ...atual, itemCodigo: item ? item.codigo : '' }))
                            }
                            disabled={!!reservaParaEditar}
                            noOptionsText="Nenhum item disponível"
                            renderInput={(params) => (
                                <TextField {...params} label={tipo === 'LIVRO' ? 'Selecionar livro' : 'Selecionar revista'} required />
                            )}
                        />

                        {/* Seletor de Status (Exibido APENAS ao editar) */}
                        {reservaParaEditar && (
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
                        )}
                    </Stack>
                    
                    <DialogActions sx={{ mt: 3 }}>
                        <Button type="button" onClick={() => onCancelar()} sx={{ fontWeight: 'bold', fontFamily: 'Arial' }}>
                            Cancelar
                        </Button>
                        <Button type="submit" color="success" sx={{ fontWeight: 'bold', fontFamily: 'Arial' }}>
                            {reservaParaEditar ? "Atualizar" : "Cadastrar"}
                        </Button>
                    </DialogActions>
                </form>
            </DialogContent>
        </Dialog>
    );
}