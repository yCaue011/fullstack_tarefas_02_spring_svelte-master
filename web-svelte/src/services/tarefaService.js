// Serviço em JavaScript Puro utilizando a API Fetch nativa do navegador
// Comunica-se diretamente com a Fonte Única da Verdade (SSOT): API Spring Boot na porta 8080
const API_URL = 'http://localhost:8080/api/tarefas';

export const tarefaService = {
    /**
     * Consulta a lista completa de tarefas cadastradas
     * @returns {Promise<Array<{id: number, descricao: string, concluida: boolean}>>}
     */
    async listarTarefas() {
        const resposta = await fetch(API_URL);
        if (!resposta.ok) {
            throw new Error(`Erro ao consultar API: HTTP ${resposta.status}`);
        }
        return await resposta.json();
    },

    /**
     * Cadastra uma nova tarefa
     * @param {string} descricao
     * @returns {Promise<{id: number, descricao: string, concluida: boolean}>}
     */
    async criarTarefa(descricao) {
        const resposta = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                descricao: descricao.trim(),
                concluida: false
            })
        });
        if (!resposta.ok) {
            throw new Error(`Erro ao criar tarefa: HTTP ${resposta.status}`);
        }
        return await resposta.json();
    },

    /**
     * Atualiza a descrição e/ou status de uma tarefa existente
     * @param {number} id
     * @param {string} descricao
     * @param {boolean} concluida
     * @returns {Promise<{id: number, descricao: string, concluida: boolean}>}
     */
    async atualizarTarefa(id, descricao, concluida) {
        const resposta = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                descricao: descricao.trim(),
                concluida
            })
        });
        if (!resposta.ok) {
            throw new Error(`Erro ao atualizar tarefa: HTTP ${resposta.status}`);
        }
        return await resposta.json();
    },

    /**
     * Alterna o status de conclusão sincronizando o registro completo via PUT
     * @param {number} id
     * @param {string} descricao
     * @param {boolean} concluida
     * @returns {Promise<{id: number, descricao: string, concluida: boolean}>}
     */
    async alternarStatusTarefa(id, descricao, concluida) {
        return this.atualizarTarefa(id, descricao, concluida);
    },

    /**
     * Remove permanentemente uma tarefa por ID
     * @param {number} id
     * @returns {Promise<void>}
     */
    async excluirTarefa(id) {
        const resposta = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        if (!resposta.ok && resposta.status !== 204) {
            throw new Error(`Erro ao excluir tarefa: HTTP ${resposta.status}`);
        }
    }
};