# ADR 0013 - Sucessão de canteiros pelo nome, e o alerta de rotação nos dois últimos ciclos

## Status

Proposto - implementado na Sprint 4 (US30, migração 004), aguardando a revisão
da equipe no pull request.

## Data

2026-10-24

## Contexto

O [ADR 0012](adr-0012-acesso-por-horta.md) decidiu que canteiro não muda de
cultura: plantar outra coisa no mesmo lugar é encerrar o canteiro e cadastrar
outro, e é essa sucessão que alimenta o alerta de rotação de família (US30).

A conferência do [`modelo-de-dados.md` §6](../modelo-de-dados.md) contra o banco
real, feita na Sprint 4, mostrou que a decisão não tinha como funcionar. A
migração 001 declarava `UNIQUE (horta_id, identificacao)` sobre **todos** os
canteiros, inclusive os encerrados. O canteiro novo não podia ter o nome do
anterior, e não havia outro dado que dissesse que dois canteiros ocupam o mesmo
lugar. A consulta do alerta (§6.4) não encontrava sucessão em banco nenhum.

A consulta também contava ciclos de qualquer época e exigia duas repetições
para alertar, o que deixava passar o caso mais comum: solanácea logo depois de
solanácea.

## Decisão

1. **O lugar é o nome.** A sucessão de um lugar são os canteiros da mesma horta
   com a mesma identificação, na ordem do `id`. A unicidade do nome passa a
   valer só entre os canteiros **ativos**, por índice parcial (migração 004):
   dois canteiros em cultivo com o mesmo nome continuam recusados, e o nome
   fica livre quando o ciclo encerra.
2. **O alerta olha os dois últimos ciclos do lugar.** Alerta quando a cultura
   repete a família botânica do ciclo anterior ou do que veio antes dele. É o
   intervalo mínimo que o manejo de doenças de solo recomenda antes de voltar à
   mesma família.
3. **O alerta aparece antes do plantio, e não bloqueia.** A tela de cadastro
   pergunta à API enquanto a pessoa preenche; o relatório da horta lista os
   canteiros em cultivo que já repetem. Quem decide plantar é quem está no
   canteiro.
4. A tela de cadastro **sugere os nomes dos canteiros encerrados**, para o
   replantio usar o mesmo nome sem depender de a pessoa lembrar como digitou.

## Alternativas consideradas

| Alternativa | Por que não |
| --- | --- |
| Uma tabela `lugar` (ou `canteiro_anterior_id`) ligando os ciclos | Mais uma entidade para a pessoa manter, e a mesma informação que o nome já carrega na fala de quem cuida da horta ("o Canteiro 3"). Fica como caminho se o nome se mostrar instável |
| Deixar o canteiro mudar de cultura, com histórico de plantios | Contraria o ADR 0012 e o §5.4 do modelo: a consulta guarda o canteiro, e a cultura daquele dia precisa continuar dizendo a verdade |
| Manter `HAVING count(*) >= 2` sobre todo o histórico | Não alerta a repetição no ciclo seguinte, que é o caso que mais acumula inóculo; e alertaria por um plantio de anos atrás |
| Bloquear o cadastro quando repete | A rotação depende de espaço, mercado e semente disponíveis; o app informa, não decide |

## Consequências

- O alerta depende de a pessoa reusar o nome. "Canteiro 3" e "canteiro 3" são
  lugares diferentes, como já eram para a unicidade.
- Reativar um canteiro encerrado cujo nome já foi reaproveitado responde 409.
- A reversão da 004 falha se houver dois canteiros com o mesmo nome na mesma
  horta, e deve falhar: seria preciso renomear ciclos e perder a sucessão.
- A regra dos dois ciclos é uma constante (`CICLOS_RECENTES`, em
  `src/app/api/rotas/relatorios.py`); mudar o critério é mudar um número e o
  teste que o descreve.

## Links relacionados

- História: [#33](https://github.com/CampusCEUB/AgroScan/issues/33) US30
- Migração: [`src/migracoes/004_canteiro_sucessao_pelo_nome.sql`](../../src/migracoes/004_canteiro_sucessao_pelo_nome.sql)
- Conferência: [`modelo-de-dados.md` §6.6](../modelo-de-dados.md)
- Testes: `src/tests/test_relatorios.py`, `src/tests/test_relatorios_banco.py`
