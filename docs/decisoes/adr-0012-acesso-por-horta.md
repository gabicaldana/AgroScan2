# ADR 0012 - Acesso por participação na horta, e exclusão de conta com anonimização

## Status

Aprovado - implementado na Sprint 3 (US22-US26), com testes de contrato HTTP.

## Data

2026-10-09

## Contexto

O épico E5 transforma a horta em dado **compartilhado**: várias pessoas
cadastram canteiros e registram manejo na mesma área. Até aqui, todo registro
tinha um dono só (a consulta é de quem a fez), e a regra de acesso era trivial.
Com a horta, é preciso decidir quem vê, quem altera e o que acontece quando
alguém sai — inclusive do sistema.

Duas restrições já estavam no esquema da migração 001:

- `horta.responsavel_id` com `ON DELETE RESTRICT`: excluir quem responde por
  uma horta coletiva apagaria trabalho de outras pessoas.
- `manejo.responsavel_id` com `ON DELETE RESTRICT`: o registro de aplicação de
  defensivo tem valor de rastreabilidade e não perde a autoria
  ([modelo de dados](../modelo-de-dados.md)).

Sem tratamento na aplicação, as duas faziam a exclusão de conta responder
**erro 500** — e a segunda impedia para sempre a eliminação de quem tivesse
registrado um manejo, o que contraria a LGPD.

## Decisão

### Quem pode o quê

| Ação | Quem |
| --- | --- |
| Ver a horta, os membros e os canteiros | Membros |
| Alterar nome e local, adicionar e remover membros, apagar a horta | Só o **responsável** |
| Cadastrar e encerrar canteiro, registrar manejo | Qualquer membro |
| Sair da horta | O próprio membro (o responsável, só depois de transferir) |

- **Quem não participa recebe 404, nunca 403.** Um 403 confirmaria que aquele
  id existe — o mesmo critério já usado nas consultas.
- **Há sempre exatamente um responsável.** Membro novo entra como membro; a
  responsabilidade muda só por transferência, e só para quem já é membro.
- **Apagar a horta exige que ela não tenha outros membros.** Com outras pessoas,
  o caminho é transferir ou removê-las antes.
- **Canteiro não é apagado, é encerrado**, e a cultura dele não muda: plantar
  outra coisa no mesmo lugar é um canteiro novo. É a sucessão de canteiros
  encerrados que permite o alerta de rotação de família (US30).
- **A consulta só se vincula a canteiro de uma horta da pessoa** (US25). Na fila
  offline, o canteiro alheio vira "rejeitada" com o motivo, e a consulta fica no
  aparelho em vez de entrar presa a algo que a pessoa não enxerga mais.

Numa horta comunitária é quem está no canteiro que sabe o que foi plantado e
aplicado; por isso canteiro e manejo são de qualquer membro, e só a estrutura
da horta (quem participa, se ela existe) é do responsável.

### Exclusão de conta

1. Hortas em que a pessoa é **responsável e única participante** são apagadas
   junto, com canteiros e manejos.
2. Se ela é responsável por horta **com outros membros**, a exclusão responde
   **409** pedindo a transferência antes.
3. Sem manejo registrado, a conta é **apagada**, e o `CASCADE` leva consultas,
   feedbacks, anotações e participações.
4. Com manejo registrado, a conta é **anonimizada**: apaga-se tudo o que o
   `CASCADE` apagaria, e a linha fica como "Conta excluída", com e-mail e senha
   invalidados e inativa. O manejo continua no histórico do canteiro, apontando
   para ninguém identificável. Dado anonimizado deixa de ser dado pessoal
   (LGPD, art. 12).

## Alternativas consideradas

| Alternativa | Por que não |
| --- | --- |
| Qualquer membro altera tudo | Uma pessoa sozinha poderia remover as outras ou apagar a horta |
| Só o responsável cadastra canteiro e manejo | Numa horta comunitária, concentraria o registro em quem menos está no canteiro |
| Vários responsáveis por horta | Duas fontes de verdade (`horta.responsavel_id` e `membro_horta.papel`) divergindo; e "responsável" deixaria de responder a quem procurar |
| `manejo.responsavel_id` com `ON DELETE SET NULL` | **Implementado e revertido antes de ir ao banco.** Contrariava a decisão documentada de não perder a autoria do registro de defensivo |
| Manter o `RESTRICT` e recusar a exclusão | Trava o direito de eliminação de quem registrou um manejo |

## Consequências

- Uma tabela nova que referencie `usuario` com `ON DELETE CASCADE` precisa
  entrar também na lista da anonimização (`app/api/repositorios/usuarios.py`),
  ou ficará dado pessoal para trás numa conta anonimizada.
- Adicionar membro pelo e-mail revela se aquele e-mail tem conta — mas só a
  quem já é responsável por uma horta, e sem isso não haveria como dizer
  "peça para a pessoa criar a conta primeiro".
- A lista de canteiros fica guardada no aparelho, por dono e apagada ao sair,
  para a consulta poder ser vinculada sem rede.

## Links relacionados

- Histórias: [#25](https://github.com/CampusCEUB/AgroScan/issues/25) US22,
  [#26](https://github.com/CampusCEUB/AgroScan/issues/26) US23,
  [#27](https://github.com/CampusCEUB/AgroScan/issues/27) US24,
  [#28](https://github.com/CampusCEUB/AgroScan/issues/28) US25,
  [#29](https://github.com/CampusCEUB/AgroScan/issues/29) US26
- [ADR 0009](adr-0009-idempotencia-no-banco.md) - a fila offline que a US25 estende
- Testes: `tests/test_hortas.py`
