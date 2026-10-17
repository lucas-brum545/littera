import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';
import './DialogUsuarios.css';

export default function DialogUsuarios({ usuarioParaEditar, onCancelar, onSalvar }) {
  const [formulario, setFormulario] = useState({
    nome: '',
    email: '',
    telefone: '',
    senha: '',
  });

  const [dataNascimento, setDataNascimento] = useState(null);

  useEffect(() => {
    if (usuarioParaEditar) {
      setFormulario({
        nome: usuarioParaEditar.nome || '',
        email: usuarioParaEditar.email || '',
        telefone: usuarioParaEditar.telefone || '',
        senha: '',
      });
      setDataNascimento(
        usuarioParaEditar.dataNascimento ? new Date(usuarioParaEditar.dataNascimento) : null
      );
    } else {
      setFormulario({ nome: '', email: '', telefone: '', senha: '' });
      setDataNascimento(null);
    }
  }, [usuarioParaEditar]);

  function handleSubmit(e) {
    e.preventDefault();

    console.log("Valor bruto do DatePicker (dataNascimento):", dataNascimento);

    const dadosFormatados = {
      ...formulario,
      dataNascimento: dataNascimento ? dayjs(dataNascimento).format('YYYY-MM-DD') : null,
    };

    console.log("Dados formatados que vão para a API:", dadosFormatados);

    onSalvar(dadosFormatados);
  }
  function handleChange(e) {
    const { name, value } = e.target;
    setFormulario({
      ...formulario,
      [name]: value,
    });
  }

  return (
    <Dialog open fullWidth onClose={onCancelar} maxWidth="sm" sx={{'& .MuiDialog-paper': {borderRadius: '10px', padding: '20px'}}}>
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{fontWeight: 'bold', fontFamily: 'Arial', color: '#666'}}>
          {usuarioParaEditar ? `Editar Usuário ID: ${usuarioParaEditar.id}` : 'Cadastrar Novo Usuário'}
        </DialogTitle>
        <DialogContent>
          <div className="campo-dialog" style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>
            <TextField
              label="Nome"
              name="nome"
              value={formulario.nome}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="E-mail"
              type="email"
              name="email"
              value={formulario.email}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Telefone"
              name="telefone"
              value={formulario.telefone}
              onChange={handleChange}
              fullWidth
              required
            />

            <div className="campo-datepicker" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '0.875rem', color: 'rgba(0, 0, 0, 0.6)' }}>Data de Nascimento</label>
   
              <DatePicker
                selected={dataNascimento}
                required
                onChange={(date) => setDataNascimento(date)}
                dateFormat="dd/MM/yyyy"
                placeholderText="Selecione a data"
                className="input-datepicker-mui"
                wrapperClassName="date-picker-wrapper"
                maxDate={new Date()}
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={100}
              />
            </div>

            <TextField
              label="Senha"
              type="password"
              name="senha"
              value={formulario.senha}
              onChange={handleChange}
              fullWidth
              placeholder={usuarioParaEditar ? 'Deixe em branco para manter a senha' : ''}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button type="button" onClick={onCancelar} sx={{fontWeight: 'bold', fontFamily: 'Arial'}}>
            Cancelar
          </Button>
          {/* CORRIGIDO: Removido o onClick={onSalvar}, deixando apenas type="submit" */}
          <Button type="submit" color="success" sx={{fontWeight: 'bold', fontFamily: 'Arial'}}>
            {usuarioParaEditar ? 'Atualizar' : 'Cadastrar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}