import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';
import './DialogUsuarios.css';

export default function DialogUsuarios({ usuarioParaEditar, onCancelar, onSalvar }) {
  const [formulario, setFormulario] = useState({
    nome: '',
    email: '',
    telefone: '',
    tipoUsuario: '',
    senha: '',
  });

  const [dataNascimento, setDataNascimento] = useState(null);

  useEffect(() => {
    if (usuarioParaEditar) {
      setFormulario({
        nome: usuarioParaEditar.nome || '',
        email: usuarioParaEditar.email || '',
        telefone: usuarioParaEditar.telefone || '',
        tipoUsuario: usuarioParaEditar.tipoUsuario || '',
        senha: '',
      });
      // Converte a string da API (ex: "1995-05-19") para objeto Date para o DatePicker ler
      setDataNascimento(
        usuarioParaEditar.dataNascimento ? dayjs(usuarioParaEditar.dataNascimento).toDate() : null
      );
    } else {
      setFormulario({ nome: '', email: '', telefone: '', tipoUsuario: '', senha: '' });
      setDataNascimento(null);
    }
  }, [usuarioParaEditar]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Garante que a data está formatada e monta o objeto completo diretamente do estado atual
    const dadosFormatados = {
      nome: formulario.nome,
      email: formulario.email,
      telefone: formulario.telefone,
      tipoUsuario: formulario.tipoUsuario || 'LEITOR',
      senha: formulario.senha,
      dataNascimento: dataNascimento ? dayjs(dataNascimento).format('YYYY-MM-DD') : null,
    };

    console.log("Dados validados que vão para a API:", dadosFormatados);

    onSalvar(dadosFormatados);
  };

  function handleChange(e) {
    const { name, value } = e.target;
    setFormulario((prev) => ({
      ...prev,
      [name]: value,
    }));
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

            <FormControl fullWidth>
              <InputLabel id="status-label">Tipo de usuário</InputLabel>
              <Select
                labelId="status-label"
                name="tipoUsuario"
                value={formulario.tipoUsuario}
                onChange={handleChange}
                label="Tipo de usuário"
              >
                <MenuItem value={'LEITOR'}>Leitor</MenuItem>
                <MenuItem value={'ADMIN'}>Administrador</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Senha"
              type="password"
              name="senha"
              value={formulario.senha}
              onChange={handleChange}
              fullWidth
              placeholder={usuarioParaEditar ? 'Deixe em branco para manter a senha' : ''}
              required={!usuarioParaEditar}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button type="button" onClick={onCancelar} sx={{fontWeight: 'bold', fontFamily: 'Arial'}}>
            Cancelar
          </Button>
          <Button type="submit" color="success" sx={{fontWeight: 'bold', fontFamily: 'Arial'}}>
            {usuarioParaEditar ? 'Atualizar' : 'Cadastrar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}