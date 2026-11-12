# Auditoria de acessibilidade WCAG 2.1 AAA

**Issue:** [#76](https://github.com/CampusCEUB/AgroScan/issues/76) - auditoria de acessibilidade WCAG 2.1 AAA.
**Data:** 12/11/2026, Sprint 6.
**Requisitos:** RNF05 (contraste AAA), RNF06 (alvo de 56 px), RNF07 (corpo de
18 px), RNF08 (nada só por cor), RNF09 (português).
**Resultado:** a primeira medição encontrou falhas de contraste em todas as 12
telas, texto abaixo de 18 px em todas e alvos menores que 56 px em todas. Eram
três causas no sistema de design, e não falhas espalhadas. Corrigidas as
causas, a segunda medição deu **zero** apontamentos do axe-core nas regras
WCAG 2.1 A, AA e AAA, **zero** alvos abaixo de 56 px e **nenhum** texto
abaixo de 18 px.

---

## 1. Método

- **Ferramenta:** [axe-core](https://github.com/dequelabs/axe-core), com as
  regras marcadas `wcag2a`, `wcag2aa`, `wcag2aaa`, `wcag21a`, `wcag21aa`,
  `wcag21aaa` e `wcag22aa`, rodando no Chromium headless sobre o build de
  produção (`next build` + `next start`).
- **Tela:** 390 × 844 px, um celular comum. O gráfico de relatórios foi medido
  também em 320 px.
- **Medidas próprias**, que o axe não cobre com os limites do projeto:
  - **alvo de toque (RNF06):** a caixa de todo link, botão, campo e seleção
    visível, com mais de 55,5 px nos dois lados. Caixa de seleção dentro de
    rótulo conta pelo rótulo inteiro, que é a área que responde ao toque;
  - **tamanho de texto (RNF07):** o tamanho calculado de todo nó de texto
    visível.
- **Telas:** as 12 do app. As que exigem conta (caderno com registros, conta,
  hortas, horta, canteiro e relatórios) receberam dados fictícios por
  interceptação das chamadas à API, sem banco.

| Tela | Estado auditado |
| --- | --- |
| Início | Sem sintoma marcado |
| Início, com hipóteses | Dois sintomas marcados: ranking, próxima observação, botão de salvar |
| Laudo | `/resultado` da pinta-preta |
| Caderno vazio | Sem conta e sem registro |
| Entrar | Formulário |
| Privacidade | `/privacidade` (do PR da revisão LGPD, #107) |
| Caderno | Com conta e um registro |
| Sua conta | Com a exclusão aberta |
| Hortas, horta, canteiro | Com uma horta, dois canteiros (um encerrado), um manejo e uma anotação |
| Relatórios | Os quatro relatórios preenchidos |

## 2. Primeira medição: achados

| # | Achado | Critério | Telas | Medida |
| --- | --- | --- | --- | --- |
| A1 | O verde `primaria` (#15803d) contra branco, como texto ("Scan" do logotipo, links, "Anotações", "verifique") e como fundo de botão com texto branco | 1.4.6 (AAA, 7:1), RNF05 | 12 de 12 | **5,01:1** |
| A2 | Título do aviso do laudo, `alerta` (#b45309) sobre `alerta-fundo` | 1.4.6, RNF05 | Laudo | **4,84:1** |
| A3 | `texto-suave` (#57534e) sobre `superficie` (#f5f5f4), nos quadros tracejados de estado vazio | 1.4.6, RNF05 | Início, caderno vazio | **6,99:1** |
| A4 | O `body` não definia tamanho: todo texto sem classe saía com os 16 px do navegador (descrições, parágrafos do laudo, títulos de seção) | RNF07 | 12 de 12 | 16 px |
| A5 | `text-sm` (14 px) em mais de cem lugares, a maior parte em parágrafos; `text-xs` (12 px) no selo "verifique" | RNF07 | 12 de 12 | 14 e 12 px |
| A6 | Rótulos do gráfico de diagnósticos por mês | RNF07 | Relatórios | 11 px no SVG |
| A7 | "Entrar" e "Sua conta", no cabeçalho | 2.5.5 (AAA, 44 px), RNF06 | 12 de 12 | 44 px de altura |
| A8 | Links "← Hortas", "← Horta", "← (horta do canteiro)" e "Ver detalhes" | 2.5.5, RNF06 | Horta, canteiro, relatórios | 18 a 20 px de altura |
| A9 | "Limpar" (sintomas marcados) e "Anotações" | 2.5.5, RNF06 | Início, caderno | 36 e 20 px de altura |
| A10 | "Editar" e "Apagar" da anotação | RNF06 | Canteiro | 40 e 47 px de largura |
| A11 | A página de endereço inexistente era a padrão do Next: em inglês ("This page could not be found.") e com 14 px | RNF09, RNF07 | 404 | - |

Nenhuma outra regra do axe falhou: nomes acessíveis, rótulos de campo,
estrutura de títulos, idioma da página, `aria-*` e foco estavam corretos.

## 3. Correções

**Contraste (A1-A3)**, nos tokens de `app/globals.css`, sem mudar a identidade:

| Token | Antes | Depois | Contraste |
| --- | --- | --- | --- |
| `primaria` | #15803d | #166534 | 7,13:1 com branco, nos dois sentidos (o mesmo verde da barra inferior) |
| `primaria-escura` (pressionado) | #166534 | #14532d | 9,11:1 |
| `alerta` | #b45309 | #78350f | 8,75:1 sobre `alerta-fundo` |
| `texto-suave` e `offline` | #57534e | #4f4b46 | 8,6:1 no branco, 7,9:1 na `superficie` |

A cor do tema do navegador (`themeColor`, `manifest`) acompanhou a `primaria`.

**Texto (A4-A6)**
- `body` com `font-size` e `line-height` do corpo (18 px, 1,6).
- `--text-sm` e `--text-xs` igualados ao corpo, 18 px. A hierarquia, que antes
  vinha do tamanho, passa a vir do peso e da cor `texto-suave`, que já eram
  usados juntos com o tamanho menor. Conferido nas 12 telas a 390 px: nada
  quebrou, e os filtros de período ("90 dias") cabem na linha.
- Rótulos do gráfico em 17,5 unidades do `viewBox`. Como o gráfico escala com a
  largura, a medida que vale é a da tela: **18,4 px a 320 px** e 23,5 px a
  390 px.

**Alvos (A7-A10)**: `min-h-toque` (56 px) no botão da conta, nos links de
voltar, em "Ver detalhes", "Limpar" e "Anotações", e `min-w-toque` em "Limpar",
"Editar" e "Apagar".

**404 (A11)**: `app/not-found.tsx`, em português, com o corpo de 18 px e o
botão "Ir para o início".

## 4. Segunda medição

| Tela | axe-core (WCAG A/AA/AAA) | Alvos < 56 px | Texto < 18 px |
| --- | --- | --- | --- |
| Todas as 12 | 0 | 0 | 0 |

Os rótulos do gráfico aparecem como 17,5 px no CSS, mas são unidades do SVG: a
medida na tela está na seção 3.

**Exceção registrada:** links dentro de uma frase, como "Privacidade" e
"caderno" na página de privacidade (#107), têm a altura da linha de texto, e
não 56 px. A WCAG isenta alvos em linha de texto (2.5.5), e aumentar a altura
deles quebraria a leitura do parágrafo. Todos são sublinhados e ficam longe de
outros alvos.

## 5. Informação por cor (RNF08)

Verificado por inspeção nas capturas das 12 telas:

| Onde a cor aparece | O que acompanha a cor |
| --- | --- |
| Gravidade da doença | Barra de 5 segmentos preenchidos e rótulo ("Média", "Alta") |
| Compatibilidade | Barra e porcentagem escrita |
| Aba ativa da barra inferior | Forma (pílula branca) e rótulo em negrito |
| Filtro de período ativo | Fundo cheio, `aria-pressed` e o texto do período |
| Hipótese líder | Primeira da lista; a borda verde só reforça |
| Registro ainda no aparelho | "● Guardado neste aparelho" |
| Links | Sempre sublinhados |
| Erros e avisos | Texto da mensagem e borda; o aviso do laudo tem também o ícone de alerta |
| Estado da rede | "Online" ou "Offline" escrito ao lado do ponto |

## 6. O que esta auditoria não cobriu

- **Leitor de tela** (TalkBack, VoiceOver) e **navegação só por teclado** não
  foram testados à mão. O axe confere nomes, papéis e rótulos, mas não a
  ordem de leitura nem a experiência de uso.
- **Zoom de 200%** e **sol direto** em aparelho real.
- A tela da câmera, que está fora da navegação (ADR 0008).

Ficam como verificação recomendada antes de uma apresentação a usuários.

## 7. Como repetir

O roteiro de medição (Playwright + axe-core, com os dados fictícios das telas
com conta) ficou fora do repositório. A suíte ponta a ponta da #77 é o lugar
para a checagem automática de acessibilidade entrar no CI.
