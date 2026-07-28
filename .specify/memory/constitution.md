<!--
  Sync Impact Report
  ==================
  Version change: N/A → 1.0.0 (initial adoption)
  Modified principles: N/A (new constitution)
  Added sections:
    - Core Principles (5 princípios)
    - Stack Técnica Obrigatória (React + Vite + Tailwind + PWA)
    - Padrão de Qualidade (simplicidade, Lighthouse PWA ≥ 90)
    - Governance (spec como fonte da verdade, regras de alteração)
  Removed sections: Nenhuma (template original com placeholders)
  Templates requiring updates:
    ✅ plan-template.md — compatível (Constitution Check + Complexity Tracking alinham com princípios)
    ✅ spec-template.md — compatível (sem referências à constituição no template)
    ✅ tasks-template.md — compatível (sem referências à constituição no template)
    ✅ checklist-template.md — compatível (sem referências à constituição no template)
  Follow-up TODOs: Nenhum placeholder mantido intencionalmente
-->

# pizza-menu — Cardápio Digital de Pizzaria (PWA)

## Core Principles

### I. Sem Backend Próprio (NON-NEGOTIABLE)

O projeto é 100% estático, hospedável em Vercel, Netlify ou GitHub Pages. Todos os dados do cardápio vêm de um único arquivo `menu.json` editável manualmente pelo dono do negócio, sem necessidade de programação.

**Rationale**: Eliminar custo de servidor, complexidade de deploy e dependência de banco de dados. O MVP deve ser operável por uma pessoa não-técnica apenas editando um arquivo JSON.

### II. Mobile-First, Sempre (NON-NEGOTIABLE)

A esmagadora maioria dos acessos será via celular. Nenhuma decisão de layout ou interação pode assumir tela grande como caso padrão. Todo componente deve ser desenvolvido e testado primeiro em viewport mobile (375px), com breakpoints adicionados apenas quando necessário para telas maiores.

**Rationale**: O contexto de uso é o cliente da pizzaria acessando o cardápio pelo celular. Desktop é um caso secundário que não deve ditar decisões de design.

### III. PWA Instalável e Funcional Offline (NON-NEGOTIABLE)

O cardápio já visitado deve continuar acessível sem internet. Service Worker com estratégia cache-first para assets estáticos e o `menu.json`. O manifest deve permitir instalação na tela inicial com ícone e nome adequados.

**Rationale**: Clientes podem acessar o cardápio em áreas com sinal ruim ou após já terem visitado a página. Isso não é um "extra" — é requisito central do produto e condição para considerar o MVP concluído.

### IV. Regras de Negócio São a Fonte da Verdade (NON-NEGOTIABLE)

As regras abaixo vêm diretamente do dono da pizzaria e NÃO PODEM ser alteradas sem confirmação explícita. Qualquer ambiguidade deve ser resolvida consultando a spec, não o código:

- Tamanho único de pizza: Grande, 8 fatias.
- Cada pizza pode ter de 1 a 3 sabores.
- Preço da pizza = preço da categoria mais cara entre os sabores escolhidos (Tradicionais Simples R$30 / Especiais R$35 / Sensacionais R$40).
- Acréscimo de R$5 se houver um 3º sabor.
- Bebidas (ex: Pepsi Lata) são item simples, preço direto, sem seleção de sabor.
- Taxa de entrega fixa de R$5; retirada no local não tem acréscimo.
- Forma de pagamento obrigatória: Dinheiro, Cartão ou Pix (com campo de troco condicional para Dinheiro).
- Pedido final é enviado como mensagem formatada via link `wa.me`. O cliente SEMPRE confirma o envio manualmente no WhatsApp — nunca é automatizado.

**Rationale**: Essas regras são o core domain do negócio. O software existe para implementá-las, não para reinterpretá-las. Mudanças nessas regras exigem conversa com o stakeholder.

### V. Fora de Escopo do MVP: Sem Autenticação, Pagamento In-App ou Painel Admin

Autenticação de usuário, processamento de pagamento dentro do app e painel administrativo visual são explicitamente FORA de escopo. Não introduzir complexidade para "preparar o terreno" para features futuras sem que isso seja solicitado.

**Rationale**: YAGNI. Cada uma dessas features dobra a complexidade do projeto e introduz dependências externas e superfícies de segurança. O MVP entrega valor sem elas.

## Stack Técnica Obrigatória

Toda feature implementada neste projeto DEVE utilizar a stack definida abaixo. Desvios exigem justificativa documentada e aprovação.

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| Framework | React | 18.x+ |
| Build tool | Vite | 5.x+ |
| Linguagem | TypeScript | 5.x+ (strict mode) |
| Estilização | Tailwind CSS | 3.x+ |
| PWA | vite-plugin-pwa (Workbox) | última estável |
| Estado | React Context + useReducer | nativo |
| Dados | JSON estático tipado | `menu.json` |

**Restrições explícitas**:
- NÃO usar Redux, Zustand ou qualquer biblioteca externa de gerenciamento de estado. Context + useReducer é suficiente.
- NÃO usar frameworks de UI components (shadcn/ui, Material UI, Chakra, etc.). Tailwind puro.
- NÃO adicionar backend, API routes ou serverless functions.
- NÃO usar runtime de borda (Edge Functions, Middleware) que torne o deploy dependente de plataforma específica.

## Padrão de Qualidade

### Simplicidade como Requisito Funcional

Todo código deve ser simples o suficiente para o próprio dono da pizzaria (não-técnico) entender o que precisa editar no `menu.json` sem quebrar o app. Isso significa:

- Estrutura do `menu.json` plana e óbvia, com nomes de campos em português claro.
- Comentários ou documentação inline explicando o formato de cada campo.
- Validação amigável: se o JSON estiver mal formatado, o app mostra uma mensagem em português explicando o erro, não um stack trace.

### Lighthouse PWA Score

- **PWA score ≥ 90** antes de considerar qualquer fase "concluída".
- Lighthouse audit executado em build de produção, em modo mobile, com throttling de rede simulando 3G.
- Métricas: installability, offline support, manifest, service worker, HTTPS redirect (onde aplicável).

### Spec-First

- Nenhuma feature nova entra sem antes atualizar a spec correspondente em `specs/`.
- A spec (`spec.md`) é o contrato: o que está escrito lá é o que deve ser implementado.
- Features não especificadas são bugs, não "iniciativas".

## Governance

### Hierarquia de Autoridade

1. **Regras de negócio do dono da pizzaria** — imutáveis sem confirmação explícita do stakeholder.
2. **Esta constituição** — define os princípios que governam todas as decisões de implementação.
3. **`spec-mvp-cardapio-pizzaria.md` (v1.0, aprovada)** — fonte de verdade do produto para dúvidas de comportamento.
4. **Código** — implementa o que a spec define, respeitando a constituição.

### Processo de Alteração

- Emendas à constituição exigem: (a) justificativa documentada, (b) revisão de impacto nos artefatos existentes, (c) atualização do `LAST_AMENDED_DATE`.
- Versionamento semântico: MAJOR para remoção/redefinição de princípios, MINOR para novos princípios/seções, PATCH para clarificações e correções de redação.
- Ambiguidades não cobertas pela spec devem ser levantadas como pergunta ao stakeholder antes de implementar qualquer suposição.

### Compliance

- Todo PR deve passar no Constitution Check (ver `plan-template.md`) antes de merge.
- Violações de princípios NON-NEGOTIABLE são bloqueantes.
- Violações justificadas devem ser documentadas na seção Complexity Tracking do plano de implementação.

**Version**: 1.0.0 | **Ratified**: 2025-07-28 | **Last Amended**: 2025-07-28
