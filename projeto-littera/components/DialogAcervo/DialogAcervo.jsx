import { Dialog, DialogContent, DialogTitle, Stack, DialogActions, Button, TextField } from "@mui/material";
import './DialogUsuarios.css'
export default function DialogAcervo(props){

    function enviar(event){
        event.preventDefault();
        const formData = new FormData(event.target);
        const usuario = {
            nome: formData.get("nome"),
            email: formData.get("email"),
            telefone: formData.get("telefone"),
        }

        if(props.usuarioParaEditar){
            usuario.id = props.usuarioParaEditar.id
        }
        
        props.onSalvar(usuario)
    }

    return <>
        <Dialog open fullWidth maxWidth="sm">
                <DialogTitle className="formulario-usuario-titulo">
                    {props.usuarioParaEditar?`Editar Usuário ID: ${props.usuarioParaEditar.id}`:"Cadastrar Novo Usuário"}
                </DialogTitle>
            <DialogContent>
                <form action={enviar} className="formulario-usuario">
                <Stack spacing={2} sx={{mt:2}}>
                        <TextField label="Nome" name="nome" required id="outlined-basic" defaultValue={props.usuarioParaEditar?.nome} variant="outlined" sx={{background: 'white'}} />
                        <TextField label="E-mail" name="email" required type="email" id="outlined-basic" defaultValue={props.usuarioParaEditar?.email} variant="outlined" sx={{background: 'white'}} />
                        <TextField label="Telefone" name="telefone" required id="outlined-basic" defaultValue={props.usuarioParaEditar?.telefone} variant="outlined" sx={{background: 'white'}} />
                </Stack>
                <DialogActions>
                    <Button type="button" onClick={() => props.onCancelar()} sx={{fontWeight: 'bold', fontFamily: 'Arial'}}>
                        Cancelar
                    </Button>
                    <Button type="submit" color="success" sx={{fontWeight: 'bold', fontFamily: 'Arial'}}>
                        {props.usuarioParaEditar?"Atualizar":"Cadastrar"}
                    </Button>
                </DialogActions>
            </form>
            </DialogContent>
        </Dialog>
    </>
}