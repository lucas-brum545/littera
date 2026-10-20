import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080/'
});

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