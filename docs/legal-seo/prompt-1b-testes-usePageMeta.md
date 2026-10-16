# Prompt 1b — Testes do usePageMeta (antes do commit da etapa 1)

```
Contexto: na etapa anterior foi criado src/lib/usePageMeta.ts, que mexe no <head> (title, meta description, meta robots, link canonical) e restaura tudo no cleanup. Hoje o único teste (src/lib/usePageMeta.test.ts) cobre só canonicalUrl; a lógica de criar/atualizar/restaurar as tags não tem teste nenhum. Os testes do projeto rodam com vitest em environment node (vite.config.ts → test.environment = 'node').

Objetivo: cobrir com testes unitários a lógica do <head>, sem mudar o comportamento.

Tarefas:

1. Refatoração mínima para testabilidade
   - Extrair a lógica do useEffect para uma função pura exportada:
     applyPageMeta(doc: Document, options: PageMetaOptions): () => void
     que aplica as tags e devolve a função de restauração.
   - usePageMeta passa a ser só: useEffect(() => applyPageMeta(document, { title, description, path, noindex }), [title, description, path, noindex]).
   - Não mude a assinatura do hook nem nenhum lugar onde ele é usado.

2. Dependência de teste
   - Adicionar jsdom como devDependency (npm install -D jsdom). Nenhuma outra dependência.
   - No arquivo de teste, usar o comentário // @vitest-environment jsdom no topo, mantendo o environment global como node para os demais testes.

3. Casos de teste em src/lib/usePageMeta.test.ts (manter os de canonicalUrl)
   Monte um head parecido com o index.html real (title, meta description, link canonical para https://kellyacademy.com.br/, sem meta robots) em beforeEach.
   - Página indexável (/entrar): troca title, description e canonical para https://kellyacademy.com.br/entrar; robots = "index, follow".
   - Restauração: após chamar o cleanup, title, description e canonical voltam aos valores originais e a meta robots criada é removida.
   - noindex: robots = "noindex, nofollow" e não existe link canonical no head.
   - Restauração do noindex: após o cleanup o canonical original volta (com o href original) e a meta robots some.
   - Sem description: mantém a description existente.
   - Head vazio (sem description e sem canonical): cria as tags e o cleanup remove só o que criou.
   - Sequência de navegação landing → tela privada → landing (aplica A, aplica B, cleanup B): no fim não sobra noindex e o canonical é o da landing.
   - Não há tags duplicadas em nenhum cenário (querySelectorAll de description, robots e canonical com length ≤ 1).

4. Conferência
   - npm run lint, npm run test e npm run build.

Regras:
- Não faça commit nem push.
- Nenhuma mudança visual nem de comportamento.
- Ao final, me diga os arquivos alterados, a quantidade de testes e o resultado de lint/test/build.
```
