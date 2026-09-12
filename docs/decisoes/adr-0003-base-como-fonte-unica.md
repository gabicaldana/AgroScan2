# ADR 0003 - Base curada como fonte única, derivada por geração

## Status

Aprovado - implementado e verificado no pipeline de integração contínua.

## Data

2026-09-12 *(registro formal de decisão tomada no início do projeto)*

## Contexto

O mesmo conteúdo agronômico - culturas, sintomas, doenças, pesos, manejos,
ingredientes ativos - precisa existir em três lugares:

1. no **pacote do aplicativo**, porque o diagnóstico roda no navegador (ADR 0001);
2. no **banco de dados**, porque os relatórios agregam sobre o catálogo em SQL;
3. nos **testes**, porque a paridade entre implementações é verificada sobre casos derivados da base.

Manter o mesmo conteúdo em três lugares por edição manual garante divergência.
E o modo como essa divergência apareceria é especialmente perigoso: um id de
sintoma com erro de digitação **sumiria em silêncio** do perfil da doença. O
diagnóstico ficaria errado sem nenhum erro visível, sem tela quebrada e sem
exceção lançada.

## Decisão

`data/base_conhecimento.json` é a **fonte única da verdade** do conteúdo
agronômico. Todos os demais lugares são **derivados por geração**, e nunca
editados à mão:

```
base_conhecimento.json ──┬─ python -m app.validacao   recusa base incoerente
                         ├─ python -m app.fixtures    contrato de teste
                         ├─ npm run base              módulo TS embutido no pacote
                         └─ python -m app.seed        PostgreSQL (UPSERT idempotente)
```

Três garantias sustentam a decisão:

**A base valida antes de qualquer uso.** `python -m app.validacao` recusa a
carga e lista **todos** os problemas de uma vez: referência quebrada, peso fora
da faixa, doença sem sintoma clássico, sintoma órfão no catálogo, doença viral
com ingrediente ativo de controle direto. Cultura com menos de três doenças gera
**aviso**, e não erro - a base funciona, mas naquela cultura o motor não tem
segunda hipótese e a pergunta de desempate deixa de existir.

**O catálogo é carregado, nunca escrito à mão.** Ninguém digita um `INSERT` de
doença. `app/seed.py` lê o JSON, valida e aplica em `UPSERT` idempotente: rodar
duas vezes deixa o banco no mesmo estado.

**Os artefatos gerados não podem envelhecer em silêncio.** Os quatro artefatos
derivados são versionados no repositório e cada um tem teste de frescor. A
integração contínua regera tudo e falha se a árvore de trabalho não ficar limpa
(RNF20).

## Alternativas consideradas

**Catálogo mantido diretamente no banco, com interface de administração.**
Rejeitada: a curadoria passaria a exigir ambiente de execução e banco no ar, o
histórico de revisão sairia do Git, e a revisão por outra integrante da equipe
deixaria de acontecer por *pull request*. Também impediria que o conteúdo fosse
embutido no pacote do aplicativo sem um passo de exportação.

**Banco como fonte, com exportação para o cliente.** Rejeitada pelo mesmo
motivo, com o agravante de inverter a direção da geração: o conteúdo passaria a
nascer no ambiente menos auditável.

**Conteúdo duplicado nos três lugares, com revisão manual.** Rejeitada: é
exatamente o cenário de divergência silenciosa descrito no contexto.

## Consequências

**Positivas**

- A curadoria é trabalho de texto versionado: revisável por *pull request*, com histórico e autoria rastreáveis.
- Um erro de digitação é barrado antes de chegar ao produtor.
- A base não carrega identidade de dataset: as fichas descrevem agronomia e nada sobre qual acervo de imagens existe ou qual modelo foi treinado. Isso permite trocar de acervo sem tocar em uma linha de curadoria.
- A curadoria avança sem depender do código, o que importa porque ela é o gargalo do projeto (risco R01).

**Negativas e custos aceitos**

- Toda alteração de conteúdo exige rodar a sequência de geração antes do commit. O CI cobra, mas o desenvolvedor precisa lembrar localmente.
- Não há interface de administração para a curadoria: edita-se JSON. Aceitável porque as curadoras são as próprias desenvolvedoras.
- Os artefatos gerados ficam versionados, o que produz *diffs* grandes em commits de curadoria.

## Links relacionados

- Requisitos: RNF18, RNF20, RN04, RN05, RN06, RN07
- Código: `data/base_conhecimento.json`, `app/validacao.py`, `app/seed.py`, `web/scripts/gerar-base.mjs`
- [ADR 0004 - Paridade entre motores](adr-0004-paridade-entre-motores.md)
- [Artefato 3, §2.7](../artefato-3-gestao-do-produto.md#27-como-a-base-curada-chega-aos-três-lugares)
