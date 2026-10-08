# ADR 0011 - Dois repositórios: o institucional completo, o pessoal como espelho de publicação

## Status

Aprovado - substitui a pendência "reapontar a Vercel para o repositório
institucional", registrada no Artefato 2 (§4.1) e no
[ADR 0010](adr-0010-publicacao-em-dois-projetos.md).

## Data

2026-10-08

## Contexto

Desde a Sprint 2 o código vive no repositório institucional,
`CampusCEUB/AgroScan`, ao lado da documentação que o descreve. É ele que a
disciplina avalia, e ele precisa conter o projeto **inteiro**.

A publicação, porém, sai da Vercel, ligada a `gabicaldana/AgroScan2`. Ligar a
Vercel a um repositório de uma organização exige que a organização autorize a
integração, e **essa autorização não será concedida**. A pendência de reapontar
a Vercel, mantida aberta desde a migração, não tem como ser resolvida.

## Decisão

**Manter os dois repositórios, cada um com um papel:**

| Repositório | Papel | Contém |
| --- | --- | --- |
| `CampusCEUB/AgroScan` | **Fonte avaliada e completa** | Tudo: código, base, testes, documentação, issues, milestones, PRs |
| `gabicaldana/AgroScan2` | **Espelho de publicação** | O mesmo histórico do `main` institucional; é o que a Vercel publica |

**Os dois `main` têm o mesmo histórico, commit a commit.** Não há conteúdo que
exista só no AgroScan2.

**Fluxo de uma mudança:**

1. O commit entra no `main` do AgroScan2, e a Vercel publica.
2. A mudança é conferida no ambiente publicado (critério C11).
3. Os **mesmos commits** vão ao institucional num branch com o padrão do
   [CONTRIBUTING](../../CONTRIBUTING.md), por pull request ligado à issue.
4. Depois do merge, o `main` do AgroScan2 avança até o `main` institucional,
   para incluir o commit de merge do PR.

```bash
git fetch institucional
git push origin institucional/main:main    # só fast-forward
```

**Regras:**

- **Nunca force push no AgroScan2.** Se o push do passo 4 for recusado, alguém
  publicou algo que ainda não foi ao institucional: leve isso ao institucional
  primeiro, e só depois avance o espelho.
- **Conferência ao fim de cada sprint:** o hash do `main` é o mesmo nos dois
  repositórios (`git rev-parse origin/main institucional/main`). Faz parte do
  critério C11.

## Alternativas consideradas

| Alternativa | Por que não |
| --- | --- |
| Ligar a Vercel ao repositório institucional | Exige autorização da organização, que não será concedida |
| Código só no AgroScan2, documentação no institucional | Já foi o modelo até a Sprint 2 e foi abandonado: o repositório avaliado não continha o produto, e a documentação envelheceu em relação ao código (Artefato 2, §4.1) |
| Publicar pela CLI da Vercel a partir de um clone do institucional | Tira a publicação do histórico do Git: o que está no ar deixa de corresponder a um commit identificável |
| Sincronizar por GitHub Action no institucional | Exige guardar no institucional um token com escrita no repositório pessoal, o que também depende de permissão da organização |

## Consequências

- O repositório avaliado continua completo, e o ambiente publicado continua
  automático a cada push.
- **O R06 muda de natureza.** O risco deixa de ser "publicação ligada ao
  repositório errado" e passa a ser "espelho atrasado ou divergente". A
  mitigação é a regra do fast-forward e a comparação de hashes ao fim de cada
  sprint.
- Há um passo manual a mais por mudança, o passo 4. Esquecê-lo não quebra o
  site, mas deixa o espelho sem o commit de merge, e o próximo push ao
  AgroScan2 parte de uma base que o institucional não tem.
- Os hashes citados nos relatórios resolvem nos dois repositórios.

## Links relacionados

- [ADR 0010](adr-0010-publicacao-em-dois-projetos.md) - os dois projetos da Vercel
- [#67](https://github.com/CampusCEUB/AgroScan/issues/67) - Republicar o ambiente
- Artefato 2, [§4.1](../../entregas/artefato-2-gestao-do-projeto.md#41-repositório-único) - por que o código veio para o institucional
- Risco R06 em [docs/arquitetura.md](../arquitetura.md); critério C11 em [docs/requisitos.md](../requisitos.md)
