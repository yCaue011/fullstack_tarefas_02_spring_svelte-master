<script>
  let { tarefa, onAlternar, onExcluir, onAtualizar } = $props();
  let editando = $state(false);
  let textoEditado = $state('');

  function iniciarEdicao() {
    textoEditado = tarefa.descricao;
    editando = true;
  }

  function cancelarEdicao() {
    editando = false;
  }

  async function salvarEdicao() {
    const texto = textoEditado.trim();
    if (!texto) return;

    if (texto !== tarefa.descricao) {
      await onAtualizar(tarefa.id, texto, tarefa.concluida);
    }
    editando = false;
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter') {
      salvarEdicao();
    } else if (event.key === 'Escape') {
      cancelarEdicao();
    }
  }
</script>

<li class="tarefa-item" class:concluida={tarefa.concluida}>
  <div class="content-col">
    <input
      type="checkbox"
      checked={tarefa.concluida}
      onchange={() => onAlternar(tarefa.id, !tarefa.concluida)}
      class="checkbox-status"
      title={tarefa.concluida ? 'Marcar como pendente' : 'Marcar como concluída'}
    />

    {#if editando}
      <input
        type="text"
        class="input-edicao"
        bind:value={textoEditado}
        onkeydown={handleKeyDown}
        onblur={salvarEdicao}
        autofocus
      />
    {:else}
      <span
        class="descricao"
        ondblclick={iniciarEdicao}
        title="Dê duplo clique para editar"
      >
        {tarefa.descricao}
      </span>
      <span class="id-tag">#{tarefa.id}</span>
    {/if}
  </div>

  <div class="actions-col">
    {#if !editando}
      <button class="btn-action btn-edit" onclick={iniciarEdicao} title="Editar">
        ✏️
      </button>
      <button class="btn-action btn-delete" onclick={() => onExcluir(tarefa.id)} title="Excluir">
        🗑️
      </button>
    {/if}
  </div>
</li>

<style>
  .tarefa-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.9rem 1.1rem;
    background: #ffffff;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    margin-bottom: 0.6rem;
    transition: all 0.15s ease-in-out;
  }

  .tarefa-item:hover {
    border-color: #cbd5e1;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
  }

  .tarefa-item.concluida {
    background: #f8fafc;
    border-left: 4px solid var(--success-color);
  }

  .tarefa-item:not(.concluida) {
    border-left: 4px solid var(--primary-color);
  }

  .content-col {
    display: flex;
    align-items: center;
    gap: 0.85rem;
    flex: 1;
  }

  .checkbox-status {
    width: 1.25rem;
    height: 1.25rem;
    cursor: pointer;
    accent-color: var(--success-color);
  }

  .descricao {
    font-size: 1rem;
    color: var(--text-main);
    cursor: pointer;
    word-break: break-word;
  }

  .tarefa-item.concluida .descricao {
    text-decoration: line-through;
    color: var(--text-muted);
    opacity: 0.8;
  }

  .id-tag {
    font-size: 0.75rem;
    color: #94a3b8;
    background: #f1f5f9;
    padding: 0.15rem 0.4rem;
    border-radius: 4px;
    margin-left: 0.25rem;
  }

  .input-edicao {
    flex: 1;
    padding: 0.4rem 0.6rem;
    font-size: 1rem;
    border: 1px solid var(--primary-color);
    border-radius: 6px;
    outline: none;
  }

  .actions-col {
    display: flex;
    gap: 0.35rem;
  }

  .btn-action {
    background: transparent;
    border: none;
    font-size: 1rem;
    cursor: pointer;
    padding: 0.3rem 0.5rem;
    border-radius: 6px;
    transition: background-color 0.12s;
  }

  .btn-action:hover {
    background: #f1f5f9;
  }

  .btn-delete:hover {
    background: #fee2e2;
  }
</style>