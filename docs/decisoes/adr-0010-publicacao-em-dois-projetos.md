# ADR 0010 - Publicação em dois projetos da Vercel, com a API atrás do PWA

## Status

Aprovado - implementado e verificado no ambiente publicado em 08/10/2026.

## Data

2026-10-08

## Contexto

O ambiente publicado servia só o PWA. A API existia no código desde a Sprint 1,
mas **nunca tinha sido publicada**: na Vercel havia um único projeto, `agroscan`,
com Root Directory `web/`. O diagnóstico por sintomas funcionava, porque roda no
navegador ([ADR 0001](adr-0001-diagnostico-no-cliente.md)), mas toda chamada a
`/api/v1` — cadastro, login, sincronização do caderno, versão do catálogo —
respondia **404**. O defeito foi descoberto ao tentar criar uma conta no site.

Três restrições moldam a solução:

1. **O PWA e a API são builds diferentes.** O PWA é Next.js dentro de `src/web/`; a
   API é uma função Python que precisa enxergar `src/app/`, `src/data/` e `src/migracoes/`,
   que ficam na raiz. Um projeto com Root Directory `web/` não vê a raiz.
2. **O navegador fala com `/api/v1` na própria origem.** Sem CORS, e com a regra
   do service worker que nunca cacheia `/api/` valendo pelo caminho
   ([`src/web/next.config.ts`](../../src/web/next.config.ts)).
3. **O banco está na Neon, em `sa-east-1`, atrás de um pooler em modo
   transação.**

## Decisão

**Dois projetos na Vercel, ligados ao mesmo repositório:**

| Projeto | Root Directory | Framework Preset | Endereço |
| --- | --- | --- | --- |
| `agroscan` | `src/web` | Next.js | <https://agroscan-blond.vercel.app> |
| `agroscan-api` | `src` | **Other** | <https://agroscan-api.vercel.app> |

*Desde 09/10/2026 todo o código está em `src/`; antes, os Root Directories
eram `web` e `.` (raiz).*

O PWA encaminha `/api/v1/*` para a API por *rewrite* do Next, ativado pela
variável `API_URL`. Para o navegador existe uma origem só.

**Variáveis de ambiente (produção):**

| Projeto | Variável | Valor |
| --- | --- | --- |
| `agroscan` | `API_URL` | `https://agroscan-api.vercel.app` |
| `agroscan-api` | `DATABASE_URL` | string **pooled** da Neon |
| `agroscan-api` | `JWT_SEGREDO` | segredo aleatório gerado para produção, distinto do de desenvolvimento |
| `agroscan-api` | `JWT_HORAS` | `72` |
| `agroscan-api` | `AMBIENTE` | `producao` |

`DATABASE_URL_DIRETA` **não** vai para a Vercel: só a migração a usa, e a
migração roda fora da função.

**Função em `gru1` (São Paulo)**, pelo `"regions"` do
[`vercel.json`](../../src/vercel.json). A primeira publicação saiu em `iad1`
(Washington), e cada consulta ao banco atravessava o continente.

**Nenhum parâmetro de inicialização na conexão com o banco.** A API abria a
conexão com `options="-c statement_timeout=5000"`, e o pooler da Neon recusa
parâmetros de inicialização (*unsupported startup parameter*): publicada, a API
respondia, mas sem banco. A opção foi removida de
[`src/app/api/banco.py`](../../src/app/api/banco.py). Um `SET` de sessão também não
serve, porque em modo transação ele vazaria para outra conexão física do pool.
O teto de tempo fica com o `maxDuration` da função (15 s).

## Alternativas consideradas

| Alternativa | Por que não |
| --- | --- |
| Um projeto só, com a API em `src/web/api/` | A função Python não enxergaria `src/app/`, `src/data/` nem `src/migracoes/`, que ficam fora de `src/web/` |
| O navegador chamando `agroscan-api.vercel.app` direto | Exige CORS e quebra a regra do service worker, que reconhece a API pelo caminho `/api/` |
| `"framework": null` no `vercel.json` para forçar o modo clássico de funções | **Testado e revertido.** O `vercel.json` da raiz vale também para o projeto do PWA, que passou a ser publicado como site estático: só `public/` era servido e todas as páginas deram 404 por cerca de dez minutos. O preset fica nas configurações de cada projeto, não no arquivo compartilhado |
| Manter o preset FastAPI que a Vercel detecta | Com ele, o *rewrite* `/(.*) → /api/index` entrega ao app o caminho reescrito, e o build falha ao carregar o `@vercel/python` fixado (*pin-version-mismatch*) |
| `statement_timeout` por `ALTER ROLE` no banco | Valeria também para a conexão direta da migração. Fica disponível se um limite por consulta fizer falta |

## Consequências

- Cadastro, login, caderno e sincronização funcionam no ambiente publicado.
- O preset **Other** do `agroscan-api` foi definido no painel da Vercel
  (Settings → Build and Deployment → Framework Preset) em 08/10/2026. A Vercel
  detecta FastAPI sozinha ao criar o projeto; se ele for recriado, a troca
  precisa ser refeita, ou todo push falha na publicação da API.
- **Cada push no ramo principal publica os dois projetos.** Uma mudança no
  `vercel.json` da raiz afeta os dois, e precisa ser conferida nos dois.
- **A publicação sai de `gabicaldana/AgroScan2`**, e não deste repositório: a
  organização não autoriza ligar a Vercel aqui. Os dois repositórios mantêm o
  mesmo histórico, com o fluxo e as regras do
  [ADR 0011](adr-0011-dois-repositorios-com-espelho-de-publicacao.md).
- `/api/v1/saude` devolve a mensagem de erro do banco por extenso, com nomes de
  host. Ajudou neste diagnóstico, mas é informação interna exposta numa rota
  pública, e deve ser reduzida em produção.

## Links relacionados

- [#67](https://github.com/CampusCEUB/AgroScan/issues/67) - Republicar o ambiente e conferir a versão do catálogo exibida
- [#68](https://github.com/CampusCEUB/AgroScan/issues/68) - Conferir no ambiente publicado a nova hierarquia de entrada
- Risco R06 em [docs/arquitetura.md](../arquitetura.md); RNF23 e C11 em [docs/requisitos.md](../requisitos.md)
- [ADR 0001](adr-0001-diagnostico-no-cliente.md) - por que o diagnóstico continuou funcionando sem a API
