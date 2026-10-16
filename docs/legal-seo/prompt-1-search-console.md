# Prompt 1 — Fundação de SEO para o Google Search Console

Macrotema "parte legal + SEO" da Kelly Academy, em etapas:
1. **SEO / Search Console** (este prompt)
2. Páginas de Política de Privacidade e Termos de Uso
3. Banner de consentimento de cookies + Política de Cookies
4. Google Analytics 4 com Consent Mode v2 (só carrega depois do consentimento)

Domínio canônico: `https://kellyacademy.com.br` (sem www).
Rode um prompt por vez, revise, rode `npm run lint && npm run test && npm run build` e commite antes do próximo.
Sugestão de branch: `feat/seo-search-console`.

---

```
Contexto: frontend da Kelly Academy (plataforma de treino de redação do ENEM com correção por IA). React 19 + Vite 7 + TypeScript + Tailwind v4 + react-router-dom v7 (createBrowserRouter em src/routes.tsx). SPA com deploy na Vercel, domínio de produção https://kellyacademy.com.br (canônico SEM www). Visitante não logado vê a landing em "/" (src/components/landing/HomeGate.tsx → src/pages/Landing.tsx); o resto do app fica atrás do login.

Objetivo desta etapa: deixar o site pronto para ser cadastrado no Google Search Console. São só arquivos de SEO técnico e metadados; nenhuma mudança visual.

Tarefas:

1. public/robots.txt
   User-agent: *
   Allow: /
   Disallow: /temas
   Disallow: /redacoes
   Disallow: /evolucao
   Disallow: /repertorio

   Sitemap: https://kellyacademy.com.br/sitemap.xml

   (As rotas bloqueadas são as telas privadas; /entrar e /criar-conta continuam rastreáveis.)

2. public/sitemap.xml
   - XML válido no padrão sitemaps.org (urlset com xmlns http://www.sitemaps.org/schemas/sitemap/0.9).
   - Por enquanto só uma URL: https://kellyacademy.com.br/ com <lastmod> na data de hoje (AAAA-MM-DD). Não coloque changefreq nem priority (o Google ignora).
   - Na próxima etapa vamos acrescentar /privacidade e /termos, então deixe simples de editar à mão.

3. vercel.json na raiz (confira antes se já existe; se existir, só acrescente o que falta)
   - Rewrite de SPA para que URLs profundas (ex.: /entrar, /temas) não deem 404 ao recarregar:
     { "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
     A Vercel serve os arquivos estáticos antes dos rewrites, então /robots.txt, /sitemap.xml e /assets/* continuam saindo como arquivo. Confirme isso no build (dist/ precisa conter robots.txt e sitemap.xml).
   - Não coloque redirect de www → apex aqui; isso vai ser configurado no painel de domínios da Vercel.

4. index.html — metadados padrão (servem para o Google e para preview em WhatsApp/LinkedIn, que não executam JS)
   - <title>Kelly Academy — Correção de redação do ENEM com IA</title>
   - <meta name="description" content="Treine a redação do ENEM com correção por IA nas 5 competências do INEP, repertório organizado por tema e evolução da sua nota."> (ajuste o texto se ultrapassar ~160 caracteres)
   - <link rel="canonical" href="https://kellyacademy.com.br/">
   - Open Graph: og:type=website, og:site_name=Kelly Academy, og:locale=pt_BR, og:title, og:description, og:url=https://kellyacademy.com.br/, og:image=https://kellyacademy.com.br/og-image.png (URL absoluta), og:image:width=1200, og:image:height=630, og:image:alt.
   - Twitter: twitter:card=summary_large_image, twitter:title, twitter:description, twitter:image.
   - <link rel="apple-touch-icon" href="/apple-touch-icon.png"> (180×180).
   - Mantenha lang="pt-BR", theme-color e o favicon.svg que já existem.
   - NÃO adicione meta google-site-verification (a verificação vai ser por registro DNS TXT).

5. Imagens públicas
   - public/og-image.png 1200×630: fundo escuro do app (#0b0c12, ou o token bg do src/index.css), marca de src/assets/brand/kelly-marca-fundo-escuro.svg centralizada à esquerda/centro e a frase "Correção de redação do ENEM com IA" em texto claro. Visual limpo, sem sombra e sem brilho. Gere com uma ferramenta via npx sem adicionar dependência ao package.json (ex.: monte um SVG 1200×630 temporário e converta com npx --yes sharp-cli). Se a fonte do texto não renderizar bem na conversão, converta o texto em path ou use só a marca, e me avise.
   - public/apple-touch-icon.png 180×180: símbolo da marca (sem o wordmark) sobre o fundo escuro, gerado do mesmo jeito.
   - Mantenha os PNGs leves (og-image < 300 KB). Apague arquivos temporários usados na geração.

6. Metadados por rota — hook src/lib/usePageMeta.ts
   - Assinatura sugerida: usePageMeta({ title, description?, path?, noindex? }).
   - Em useEffect: define document.title; faz upsert (cria se não existir, senão atualiza) de <meta name="description">, <link rel="canonical"> (https://kellyacademy.com.br + path) e <meta name="robots">. Com noindex=true: robots = "noindex, nofollow" e remove o canonical. No cleanup, restaura os valores anteriores (para a landing não herdar o noindex de outra tela e vice-versa).
   - NÃO use <title>/<meta> renderizados em JSX (o hoisting do React 19 não remove o <title> estático do index.html e gera tag duplicada) e NÃO adicione react-helmet nem outra dependência.
   - Testes unitários do hook (ou de uma função pura que ele usa) em src/lib/*.test.ts, no padrão dos testes existentes (vitest, environment node — se precisar de DOM, isole a lógica numa função pura testável ou use // @vitest-environment jsdom só se o jsdom já estiver disponível; não adicione dependência sem me perguntar).

7. Aplicar o hook
   - Landing.tsx: substituir o useEffect de document.title por usePageMeta({ title: 'Kelly Academy — Correção de redação do ENEM com IA', description: <mesma do index.html>, path: '/' }).
   - Entrar.tsx: title "Entrar — Kelly Academy", description curta, path "/entrar" (indexável).
   - CriarConta.tsx: title "Criar conta grátis — Kelly Academy", description curta, path "/criar-conta" (indexável).
   - NotFound.tsx: title "Página não encontrada — Kelly Academy", noindex: true.
   - Telas privadas (tudo que está dentro de RequireAuth): noindex: true. Faça isso num lugar só (ex.: no componente RequireAuth em src/lib/auth.tsx ou no AppShell) em vez de repetir em cada página, garantindo que /temas/:temaId/escrever e /temas/:temaId/foto (fora do AppShell) também fiquem com noindex. O "/" logado (HomeGate → AppShell + Historico) também deve ficar noindex; o "/" deslogado (landing) indexável. Os títulos das telas privadas podem ficar "Kelly Academy" ou o nome da tela, como preferir, sem mudar nada visual.

8. Conferência
   - npm run lint, npm run test e npm run build.
   - Confira que dist/ tem robots.txt, sitemap.xml, og-image.png e apple-touch-icon.png, e que dist/index.html tem as metas.
   - Rode npm run preview e confirme: GET /robots.txt e /sitemap.xml devolvem o arquivo (não o HTML do app); na landing o <head> tem canonical https://kellyacademy.com.br/ e nenhum robots noindex; em /entrar o canonical muda para /entrar; em /temas (logado) aparece robots noindex e não há canonical; voltando para a landing, o noindex some.

Regras:
- Não faça commit nem push.
- Nenhuma mudança visual no app ou na landing.
- Não adicione Google Analytics, Tag Manager, banner de cookies nem páginas legais (são as próximas etapas).
- Não mexa em lógica de API, autenticação ou hooks de dados além do necessário para o noindex.
- Ao final, me diga os arquivos criados/alterados, o resultado de lint/test/build e qualquer decisão que você tomou diferente do pedido.
```
