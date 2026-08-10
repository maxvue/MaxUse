# peer-vue-fixado-em-release-candidate

- **Severidade**: baixa
- **Tipo**: infra
- **Arquivo**: `package.json:159-162`

## Problema
`peerDependencies.vue` é `^3.6.0-rc.2` — publicar pacote npm com peer em pré-release faz consumidores com Vue estável 3.5.x receberem `ERESOLVE`/warning de peer não satisfeito (ranges com pré-release só aceitam `>=3.6.0-rc.2`).

## Plano de correção
1. Se a lib não depende de APIs exclusivas do 3.6: afrouxar para `^3.5.0 || ^3.6.0-rc.2`.
2. Quando o 3.6 estável sair: trocar para `^3.6.0`.

## Testes
- `npm install` num projeto de teste com Vue 3.5.x sem warning de peer (verificação manual/CI).
