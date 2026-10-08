# Decisões

Esta pasta concentra os ADRs do repositório. Use esses registros para documentar as decisões relevantes do projeto, com contexto, escolha feita e impacto esperado.

Crie um novo ADR sempre que uma decisão alterar escopo, processo, arquitetura, integração, critério avaliativo ou qualquer outro ponto que precise de histórico consultável.

Use [`template-adr.md`](template-adr.md) como ponto de partida, nomeando o arquivo como `adr-NNNN-titulo-curto.md`.

## Índice

| ADR | Decisão | Status | Requisitos e riscos |
| --- | --- | --- | --- |
| [0001](adr-0001-diagnostico-no-cliente.md) | Diagnóstico calculado no cliente | Aprovado | RNF01, RNF02, RF04 |
| [0002](adr-0002-indice-ponderado.md) | Índice de similaridade ponderado, e não classificador probabilístico | Aprovado | RF04-RF06, RN01-RN04, RN08 |
| [0003](adr-0003-base-como-fonte-unica.md) | Base curada como fonte única, derivada por geração | Aprovado | RNF18, RNF20, RN04-RN07 |
| [0004](adr-0004-paridade-entre-motores.md) | Motor duplicado com paridade verificada por fixtures | Aprovado | RNF19, RNF20, R08 |
| [0005](adr-0005-contrato-de-preprocessamento.md) | Contrato de pré-processamento definido pelo projeto | Aprovado | RF10, RNF19 |
| [0006](adr-0006-recusa-sobre-logits-crus.md) | Recusa calculada sobre os logits crus | Aprovado | RF10, RF11, R04 |
| [0007](adr-0007-pwa-em-vez-de-nativo.md) | PWA em vez de aplicativo nativo | Aprovado | RF32, RNF25-RNF28, R02 |
| [0008](adr-0008-hierarquia-de-entrada.md) | Sintomas como tela inicial, câmera fora da navegação | Aprovado | RF10, RF11, R04 |
| [0009](adr-0009-idempotencia-no-banco.md) | Idempotência da sincronização garantida no banco | Aprovado | RF17, RF18, RN10, RN11 |
| [0010](adr-0010-publicacao-em-dois-projetos.md) | Publicação em dois projetos da Vercel, com a API atrás do PWA | Aprovado | RNF23, C11, R05, R06 |

## Decisões pendentes de registro

| Assunto | Motivo da pendência |
| --- | --- |
| Viabilidade da identificação por imagem | Depende da auditoria do acervo Digipathos, prevista para a Sprint 5 (US38) |
| Estratégia de autorização por horta | Será definida junto da implementação de hortas e membros, na Sprint 3 |
| Armazenamento das fotos anexadas à consulta | Depende da escolha do serviço de armazenamento de objetos em camada gratuita |
