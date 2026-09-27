# ADR 0009 - Idempotência da sincronização garantida no banco

## Status

Aprovado - implementado e verificado por teste automatizado.

## Data

2026-09-12 *(registro formal de decisão tomada no início do projeto)*

## Contexto

O produtor registra consultas sem conexão, e elas entram numa fila local que
sobe quando houver rede. O problema aparece na falha parcial: o aplicativo envia
um lote, a conexão cai antes da resposta chegar, e **o cliente não tem como
saber se o servidor recebeu**.

As duas escolhas possíveis diante dessa dúvida são ruins de formas diferentes:
não reenviar arrisca perder a consulta; reenviar arrisca duplicá-la. Uma
consulta duplicada no caderno não é apenas um incômodo visual - ela **distorce
os relatórios de incidência**, que contam ocorrências por doença e por período.

Reenviar a fila é, portanto, o **caso normal** de operação, e não a exceção.

## Decisão

Cada consulta nasce no aparelho com um identificador próprio, o `offline_id`,
gerado no cliente antes de qualquer tentativa de envio. A coluna correspondente
no banco tem **restrição de unicidade**, e a inserção usa `ON CONFLICT`.

A garantia de não duplicar mora no **banco**, e não apenas no código do cliente.

O endpoint de sincronização recebe um lote e responde classificando cada item em
três categorias:

| Categoria | Significado | Ação do cliente |
| --- | --- | --- |
| **aceita** | Registro criado | Remove da fila |
| **duplicada** | Já existia, com o mesmo `offline_id` | Remove da fila - o envio anterior chegou |
| **rejeitada** | Falhou na validação contra o catálogo | Mantém na fila e sinaliza ao usuário |

A distinção entre "duplicada" e "rejeitada" é o que permite ao cliente esvaziar
a fila com segurança: duplicada é sucesso, e não erro.

Para edição concorrente do mesmo registro, prevalece a última escrita recebida
(RN11). É adequado ao domínio: o dado é de um único autor, e conflito real é
raro.

## Alternativas consideradas

**Controle apenas no cliente**, marcando itens como enviados. Rejeitada: não
sobrevive à falha parcial descrita no contexto, que é exatamente o cenário que a
decisão precisa cobrir. Também não protege contra dois dispositivos da mesma
conta enviando a mesma fila.

**Deduplicação por conteúdo** - comparar cultura, sintomas, hipóteses e
carimbo de tempo. Rejeitada: duas consultas legítimas e idênticas são
possíveis. O produtor pode diagnosticar dois pés da mesma cultura com os mesmos
sintomas em minutos de diferença, e as duas devem contar.

**Identificador gerado pelo servidor.** Rejeitada: exigiria uma ida à rede para
criar a consulta, o que é impossível offline.

**Transação única para o lote inteiro.** Rejeitada: um item rejeitado por
validação faria o lote todo falhar, e o produtor perderia consultas válidas por
causa de uma inválida.

## Consequências

**Positivas**

- O reenvio é seguro por construção, e o cliente pode reenviar sempre que houver dúvida.
- A garantia não depende da correção do código do cliente, que é a parte do sistema em que a equipe tem menos controle sobre o estado.
- Os relatórios de incidência ficam confiáveis, porque a contagem não inflaciona.
- O comportamento é verificado por teste automatizado (TI08, TI09).

**Negativas e custos aceitos**

- O cliente precisa gerar e persistir o identificador antes de tentar enviar, o que acrescenta estado local a gerenciar.
- A resposta da sincronização é mais complexa do que um simples código de status, e o cliente precisa tratar as três categorias.
- A restrição de unicidade no banco ainda **não é exercitada pelos testes automatizados**, que usam cliente de teste em memória sem banco real. Lacuna registrada no Artefato 3, §3.5, com correção prevista para a Sprint 3.

## Links relacionados

- Requisitos e regras: RF17, RF18, RN10, RN11, RNF28
- Histórias: US17, US18
- Código: `web/lib/fila.ts`, `app/api/rotas/consultas.py`, `app/api/repositorios/consultas.py`, `migracoes/001_esquema_inicial.sql`
- [Artefato 3, §2.5 - Fluxo de sincronização](../../entregas/artefato-3-gestao-do-produto.md#25-fluxo-2---sincronização-da-fila)
