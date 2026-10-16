import axios from 'axios';

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080/'
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export async function realizarLogin(email, senha) {
    try {
        const { data } = await api.post('api/auth/login', { email, senha });
        return data;
    } catch (error) {
        console.error('Erro ao realizar login:', error);
        throw error;
    }
}

export async function listarUsuarios() {
    try {
        const { data } = await api.get('api/usuarios');
        return data;
    } catch (error) {
        console.error('Erro ao listar usuários:', error);
        throw error;
    }
}

export async function listarLivros() {
    try {
        const { data } = await api.get('api/livros');
        return data;
    } catch (error) {
        console.error('Erro ao listar livros:', error);
        throw error;
    }
}

export async function listarRevistas() {
    try {
        const { data } = await api.get('api/revistas');
        return data;
    } catch (error) {
        console.error('Erro ao listar revistas:', error);
        throw error;
    }
}

export async function listarEmprestimos() {
    try {
        const { data } = await api.get('api/emprestimos');
        return data;
    } catch (error) {
        console.error('Erro ao listar empréstimos:', error);
        throw error;
    }
}

export async function listarReservas() {
    try {
        const { data } = await api.get('api/reservas');
        return data;
    } catch (error) {
        console.error('Erro ao listar reservas:', error);
        throw error;
    }
}

export async function buscarUsuario(id) {
    try {
        const { data } = await api.get(`api/usuarios/${id}`);
        return data;
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        throw error;
    }
}

export default api;