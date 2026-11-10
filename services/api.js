import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL ?? '';   // vazio em desenvolvimento: o proxy do Vite continua valendo

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Mostra na tela a mensagem que o backend devolve ({ "erro": "..." })
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const mensagemDoServidor = error.response?.data?.erro;
        if (mensagemDoServidor) {
            error.message = mensagemDoServidor;
        }

        // Token expirado ou inválido: volta para o login (exceto na própria tela de login)
        const ehLogin = error.config?.url?.includes('/api/auth/login');
        if (error.response?.status === 401 && !ehLogin) {
            localStorage.removeItem('token');
            localStorage.removeItem('usuario');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export async function realizarLogin(email, senha) {
    try {
        const { data } = await api.post('/api/auth/login', { email, senha });
        return data;
    } catch (error) {
        console.error('Erro ao realizar login:', error);
        throw error;
    }
}
// --- CRUD DE USUÁRIOS ---

export async function listarUsuarios() {
    try {
        const { data } = await api.get('/api/usuarios');
        return data;
    } catch (error) {
        console.error('Erro ao listar usuários:', error);
        throw error;
    }
}

export async function buscarUsuario(id) {
    try {
        const { data } = await api.get(`/api/usuarios/${id}`);
        return data;
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        throw error;
    }
}

export async function criarUsuario(dados) {
    try {
        const { data } = await api.post('/api/usuarios', dados);
        return data;
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        throw error;
    }
}

export async function atualizarUsuario(id, dados) {
    try {
        const { data } = await api.put(`/api/usuarios/${id}`, dados);
        return data;
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        throw error;
    }
}

export async function excluirUsuarioApi(id) {
    try {
        await api.delete(`/api/usuarios/${id}`);
        return true;
    } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        throw error;
    }
}

// --- CRUD DE ACERVO ---

export async function criarItemAcervo(dados){
    try{
        const { data } = await api.post('/api/acervo', dados)
        return data
    } catch(error){
        console.error('Erro ao criar item de acervo: ', error)
        throw error
    }
}

export async function atualizarItemAcervo(id, dados){
    try{
        const { data } = await api.put(`/api/acervo/${id}`, dados);
        return data;
    }catch (error) {
        console.error('Erro ao atualizar item do acervo:', error);
        throw error;
    }
}

export async function excluirItemAcervo(id){
    try {
        const { data } = await api.delete(`/api/acervo/${id}`);
        return data;
    } catch (error) {
        console.error('Erro ao deletar o item do acervo:', error);
        throw error;
    }   
}

export async function listarItensAcervo() {
    try {
        const { data } = await api.get('/api/acervo');
        return data;
    } catch (error) {
        console.error('Erro ao listar itens do acervo:', error);
        throw error;
    }
}


// --- CRUD DE EMPRÉSTIMOS ---

export async function criarEmprestimo(dados) {
    try {
        const { data } = await api.post('/api/emprestimos', dados);
        return data;
    } catch (error) {
        console.error('Erro ao criar empréstimo:', error);
        throw error;
    }
}

export async function atualizarEmprestimo(id, dados){
    try {
        const { data } = await api.put(`/api/emprestimos/${id}`, dados);
        return data;
    } catch (error) {
        console.error('Erro ao atualizar empréstimo:', error);
        throw error;
    }
}

export async function excluirEmprestimoApi(id){
    try {
        const { data } = await api.delete(`/api/emprestimos/${id}`);
        return data;
    } catch (error) {
        console.error('Erro ao deletar o empréstimo:', error);
        throw error;
    }   
}

export async function listarEmprestimos() {
    try {
        const { data } = await api.get('/api/emprestimos');
        return data;
    } catch (error) {
        console.error('Erro ao listar empréstimos:', error);
        throw error;
    }
}

// --- CRUD DE RESERVAS ---

export async function listarReservas() {
    try {
        const { data } = await api.get('/api/reservas');
        return data;
    } catch (error) {
        console.error('Erro ao listar reservas:', error);
        throw error;
    }
}

export async function criarReserva(dados){
    try {
        const { data } = await api.post('/api/reservas', dados);
        return data;
    } catch (error) {
        console.error('Erro ao criar reserva:', error);
        throw error;
    }
}

export async function atualizarReserva(id, dados){
    try {
        const { data } = await api.put(`/api/reservas/${id}`, dados);
        return data;
    } catch (error) {
        console.error('Erro ao atualizar reserva:', error);
        throw error;
    }
}

export async function excluirReservaApi(id){
    try {
        const { data } = await api.delete(`/api/reservas/${id}`);
        return data;
    } catch (error) {
        console.error('Erro ao deletar a reserva:', error);
        throw error;
    } 
}

export default api;

// --- TRADUÇÃO (feita pelo backend; exige login de ADMIN) ---
export async function traduzirParaPortugues(texto) {
    const { data } = await api.post('/api/traducao/portugues', { texto });
    if (!data?.sucesso || !data?.traducao?.trim()) {
        throw new Error('Não foi possível traduzir o texto.');
    }
    return data.traducao.trim();
}
