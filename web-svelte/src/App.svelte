<script>
  import { onMount } from 'svelte';
  import { tarefaService } from './services/tarefaService.js';
  import TarefaForm from './components/TarefaForm.svelte';
  import TarefaList from './components/TarefaList.svelte';

  let tarefas = $state([]);
  let carregando = $state(true);
  let erro = $state('');

  onMount(async () => {
    await carregarTarefas();
  });

  async function carregarTarefas() {
    carregando = true;
    erro = '';
    try {
      tarefas = await tarefaService.listarTarefas();
    } catch (e) {
      console.error(e);
      erro = 'Não foi possível conectar à API Spring Boot (porta 8080). Verifique se o backend está rodando.';
    } finally {
      carregando = false;
    }
  }

  async function adicionarTarefa(descricao) {
    erro = '';
    try {
      const nova = await tarefaService.criarTarefa(descricao);
      tarefas = [nova, ...tarefas];
    } catch (e) {
      console.error(e);
      erro = 'Falha ao salvar nova tarefa na API.';
    }
  }

  async function alternarStatus(id, novoStatus) {
    const tarefaAtual = tarefas.find(t => t.id === id);
    if (!tarefaAtual) return;

    erro = '';
    // Atualização otimista na interface
    const tarefasOriginais = [...tarefas];
    tarefas = tarefas.map(t => (t.id === id ? { ...t, concluida: novoStatus } : t));

    try {
      await tarefaService.alternarStatusTarefa(id, tarefaAtual.descricao, novoStatus);
    } catch (e) {
      console.error(e);
      // Reverte em caso de falha
      tarefas = tarefasOriginais;
      erro = 'Falha ao sincronizar alteração de status com o backend.';
    }
  }

  async function atualizarTarefa(id, novaDescricao, status) {
    erro = '';
    try {
      const atualizada = await tarefaService.atualizarTarefa(id, novaDescricao, status);
      tarefas = tarefas.map(t => (t.id === id ? atualizada : t));
    } catch (e) {
      console.error(e);
      erro = 'Falha ao atualizar descrição da tarefa na API.';
    }
  }

  async function excluirTarefa(id) {
    if (!confirm('Deseja realmente remover esta tarefa?')) return;

    erro = '';
    const tarefasOriginais = [...tarefas];
    tarefas = tarefas.filter(t => t.id !== id);

    try {
      await tarefaService.excluirTarefa(id);
    } catch (e) {
      console.error(e);
      tarefas = tarefasOriginais;
      erro = 'Falha ao excluir tarefa na API.';
    }
  }
</script>

<div class="container">
  <header>
    <h1>🧡 Lista de Tarefas (Svelte)</h1>
    <p>Cliente Web Reativo com JavaScript Puro · Consumindo API Spring Boot (:8080)</p>
  </header>

  {#if erro}
    <div class="alert alert-error">
      ⚠️ {erro}
    </div>
  {/if}

  <main>
    <TarefaForm onAdicionar={adicionarTarefa} />

    {#if carregando}
      <div class="loading-box card">
        <div class="spinner"></div>
        <p>Carregando tarefas do servidor...</p>
      </div>
    {:else}
      <TarefaList
        {tarefas}
        onAlternar={alternarStatus}
        onExcluir={excluirTarefa}
        onAtualizar={atualizarTarefa}
      />
    {/if}
  </main>
</div>

<style>
  .loading-box {
    text-align: center;
    padding: 2.5rem;
    color: var(--text-muted);
  }

  .spinner {
    width: 32px;
    height: 32px;
    border: 3px solid #e2e8f0;
    border-top-color: var(--primary-color);
    border-radius: 50%;
    margin: 0 auto 1rem auto;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>