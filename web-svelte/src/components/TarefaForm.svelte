<script>
  let { onAdicionar } = $props();
  let descricao = $state('');
  let enviando = $state(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const texto = descricao.trim();
    if (!texto) return;

    enviando = true;
    try {
      await onAdicionar(texto);
      descricao = '';
    } finally {
      enviando = false;
    }
  }
</script>

<form class="form-tarefa card" onsubmit={handleSubmit}>
  <div class="input-group">
    <input
      type="text"
      placeholder="O que você precisa fazer hoje?"
      bind:value={descricao}
      disabled={enviando}
    />
    <button type="submit" class="btn btn-primary" disabled={enviando || !descricao.trim()}>
      {enviando ? 'Adicionando...' : '+ Adicionar'}
    </button>
  </div>
</form>

<style>
  .form-tarefa {
    margin-bottom: 1.5rem;
    padding: 1.25rem;
  }

  .input-group {
    display: flex;
    gap: 0.75rem;
  }

  input[type='text'] {
    flex: 1;
    padding: 0.75rem 1rem;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    font-size: 1rem;
    color: var(--text-main);
    background: #fdfdfd;
    outline: none;
    transition: border-color 0.15s ease-in-out;
  }

  input[type='text']:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(255, 62, 0, 0.15);
  }
</style>