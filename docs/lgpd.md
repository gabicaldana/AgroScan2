# Revisão de conformidade com a LGPD

**Issue:** [#75](https://github.com/CampusCEUB/AgroScan/issues/75) - revisão de conformidade com a LGPD.
**Data:** 12/11/2026, Sprint 6.
**Requisitos:** RNF15 (minimização), RNF16 (geolocalização com consentimento),
RNF17 (exclusão efetiva), RF22 (local da consulta), critério C9 (isolamento
entre usuários).
**Resultado:** os quatro critérios da issue estão atendidos. A revisão encontrou
duas lacunas e as corrigiu no mesmo PR: o consentimento da localização, que não
existia na interface, e a falta de um aviso de privacidade no app. Ficam
registradas três pendências que não são de código (seção 10).

---

## 1. Escopo

A revisão cobre o que o AgroScan trata hoje, em produção: a API e o banco
(PostgreSQL na Neon), o PWA (Vercel) e o que fica guardado no aparelho. Foram
lidos a migração `001_esquema_inicial.sql`, os repositórios da API, os
módulos `lib/sessao.ts`, `lib/fila.ts`, `lib/caderno.ts` e `lib/conta.ts`, e as
telas que coletam ou mostram dado pessoal.

**Fora do escopo:** o diagnóstico em si. Ele roda no aparelho, sem conta e sem
rede, e não trata dado pessoal nenhum. Quem só diagnostica nunca é
identificado.

## 2. Inventário de dados pessoais

| Dado | Onde | Coletado quando | Quem vê |
| --- | --- | --- | --- |
| Nome, e-mail | `usuario` | Ao criar a conta | A própria pessoa; membros das hortas de que ela participa |
| Senha | `usuario.senha_hash`, em scrypt com sal | Ao criar a conta | Ninguém: só o hash é guardado |
| Papel (produtor, técnico…) | `usuario.papel` | Valor padrão | A própria pessoa |
| Consultas: cultura, sintomas, hipóteses, canteiro, data | `consulta`, `consulta_sintoma`, `consulta_hipotese` | Ao salvar no caderno | Só a própria pessoa (C9) |
| **Local da consulta** | `consulta.latitude`, `consulta.longitude` | **Só com a opção marcada**, arredondado a ~110 m | Só a própria pessoa; a listagem diz apenas se há local, sem a coordenada |
| Confirmação do diagnóstico e comentário | `feedback` | Quando a pessoa responde | Só a própria pessoa; entra em contagem agregada da horta |
| Anotações | `anotacao` | Quando a pessoa escreve | Membros da horta do canteiro ou a própria pessoa (consulta) |
| Participação em horta | `membro_horta` | Quando alguém a adiciona pelo e-mail | Membros da mesma horta |
| Manejos (aplicação de defensivo) | `manejo.responsavel_id` | Quando a pessoa registra | Membros da horta, com o nome de quem registrou |
| Fotos | `consulta_foto` | **Nunca.** A tabela existe no esquema e não é usada | - |

**No aparelho** (`localStorage` e IndexedDB): o token da sessão, o nome e o
e-mail de quem entrou, a última cópia do caderno e dos canteiros, e a fila de
consultas que ainda não subiram. Sair da conta apaga tudo isso
(`sessao.encerrar`), e a saída exige enviar ou apagar a fila antes
([ADR 0014](decisoes/adr-0014-sair-da-conta-com-a-fila-sem-dono.md)). Sem
conta, só a fila existe, e ela fica no aparelho.

**O que não existe:** analytics, propaganda, rastreadores ou compartilhamento
com terceiros além dos operadores de hospedagem (seção 6).

## 3. Finalidade e base legal

| Tratamento | Finalidade | Base legal (art. 7º) |
| --- | --- | --- |
| Conta, caderno, hortas, manejos, anotações | Guardar o histórico da pessoa e compartilhar a horta com quem ela escolhe; é o serviço pedido ao criar a conta | Inciso V, execução de procedimentos a pedido do titular |
| Local da consulta | Saber em que horta ou região a doença apareceu | Inciso I, consentimento, dado a cada consulta |
| Relatórios da horta | Incidência e confirmação por cultura e canteiro, para a gestão da horta | Inciso V; os relatórios são contagens, sem o nome de quem fez cada consulta |

## 4. Minimização (RNF15)

- **Conta só com o necessário:** nome, e-mail e senha. Não se pede telefone,
  CPF, endereço nem data de nascimento.
- **Diagnóstico sem conta:** o produto funciona inteiro sem cadastro
  ([ADR 0008](decisoes/adr-0008-hierarquia-de-entrada.md), RF14, teste
  `test_o_diagnostico_NAO_exige_autenticacao`).
- **Local arredondado:** a coordenada sai do aparelho com 3 casas decimais
  (`lib/localizacao.ts`, `arredondar`). O ponto exato nunca é gravado, nem na
  fila. A precisão alta do GPS fica desligada.
- **Coordenada fora da listagem:** `GET /consultas` traz só `tem_localizacao`.
  A coordenada aparece só no detalhe de uma consulta, para a dona dela, e a
  tela do caderno não a mostra.

**Achado:** membros de uma horta veem o e-mail uns dos outros
(`hortas.detalhar`). Fica como está: a pessoa é adicionada à horta pelo
e-mail, então quem a adicionou já o conhece, e o e-mail é o que distingue duas
pessoas com o mesmo nome. A exposição está declarada no aviso de privacidade.

## 5. Consentimento da localização (RNF16, RF22)

Antes desta revisão, o banco e a API aceitavam a coordenada, mas a interface
nunca a pedia: todas as consultas tinham local nulo. O consentimento foi
implementado com estas regras:

1. **Opção desmarcada a cada consulta.** "Registrar onde fiz esta consulta",
   junto do botão "Salvar no caderno". O app não lembra a escolha anterior.
2. **Informação antes do toque.** O texto da opção diz o que é guardado (o
   local aproximado, ~100 m), para quê (saber em que horta ou região a doença
   apareceu) e como apagar (no caderno), com link para o aviso de privacidade.
3. **Pedido só no toque.** A geolocalização do navegador é chamada só ao salvar
   com a opção marcada, nunca ao abrir o app ou ao diagnosticar.
4. **Recusa sem prejuízo.** Permissão negada, GPS desligado ou demora: a
   consulta é salva sem local, e a tela diz o motivo.
5. **Revogação.** No caderno, cada consulta com local mostra "Local aproximado
   registrado" e o botão "Apagar o local", que tira a coordenada e mantém a
   consulta. Na fila funciona sem rede, e a coordenada nunca chega ao servidor.
   Já sincronizada, usa `DELETE /consultas/{id}/localizacao`.

## 6. Operadores e transferência

| Operador | O que recebe | Observação |
| --- | --- | --- |
| Neon (PostgreSQL) | O banco inteiro | Hospedagem do banco ([ADR 0010](decisoes/adr-0010-publicacao-em-dois-projetos.md)) |
| Vercel | As requisições à API e ao PWA | Registra endereço IP e caminho das requisições nos logs da plataforma |

Os dois são serviços estrangeiros. A transferência internacional (art. 33)
acontece por eles, como em qualquer app hospedado nesses provedores. O
aviso de privacidade os nomeia.

## 7. Direitos do titular (art. 18) e retenção

| Direito | Como é exercido | Evidência |
| --- | --- | --- |
| Confirmação e acesso | O caderno lista todas as consultas da pessoa; "Sua conta" mostra nome e e-mail | `GET /consultas`, `GET /autenticacao/eu` |
| Eliminação do local | "Apagar o local", no caderno | `test_apagar_localizacao_*`, `caderno.test.ts` |
| Eliminação da conta (RNF17) | "Excluir a conta", em "Sua conta", com confirmação digitada | `DELETE /autenticacao/eu`; `conta.test.ts`; [ADR 0012](decisoes/adr-0012-acesso-por-horta.md) |
| Revogação do consentimento | Não marcar a opção na próxima consulta; apagar o local das anteriores | Seção 5 |
| Informação sobre o tratamento | Página `/privacidade`, que abre sem rede | Seção 8 |

**Retenção:** os dados ficam enquanto a conta existir. A exclusão apaga a
conta, o caderno, os feedbacks, as anotações e a participação em hortas. Os
manejos registrados em hortas com outras pessoas ficam, com a conta
anonimizada ("Conta excluída", e-mail inválido, senha bloqueada), porque o
registro de aplicação controla carência e resíduo para quem continua na horta.
Dado anonimizado deixa de ser dado pessoal (art. 12).

## 8. Transparência (art. 9º)

Não havia aviso de privacidade no app. Foi criada a página `/privacidade`, na
casca do service worker (abre sem rede), com link no cadastro, na tela da conta
e na opção de local. Ela diz o que é guardado, para quê, quem vê, o que fica no
aparelho, como exercer os direitos dentro do app e quem cuida dos dados.

## 9. Isolamento entre usuários (C9)

Verificado por teste automatizado, sem banco (dublê do repositório), no CI:

| Regra | Teste |
| --- | --- |
| Consulta de outra pessoa não aparece | `test_caderno.py`: `test_consulta_de_outra_pessoa_nao_e_visivel` |
| Feedback em consulta alheia é recusado | `test_caderno.py`: `test_feedback_em_consulta_de_outra_pessoa_da_404` |
| Local de consulta alheia não é apagado | `test_caderno.py`: `test_apagar_localizacao_de_outra_pessoa_da_404` |
| Horta de quem não é membro dá 404 | `test_hortas.py`: `test_horta_de_quem_nao_e_membro_da_404_e_nao_403` |
| Canteiro e manejo alheios dão 404 | `test_hortas.py`: `test_canteiro_alheio_da_404`, `test_manejo_em_canteiro_alheio_da_404` |
| Consulta de outra pessoa não se vincula a canteiro | `test_hortas.py`: `test_consulta_de_outra_pessoa_nao_e_vinculada` |
| Anotação alheia não é lida nem alterada | `test_anotacoes.py`: `test_quem_nao_e_membro_recebe_404`, `test_consulta_alheia_e_404`, `test_outro_membro_ve_mas_nao_altera_nem_apaga`, `test_quem_saiu_da_horta_nao_enxerga_nem_a_propria` |
| Rotas do caderno exigem sessão | `test_caderno.py`: `test_rotas_do_caderno_exigem_autenticacao` |

O padrão é responder 404, e não 403, ao recurso de outra pessoa: um 403
confirmaria que aquele id existe.

## 10. Pendências

Nenhuma delas é de código.

1. **Canal de contato.** O aviso de privacidade nomeia a equipe do projeto,
   mas não há e-mail para pedidos do titular. Os direitos que o app oferece
   (acesso, eliminação do local, exclusão da conta) funcionam sem contato. Os
   que dependem de pessoa, como correção do e-mail ou portabilidade, não têm
   canal ainda.
2. **Encarregado (art. 41).** Não foi indicado. Para um projeto acadêmico sem
   uso comercial, a indicação depende de definição da instituição.
3. **Retenção nos operadores.** O prazo em que os logs da Vercel e o histórico
   de restauração da Neon guardam dados depois de uma exclusão não foi
   conferido nos planos contratados.

## 11. Arquivos alterados por esta revisão

- `web/lib/localizacao.ts` e `localizacao.test.ts`: pedido, arredondamento e
  motivos de falha.
- `web/components/PainelSintomas.tsx`: a opção de local.
- `web/lib/caderno.ts`, `caderno.test.ts`, `web/components/PainelCaderno.tsx`:
  "Apagar o local".
- `app/api/rotas/consultas.py`, `repositorios/consultas.py`, `esquemas.py`,
  `tests/test_caderno.py`: `DELETE /consultas/{id}/localizacao` e
  `tem_localizacao` na listagem.
- `web/app/privacidade/page.tsx`, links no cadastro e na conta, e
  `public/sw.js` (casca v8).
