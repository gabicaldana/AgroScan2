# ADR 0001 - Diagnóstico calculado no cliente

## Status

Aprovado - implementado e verificado por teste automatizado.

## Data

2026-09-12 *(registro formal de decisão tomada no início do projeto)*

## Contexto

O usuário primário do AgroScan usa o sistema no canteiro, onde a conectividade é
intermitente ou ausente. O diagnóstico é a função central do produto: é o que o
produtor abre o aplicativo para obter, e é a informação de que ele precisa
naquele momento e naquele lugar.

Se o cálculo do diagnóstico depende de uma chamada de rede, o sistema falha
exatamente onde precisa funcionar. Não existe degradação graciosa aceitável:
não há como "diagnosticar parcialmente" sem rede.

Ao mesmo tempo, o projeto precisa de um servidor - o compartilhamento de dados
entre membros de uma horta comunitária e as agregações dos relatórios não têm
equivalente no cliente.

## Decisão

O cálculo do diagnóstico roda **no navegador**, sobre a base de conhecimento
embutida no pacote da aplicação. O servidor existe, mas não participa do caminho
crítico da resposta.

Isso se formaliza no princípio que organiza o sistema inteiro:

> O cliente é autoridade sobre a resposta. O servidor é autoridade sobre o registro.

O servidor guarda o que precisa ser compartilhado entre pessoas e dispositivos,
publica o catálogo para sincronização e faz as agregações que só o SQL faz bem.
A API também expõe `POST /diagnosticos`, mas como recurso de integração e de
verificação de paridade - não como dependência do aplicativo.

## Alternativas consideradas

**API de diagnóstico como caminho único.** Rejeitada: viola RNF01. Simplificaria
a manutenção (uma implementação só), mas quebra o produto no único ambiente em
que ele precisa funcionar.

**Cache de respostas da API no service worker.** Rejeitada: só funcionaria para
combinações de sintomas já consultadas anteriormente com rede. A primeira
consulta de um quadro novo - que é o caso de uso real - falharia.

**Aplicativo nativo com banco local embarcado.** Rejeitada por outros motivos,
registrados no ADR 0007.

## Consequências

**Positivas**

- RNF01 é atendido integralmente, inclusive na primeira consulta após a instalação.
- O tempo de resposta não depende de rede nem de inicialização a frio do ambiente serverless.
- O custo de infraestrutura fica baixo, o que atende RNF22.

**Negativas e custos aceitos**

- A base de conhecimento precisa ser embutida no pacote da aplicação, o que aumenta seu tamanho conforme a curadoria avança. Mitigado porque o conteúdo é texto e comprime bem.
- A regra de diagnóstico passa a existir em mais de um lugar - no motor de referência em Python e no porte em TypeScript. Isso cria risco de divergência, tratado no ADR 0004.
- Atualizar a base exige publicar uma versão nova do aplicativo ou sincronizar o catálogo (RF34).

## Links relacionados

- Requisitos: RNF01, RNF02, RF04, RF33
- [ADR 0004 - Paridade entre motores](adr-0004-paridade-entre-motores.md)
- [ADR 0007 - PWA em vez de nativo](adr-0007-pwa-em-vez-de-nativo.md)
- [Artefato 3, §2.4 - Fluxo de diagnóstico sem conexão](../../entregas/artefato-3-gestao-do-produto.md#24-fluxo-1---diagnóstico-sem-conexão)
- Código: `web/lib/diagnostico.ts`
