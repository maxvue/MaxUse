# Escrita do usuário é descartada se ocorrer no mesmo tick de um `StorageEvent`

- **Severidade:** alta
- **Arquivo:** [src/Composables/useRefCached.ts](../../src/Composables/useRefCached.ts) — linhas 37, 44-57, 98
- **Categoria:** condição de corrida — perda de dado

## Problema

`is_syncing_from_event` é ligado de forma síncrona mas só é desligado no
`nextTick`. O watcher de persistência (linha 97) usa `flush: 'pre'` (padrão),
então também roda na fronteira do tick — e desiste na linha 98 porque a flag
ainda está `true`.

Resultado: uma escrita legítima do usuário que coincida com um evento
cross-tab é **silenciosamente perdida do armazenamento**, enquanto o `state`
exibe o valor novo. Estado e armazenamento passam a divergir permanentemente.

## Evidência

```
after normal write, ls = "mine-1"
state = mine-2   ls = "mine-1"      <-- divergência permanente

× a write issued in the same tick as a storage event is not persisted
  → expected '"mine-1"' to be '"mine-2"'
```

## Causa raiz

Supressão baseada em **janela de tempo**. Qualquer escrita que caia dentro da
janela é descartada, independentemente de ter ou não relação com o evento que
abriu a janela.

## Correção proposta

Trocar a janela temporal por comparação de **valor**: registrar o valor recebido
no evento e suprimir a persistência apenas quando o valor a gravar for
idêntico a ele.

```ts
// no handler do evento:
last_synced_serialized = event.newValue;

// no watcher de persistência:
const serialized = JSON.stringify(new_value);
if (serialized === last_synced_serialized) { last_synced_serialized = null; return; }
```

## Teste de regressão

```ts
it('persiste escrita emitida no mesmo tick de um storage event', async () => {
    window.dispatchEvent(new StorageEvent('storage', {
        key: 'k', newValue: JSON.stringify('mine-1')
    }));
    state.value = 'mine-2';
    await nextTick(); await nextTick();
    expect(localStorage.getItem('k')).toBe(JSON.stringify('mine-2'));
});
```
