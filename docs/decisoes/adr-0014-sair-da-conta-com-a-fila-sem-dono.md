# ADR 0014 - Sair da conta com aviso sobre a fila, sem dono gravado nos registros

## Status

Aprovado pela equipe em 2026-11-06, para implementação na Sprint 5 (US42).

## Data

2026-11-06

## Contexto

O aplicativo não oferecia como sair da conta. A sessão só terminava quando o
token vencia ou quando a conta era excluída pela API. O público do AgroScan
divide o aparelho com frequência, entre o celular da família e o da horta
comunitária, e sem uma saída a próxima pessoa veria o caderno de quem usou
antes e salvaria consultas em nome dela.

`sessao.encerrar()` já apagava o token e as cópias guardadas do caderno e dos
canteiros, que ficam guardadas com o id do dono. Faltava a interface. O ponto
delicado é a **fila offline** (`lib/fila.ts`): os registros que ainda não
subiram **não guardam de quem são**. A fila é do aparelho, e não da conta, e
isso é intencional. O diagnóstico feito sem conta (RF14) sobe para a conta em
que a pessoa entrar depois, sem perder o que foi observado no canteiro.

Esse desenho tem uma consequência: quem sai com diagnósticos ainda na fila,
por estar sem sinal, deixa esses registros no aparelho, e eles sobem para a
**próxima conta** que entrar ali, como se fossem dela. Isso mistura o caderno
de duas pessoas e falseia os relatórios da horta da segunda (US27, US28,
US29).

## Decisão

1. **Uma tela "Conta"**, aberta por um botão no cabeçalho, mostra o nome e o
   e-mail de quem está conectado e tem o botão **Sair**. A exclusão de conta
   (US15) entra na mesma tela quando for feita.
2. **Sair tenta enviar a fila primeiro.** Se tudo subir, a sessão termina.
3. **Se ainda houver registros na fila**, seja por falta de rede, seja por uma
   recusa do servidor, o aplicativo diz quantos são e oferece duas saídas: **ficar e
   enviar depois**, a opção padrão, ou **apagar esses registros do aparelho e
   sair**. Não há caminho que saia da conta deixando a fila para a próxima
   pessoa.
4. **A fila continua sem dono.** O diagnóstico feito sem conta continua
   subindo para a conta em que a pessoa entrar.

## Alternativas consideradas

- **Gravar o dono em cada registro da fila.** Cada consulta enfileirada com
  sessão levaria o id da conta, e a sincronização só enviaria os registros da
  conta atual e os sem dono. Resolve também o caso de quem sai e volta mais
  tarde: os registros esperariam a conta certa. Não foi escolhida porque mexe
  no formato da fila gravada no IndexedDB, que exigiria migração dos registros
  já existentes nos aparelhos, e na regra de despacho, que é o caminho mais
  sensível do aplicativo: um defeito ali perde observação de campo. O caso real
  é resolvido pelo aviso com bem menos risco.
- **Sair sem aviso, mantendo a fila.** É o comportamento que o problema
  descreve: os registros sobem para a próxima conta. Descartada.
- **Sair apagando a fila sempre.** Perde, sem a pessoa saber, o que ela
  observou no canteiro. Descartada pela mesma regra de `lib/fila.ts`: perder o
  registro do produtor é o pior desfecho possível do aplicativo.
- **Bloquear a saída enquanto houver fila.** Prende a pessoa a uma conta num
  aparelho que talvez nem seja dela, e sem sinal à vista. Descartada.

## Consequências

- Sair com fila pendente pede uma escolha explícita. Quem escolhe apagar perde
  aqueles registros, e a tela diz isso antes da confirmação.
- Quem sai **com a fila vazia** e depois faz diagnósticos sem conta continua
  subindo esses diagnósticos para a conta em que entrar, que é o comportamento
  desejado (RF14).
- Fica uma lacuna conhecida. Se a sessão termina **sem passar pela tela**,
  quando o token vence ou o servidor responde 401, a fila não é conferida, e
  os registros pendentes subirão para a conta em que se entrar a seguir,
  normalmente a mesma pessoa entrando de novo. Se isso se mostrar um problema
  real, a alternativa de gravar o dono nos registros volta à mesa.

## Links relacionados

- Issue: [#97 - US42 - Sair da conta](https://github.com/CampusCEUB/AgroScan/issues/97)
- Requisito: RF13 - autenticar o usuário e manter a sessão ([`requisitos.md`](../requisitos.md))
- Fila offline: [`src/web/lib/fila.ts`](../../src/web/lib/fila.ts); sessão: [`src/web/lib/sessao.ts`](../../src/web/lib/sessao.ts)
- Relacionadas: [ADR 0009](adr-0009-idempotencia-no-banco.md) (idempotência da sincronização), [ADR 0012](adr-0012-acesso-por-horta.md) (exclusão de conta)
