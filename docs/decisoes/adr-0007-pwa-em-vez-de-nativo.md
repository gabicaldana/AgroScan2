# ADR 0007 - PWA em vez de aplicativo nativo

## Status

Aprovado - implementado e instalável.

## Data

2026-09-12 *(registro formal de decisão tomada no início do projeto)*

## Contexto

O sistema precisa ser instalável no celular do produtor, funcionar sem conexão e
chegar até ele sem atrito. O público-alvo usa celular Android de entrada ou
intermediário, com armazenamento limitado, e tem letramento digital variável.

O projeto tem duas pessoas, um semestre e restrição de operar em camadas
gratuitas de serviços em nuvem.

## Decisão

O AgroScan é distribuído como **aplicativo web progressivo (PWA)**, instalado
diretamente pelo navegador a partir de uma URL pública, sem passar por loja de
aplicativos.

| Plataforma | Forma de instalação | Suporte |
| --- | --- | --- |
| Android (Chrome) | Banner automático ou menu do navegador | Completo - ícone na lista de aplicativos, janela própria, funcionamento offline |
| iOS (Safari) | Compartilhar → "Adicionar à Tela de Início" | Parcial - ver limitações |
| Desktop (Chrome, Edge) | Ícone de instalação na barra de endereço | Completo |

O service worker é **escrito à mão** (`web/public/sw.js`), e não gerado por
biblioteca: ele precisa cachear a casca da aplicação e também os arquivos que o
HTML referencia, e o comportamento tinha que ser explícito para ser auditável.

## Alternativas consideradas

**Aplicativo Android nativo.** Rejeitada por quatro motivos: exigiria publicação
em loja, com conta de desenvolvedor paga e ciclo de revisão; excluiria o uso em
desktop, que a equipe usa para demonstração; exigiria uma segunda base de código
para a camada de interface; e a atualização passaria a depender de ação do
usuário.

**Site responsivo sem instalação.** Rejeitada: não atenderia RNF01. Sem service
worker e sem manifesto, não há funcionamento offline confiável nem ícone na tela
inicial.

**Framework híbrido** (React Native, Flutter, Capacitor). Rejeitada: acrescenta
uma cadeia de build e um runtime para entregar, neste caso, pouco além do que o
PWA entrega - o produto não usa recurso nativo além da câmera, que a plataforma
web já expõe.

## Consequências

**Positivas**

- Instalação por link: o produtor pode receber a URL por mensagem e instalar sem loja.
- Atualização imediata para todos, sem ação do usuário e sem revisão de loja.
- Uma base de código para celular e desktop.
- Custo de distribuição zero, o que atende RNF22.

**Negativas e limitações aceitas - todas no iOS**

1. **Não há banner automático de instalação.** O iOS não permite que a aplicação solicite instalação; o usuário precisa usar o menu de compartilhamento do Safari. O sistema apresenta instruções específicas quando detecta esse ambiente (US40, RNF27).
2. **O armazenamento local pode ser descartado após cerca de sete dias sem uso.** O Safari remove os dados gravados pela aplicação - incluindo o catálogo em cache e as consultas pendentes de envio. É o risco mais relevante contra a premissa offline, registrado como **R02**. Mitigação: o catálogo é reconstruído na abertura seguinte com conexão, e a fila é esvaziada na abertura do aplicativo, reduzindo a janela de exposição.
3. **Não há sincronização em segundo plano.** A fila é enviada quando o aplicativo é aberto ou quando a conexão retorna com o aplicativo em uso, e não de forma autônoma pelo sistema operacional (RNF28).

Como o público-alvo primário usa predominantemente Android, essas limitações
afetam um segmento secundário dos usuários, sem comprometer a proposta central.

## Links relacionados

- Requisitos: RF32, RNF25, RNF26, RNF27, RNF28
- Riscos: R02 - descarte do armazenamento local em iOS
- Histórias: US31, US40
- Código: `web/app/manifest.ts`, `web/public/sw.js`, `web/components/RegistroServiceWorker.tsx`
