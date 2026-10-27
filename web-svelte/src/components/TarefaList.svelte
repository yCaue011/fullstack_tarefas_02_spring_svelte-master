<script>
  import TarefaItem from './TarefaItem.svelte';

  let { tarefas, onAlternar, onExcluir, onAtualizar } = $props();
  let filtro = $state('todas'); // 'todas' | 'pendentes' | 'concluidas'

  let totalConcluidas = $derived(tarefas.filter(t => t.concluida).length);
  let totalPendentes = $derived(tarefas.filter(t => !t.concluida).length);

  let tarefasFiltradas = $derived(
    tarefas.filter(t => {
      if (filtro === 'pendentes') return !t.concluida;
      if (filtro === 'concluidas') return t.concluida;
      return true;
    })
  );
</script>

<div class="tarefas-container card">
  <!-- Barra de Filtros e Contadores -->
  <div class="toolbar-filtros">
    <div class="botoes-filtro">
      <button
        class="filtro-btn"
        class:ativo={filtro === 'todas'}
        onclick={() => (filtro = 'todas')}
      >
        Todas <span class="badge">{tarefas.length}</span>
      </button>
      <button
        class="filtro-btn"
        class:ativo={filtro === 'pendentes'}
        onclick={() => (filtro = 'pendentes')}
      >
        Pendentes <span class="badge">{totalPendentes}</span>
      </button>
      <button
        class="filtro-btn"
        class:ativo={filtro === 'concluidas'}
        onclick={() => (filtro = 'concluidas')}
      >
        Concluídas <span class="badge">{totalConcluidas}</span>
      </button>
    </div>
  </div>

  <!-- Lista de Itens -->
  {#if tarefasFiltradas.length > 0}
    <ul class="lista-tarefas">
      {#each tarefasFiltradas as tarefa (tarefa.id)}
        <TarefaItem {tarefa} {onAlternar} {onExcluir} {onAtualizar} />
      {/each}
    </ul>
  {:else}
    <div class="empty-state">
      <p class="empty-icon">📝</p>
      <h3>Nenhuma tarefa encontrada</h3>
      <p class="empty-text">
        {#if filtro === 'todas'}
          Adicione uma nova tarefa acima para começar a organizar seu dia!
        {:else}
          Não há tarefas nesta categoria de filtro.
        {/if}
      </p>
    </div>
  {/if}
</div>

<style>
  .tarefas-container {
    padding: 1.5rem;
  }

  .toolbar-filtros {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.25rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid var(--border-color);
  }

  .botoes-filtro {
    display: flex;
    gap: 0.5rem;
  }

  .filtro-btn {
    background: transparent;
    border: 1px solid var(--border-color);
    padding: 0.4rem 0.8rem;
    border-radius: 6px;
    font-size: 0.88rem;
    font-weight: 500;
    color: var(--text-muted);
    cursor: pointer;
    transition: all 0.15s ease-in-out;
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }

  .filtro-btn:hover {
    border-color: #cbd5e1;
    color: var(--text-main);
  }

  .filtro-btn.ativo {
    background: var(--text-main);
    color: white;
    border-color: var(--text-main);
  }

  .filtro-btn.ativo .badge {
    background: rgba(255, 255, 255, 0.25);
    color: white;
  }

  .badge {
    background: #e2e8f0;
    color: var(--text-main);
    font-size: 0.75rem;
    padding: 0.1rem 0.45rem;
    border-radius: 12px;
  }

  .lista-tarefas {
    list-style: none;
  }

  .empty-state {
    text-align: center;
    padding: 2.5rem 1rem;
    color: var(--text-muted);
  }

  .empty-icon {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
  }

  .empty-state h3 {
    color: var(--text-main);
    font-size: 1.1rem;
    margin-bottom: 0.25rem;
  }

  .empty-text {
    font-size: 0.9rem;
  }
</style>