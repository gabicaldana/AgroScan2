# Reunião - Sprint 1 · Revisão

Reunião de encerramento da **Sprint 1 - Especificação e gestão** (31/08/2026 a 14/09/2026), para demonstrar o incremento, aceitar as histórias contra os critérios e conduzir a retrospectiva.

## Data

14/09/2026

> A data corresponde ao último dia da sprint, conforme a cadência definida em [`sprint-00-planejamento.md`](../../sprints/sprint-00-planejamento.md). ⚠️ Confirmar a data em que a reunião de fato ocorreu.

## Participantes

| Nome | Matrícula | Papel |
| --- | --- | --- |
| Gabriela Pedersoli Caldana | 22404253 | ⚠️ a definir |
| Thaís Regina Dias da Mota | 22403754 | ⚠️ a definir |

> A distribuição nominal dos papéis Scrum está pendente, conforme
> [`sprints/sprint-00-planejamento.md`](../../sprints/sprint-00-planejamento.md).

## Pauta

1. Demonstração do incremento construído no ciclo
2. Aceite história a história contra os critérios de aceite e o Definition of Done
3. Conferência de que o ambiente publicado reflete a versão entregue (critério C11)
4. Retrospectiva: o que funcionou, o que não funcionou, ajustes de processo
5. Atualização do relatório da sprint e do CHANGELOG
6. Encaminhamentos para o planejamento do ciclo seguinte

## Decisões

### Aceite do incremento

O ciclo entregou os três artefatos avaliativos e consolidou o incremento já
construído. Registro completo em
[`sprints/sprint-01.md`](../../sprints/sprint-01.md).

| Entrega | Verificação |
| --- | --- |
| Artefatos 1, 2 e 3 | Documentos no formato pedido pela disciplina |
| Requisitos consolidados com matriz de rastreabilidade | [`docs/requisitos.md`](../requisitos.md) |
| Arquitetura da solução | [`docs/arquitetura.md`](../arquitetura.md) |
| Nove ADRs das decisões arquiteturais | [`docs/decisoes/`](../decisoes/) |
| Diagnóstico por sintomas offline, com desempate e declaração de desconhecimento | 28 testes do motor + 102 testes do porte |
| API REST publicada | 8 testes HTTP |
| Banco PostgreSQL: 19 tabelas, DDL numerado e reversível, carga idempotente | `migracoes/`, `app/seed.py` |
| Autenticação com scrypt e JWT; exclusão de conta pela API | 11 testes de segurança |
| Caderno de campo com fila de sincronização e idempotência | 14 testes de caderno |
| PWA instalável com service worker escrito à mão | Instalação verificada em Android |
| Integração contínua que bloqueia artefatos desatualizados | `.github/workflows/ci.yml` |

**Total: 176 testes automatizados, nenhuma falha**, verificados em 12/09/2026
sobre o commit `068b6d9`. **88 de 172 pontos do núcleo concluídos (51%).**

### Correções aplicadas no ciclo

| Correção | Origem |
| --- | --- |
| Hierarquia de entrada: a tela inicial passou a ser o diagnóstico por sintomas; a captura por foto saiu da navegação; service worker de `v4` para `v5` | ADR 0008 |
| Dependência de teste ausente: criado `requirements-dev.txt` e acrescentado passo de CI que falha se os testes da API forem pulados | Risco R07 |
| README do repositório de código atualizado - afirmava que a API não fora construída | Retrospectiva |

### Retrospectiva - o que funcionou

- **A base de conhecimento como fonte única derivada por geração** (ADR 0003) se pagou: documentar o sistema foi possível porque conteúdo agronômico, testes e banco derivam do mesmo arquivo, sem divergência a reconciliar.
- **A paridade entre implementações do motor** (ADR 0004) deu à documentação de testes uma base concreta: 176 testes com resultado verificável, em vez de afirmações sobre qualidade.
- **A reformulação para hortaliças com curadoria por família botânica** tornou a meta de 24 culturas defensável: sete levantamentos em vez de 24.

### Retrospectiva - o que não funcionou

- **A documentação envelheceu em relação ao código.** Descrever o estado do projeto em prosa, em vários lugares, garante divergência - o mesmo erro que a arquitetura evita para o conteúdo agronômico, cometido na documentação.
- **Os artefatos anteriores tinham contradição interna.** O Artefato 1 definia o engenheiro agrônomo como usuário principal, enquanto a delimitação de escopo afirmava que o sistema não o substitui. A contradição sobreviveu porque nenhuma revisão comparou os artefatos entre si.
- **O desenvolvimento aconteceu sem `issues` nem `pull requests`.** O trabalho foi integrado por commits diretos, o que deixou a sprint sem rastreabilidade entre backlog e execução - exatamente o que o repositório institucional existe para registrar.
- **O ambiente publicado ficou defasado sem ninguém notar.**
- **A soma dos pontos do backlog estava errada**: 155 em vez de 167 na versão anterior. Erro de conferência sem consequência prática, mas que invalidava a métrica de progresso.

### Ajustes de processo para o próximo ciclo

| Ajuste | Origem |
| --- | --- |
| Toda integração passa por `pull request` com revisão, vinculado a uma `issue` | Falta de rastreabilidade neste ciclo |
| "O ambiente publicado reflete a versão entregue" entra no Definition of Done (critério C11) | Risco R06 |
| O estado do projeto passa a ser afirmado **em um único lugar** - o README do repositório de código - e referenciado pelos demais | Documentação envelhecida |
| A revisão cruzada passa a conferir coerência **entre** artefatos, e não apenas dentro de cada um | Contradição do público-alvo |
| Criar as `milestones` e `issues` **antes** de iniciar o desenvolvimento da sprint | Falta de rastreabilidade |

## Encaminhamentos

| # | Encaminhamento | Origem |
| --- | --- | --- |
| 1 | Criar o GitHub Project, as `milestones` e as `issues` das histórias | Pendência do Artefato 2, §5 |
| 2 | Corrigir a dependência de teste ausente e confirmar que o CI executa os testes da API | Risco R07 |
| 3 | Republicar o ambiente e conferir a versão do catálogo exibida | Risco R06 |
| 4 | Atualizar o README do repositório de código para o estado real | Retrospectiva |
| 5 | Elevar batata e pimentão ao mínimo de três doenças | Conformidade com RN05 |
| 6 | Curadoria das brássicas - 6 culturas (US03) | Épico E1 |
| 7 | Implementar a sincronização de catálogo no cliente (US36) | Épico E7 |
| 8 | Conferir no ambiente publicado a nova hierarquia de entrada | ADR 0008 |

## Impedimentos

| # | Impedimento | Efeito | Situação |
| --- | --- | --- | --- |
| 1 | Comunidade parceira da Atividade de Extensão não definida (R03) | Impede fixar a priorização das famílias botânicas e a data da apresentação | Aberto - depende da coordenação da disciplina |
| 2 | Datas do Artefato 5 e da apresentação à comunidade não divulgadas | O calendário das Sprints 6 e 7 é provisório | Aberto - depende da professora |
| 3 | Reformulação do formato das entregas pela disciplina | Os artefatos produzidos anteriormente tiveram de ser refeitos, consumindo capacidade do ciclo | **Resolvido neste ciclo** |
| 4 | Dependência de teste ausente (R07) | 22 testes de integração da API não executam de forma confiável | Aberto - correção na Sprint 2 |
| 5 | Papéis Scrum não atribuídos nominalmente | Os papéis estão descritos, mas sem indicação de quem responde por cada um | Aberto - depende da equipe |

## Links

| Registro | Onde |
| --- | --- |
| Milestone | `Sprint 1 - Especificação e gestão` |
| Issue desta reunião | [#51](https://github.com/CampusCEUB/AgroScan/issues/51) |
| Relatório da sprint | [`sprints/sprint-01.md`](../../sprints/sprint-01.md) |
| Backlog | [Artefato 2, §2.5](../artefato-2-gestao-do-projeto.md) |
| Calendário das sprints | [`sprints/README.md`](../../sprints/README.md) |
