# Etapa 8 — Temas possíveis do ENEM 2026

Você vai implementar no frontend (React + Vite + TypeScript strict, TanStack Query, Tailwind v4 com tokens em `src/index.css`, Lucide, Sonner) a tela de temas possíveis do ENEM 2026 e a entrada para ela na tela de Temas. O backend já está pronto e testado. **Não altere nada fora deste repositório e não faça commit**: ao terminar, liste os arquivos criados e alterados e cole a saída de `npm run lint` e `npm run build`.

## Referências visuais (obrigatório ler antes de codar)

Em `docs/prototipo/telas/` (veja o `LEIA-ME.md`, que explica o formato):

- `Temas-v2.html` e `M-Temas-v2.html`: tela /temas com o card de entrada e os cards de tema possível na grade.
- `Temas-Possiveis.html` e `M-Temas-Possiveis.html`: a tela nova /temas/possiveis. São interativas; o comportamento (abrir/fechar, adicionar/remover) está no `renderVals()` do bloco `text/x-dc`, e os textos de exemplo vêm da API no app.

Siga layout, espaçamentos, raios, tamanhos de fonte e textos das telas. Use os tokens existentes do Tailwind (`bg-surface`, `text-text-2`, `bg-accent-tint`, `text-c5`, `bg-c5-bg` etc.). As duas cores novas do selo "Possível" viram tokens em `src/index.css`, junto dos outros:

```css
--color-possivel: #9cc3ff;
--color-possivel-border: #4a6385;
```

## Contrato da API

`GET /temas` agora é por aluno: devolve os temas oficiais e autorais, mais os temas possíveis **que o aluno adicionou**, com `origem: "PREVISAO"` e `ano: 2026`. A ordem continua sendo ano desc, então os possíveis vêm primeiro.

`GET /temas/possiveis` (200), já em ordem de ranking:

```json
[
  {
    "id": "uuid",
    "titulo": "Desafios para a garantia dos direitos de crianças e adolescentes nos ambientes digitais brasileiros",
    "ano": 2026,
    "forca": "MUITO_FORTE",
    "eixo": "Infância, direitos e tecnologia",
    "grupoSocial": "Crianças e adolescentes",
    "justificativa": "ECA Digital sancionado em 2025 e em vigor desde março de 2026; ...",
    "argumentos": ["Responsabilidade das plataformas", "..."],
    "marcosLegais": ["Constituição Federal, art. 227", "..."],
    "agentesIntervencao": ["União", "ANPD", "..."],
    "adicionado": false
  }
]
```

`forca` é `"MUITO_FORTE" | "FORTE" | "VALE_TREINAR"`. Não existe índice numérico, e a tela não deve mostrar nenhum número de força ou ranking.

`PUT /usuarios/me/temas/{temaId}` adiciona e `DELETE /usuarios/me/temas/{temaId}` remove. Os dois respondem **204 sem corpo** e são idempotentes. Erros: 400 se o tema não for `PREVISAO`, 404 se não existir (ambos com ProblemDetail, já tratados pelo `api()` em `ApiError`). O `api()` já devolve `undefined` em 204.

## Tarefas

### 1. Tipos (`src/types/api.ts`)

- `Tema.origem` passa a ser `'ENEM_OFICIAL' | 'AUTORAL' | 'PREVISAO'`.
- Adicione `ForcaEvidencia` e `TemaPossivel` exatamente como o JSON acima.

### 2. Rótulo único de tema (`src/lib/temas.ts`, arquivo novo)

Hoje a regra "Autoral / ENEM {ano} / ENEM" está duplicada em quatro lugares. Crie `rotuloTema(tema: Pick<Tema, 'origem' | 'ano'>): string`:

- `AUTORAL` → `"Autoral"`
- `PREVISAO` → `"Possível 2026"` (use o `ano`; sem ano, `"Tema possível"`)
- `ENEM_OFICIAL` → `"ENEM {ano}"`, ou `"ENEM"` sem ano

Substitua as quatro duplicações por essa função, sem mudar mais nada nelas: `src/components/redacao/EtapasCorrecao.tsx` (~linha 33), `src/pages/Editor.tsx` (~linha 212), `src/pages/Historico.tsx` (~linha 162) e `themeLabel` em `src/pages/Resultado.tsx` (~linha 44). Sem isso, uma redação sobre tema possível apareceria como "ENEM 2026", o que é falso.

### 3. Hooks (`src/hooks/useTemasPossiveis.ts`, arquivo novo)

- `temasPossiveisQueryKey = ['temas', 'possiveis'] as const` e `useTemasPossiveis()`, no mesmo padrão de `useEvolucao.ts`.
- `useAlternarTemaPossivel()`: `useMutation` que recebe `{ temaId, adicionar: boolean }` e chama `PUT` ou `DELETE` em `/usuarios/me/temas/${temaId}`.
  - **Otimista**: em `onMutate`, cancele as queries de `temasPossiveisQueryKey`, guarde o snapshot e inverta o `adicionado` do item no cache.
  - Em `onError`: restaure o snapshot e mostre `toast.error(error instanceof ApiError ? error.detail : 'Não foi possível atualizar sua lista.')`.
  - Em `onSettled`: invalide `temasPossiveisQueryKey` e `temasQueryKey` (o `/temas` muda junto, e o Editor depende dele para achar o tema).
  - Sem toast de sucesso: o botão muda de estado na hora, e isso já é o feedback.

### 4. Rota (`src/routes.tsx`)

Adicione `/temas/possiveis` dentro do `AppShell`, ao lado de `/temas`, apontando para a página nova. O `NavLink` de Temas no Sidebar e no BottomNav não usa `end`, então já fica ativo nessa rota. Confirme que continua assim.

### 5. Tela de Temas (`src/pages/Temas.tsx`)

- Subtítulo do desktop: "Temas oficiais do ENEM e os temas possíveis que você adicionou."
- **Card de entrada** entre o cabeçalho e a busca, como nos protótipos.
  - Desktop: faixa `bg-accent-tint` com ícone `SparkIcon` em quadrado `bg-accent`, título "Possíveis temas do ENEM 2026", o texto de apoio, o contador e o botão pill `bg-accent` "Ver temas possíveis →".
  - Mobile: card clicável inteiro, com seta à direita e a linha "12 temas para treinar · N na sua lista".
  - O contador **N na sua lista** vem de `temas.filter(t => t.origem === 'PREVISAO').length`, sobre os dados de `useTemas`, sem chamada extra. Com zero, o desktop esconde o contador e o mobile mostra só "12 temas para treinar". O "12" também não é fixo: use "Temas para treinar" sem número se preferir não chamar `/temas/possiveis` aqui. **Não faça a chamada extra só para o número.**
  - Tudo é `<Link to="/temas/possiveis">`, com área de toque ≥ 44px.
- **`TemaCard` com `origem === 'PREVISAO'`**:
  - Desktop: o ano fica em `text-text-2` (não em `text-text`) e o selo é tracejado ("Possível", com `SparkIcon` de 12px, `text-possivel`, `border border-dashed border-possivel-border`) no lugar de "ENEM oficial".
  - Mobile: o ano fica em `text-text-2` e o selo "Possível" vai no início da linha de meta, antes de "Ainda não praticado" ou "Praticado".
  - Hoje o selo cai em "Autoral" para tudo que não é oficial. Corrija para os três casos.
- Busca e filtros continuam funcionando com os temas possíveis (buscar "2026" encontra todos).

### 6. Página nova (`src/pages/TemasPossiveis.tsx`)

Estrutura, de cima para baixo, com conteúdo em `max-w-[980px]` no desktop:

1. Link "← Temas" para `/temas` (no mobile, o botão redondo de voltar com `aria-label="Voltar para temas"`, igual ao da tela de Temas).
2. Título "Possíveis temas do ENEM 2026" e subtítulo, com o contador pill "N na sua lista" à direita no desktop. No mobile, o contador fica no fim do subtítulo.
3. Aviso com `role="note"`, ícone `Info` e o texto do protótipo ("Isto não é uma previsão de que algum tema vai cair. ..."). No mobile, use a versão curta do protótipo.
4. **Três grupos**, nesta ordem: `MUITO_FORTE` "Evidências muito fortes", `FORTE` "Evidências fortes" e `VALE_TREINAR` "Vale treinar". Agrupe a lista mantendo a ordem da API dentro de cada grupo e omita grupos vazios.
   - Cada cabeçalho tem o ícone de sinal (componente `SinalForca`: três barras de 4px, alturas 7/11/16px; acesas `bg-accent-text` e apagadas `bg-control`, com 3, 2 ou 1 barra acesa; `aria-hidden`), o título `h2` e "N temas" em `text-text-3`.
5. **Card** (`TemaPossivelCard`, em `src/components/temas/`) como `<article>`:
   - Linha principal: eixo (13px, `text-text-3`, semibold), título `h3` e, só no desktop, "Grupo social: …" (no mobile ele vai para dentro do conteúdo aberto).
   - Botão de lista com `aria-pressed`: não adicionado = contorno `border-control`, ícone `Plus` azul e texto "Adicionar"; adicionado = `bg-accent-tint text-possivel`, ícone `Check` e texto "Na sua lista". Clicar alterna via `useAlternarTemaPossivel`. Desabilite só o botão daquele card enquanto a mutation dele estiver pendente.
   - Botão de abrir com `aria-expanded` e `aria-controls` apontando para o id do painel. Desktop: só ícone `ChevronDown` (gira 180° quando aberto) com `aria-label` "Ver material de estudo" / "Fechar material de estudo". Mobile: pill "Estudar" com o chevron. **Só um card aberto por vez**: o estado `abertoId` fica na página, começa `null`, e abrir outro fecha o anterior.
   - Painel aberto (`border-t border-border-subtle`):
     - "Por que merece atenção" e a justificativa.
     - No desktop, uma grade de 3 colunas; no mobile, empilhado: "Argumentos possíveis" (lista), "Leis e marcos" (lista) e "Quem pode intervir", com o selo C5 nas cores `text-c5 bg-c5-bg`, os agentes como chips `bg-control` e, no desktop, a dica "Use na proposta de intervenção: quem faz, o quê e como.".
   - Rodapé do painel: se `adicionado`, `<Link to={`/temas/${id}/escrever`}>` "Escrever sobre este tema →" como botão `bg-accent`; se não, o texto `text-text-3` "Adicione à sua lista para escrever sobre este tema." (no mobile, só o botão quando adicionado).
6. **Estados**:
   - Carregando: skeleton com 3 cabeçalhos e 4 cards baixos.
   - Erro: o mesmo bloco de erro da tela de Temas ("Não foi possível carregar os temas possíveis" + "Tentar novamente").
   - Lista vazia: "Nenhum tema possível disponível no momento."

Títulos e textos longos quebram linha normalmente: nada de `truncate` no título do tema.

### 7. Editor

Não precisa mudar a lógica. Confira só que, ao clicar em "Escrever sobre este tema" logo depois de adicionar, o Editor acha o tema. A invalidação do `temasQueryKey` no `onSettled` garante isso. Se o Editor abrir antes do refetch terminar, ele já mostra "Carregando tema…" enquanto `isLoading`. Confirme que não cai em "Este tema não está mais disponível" nesse intervalo e, se cair, trate `isFetching` como carregamento quando o tema ainda não estiver na lista.

## Checklist antes de entregar

- [ ] `npm run lint` e `npm run build` sem erros (TypeScript strict, sem `any`).
- [ ] /temas: a entrada aparece no desktop e no mobile; o tema possível adicionado mostra o selo "Possível" e o ano em cinza; Histórico, Editor e Resultado mostram "Possível 2026" para redação sobre tema possível.
- [ ] /temas/possiveis: 3 grupos na ordem certa; adicionar e remover refletem na hora e persistem após recarregar; só um card aberto por vez; "Escrever sobre este tema" leva ao Editor com o tema carregado.
- [ ] Navegação por teclado: tudo alcançável com Tab, foco visível (`focus-ring`) e `aria-pressed`/`aria-expanded` corretos.
- [ ] Em 390px de largura, nada estoura horizontalmente.
- [ ] Nenhum número de força, índice ou ranking aparece em lugar nenhum.

Ao terminar, responda com: arquivos criados, arquivos alterados, saída de lint e build, e qualquer ponto em que você precisou desviar do protótipo, explicando o motivo.
