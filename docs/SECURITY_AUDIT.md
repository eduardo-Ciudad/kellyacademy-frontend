# Auditoria de segurança — frontend StudyMind Redação

Data: 2026-10-02  
Escopo: `redacao-sm-frontend` (análise estática e comandos locais; sem alteração de código/configuração/dependências)

## 1. Resumo

Não encontrei vulnerabilidade crítica ou alta no frontend, segredo real no código/histórico/bundle, sink direto de XSS nem dependência de produção reportada como vulnerável pelo `npm audit`. É razoável liberar para os 2 testadores, desde que o deploy use HTTPS e configure cabeçalhos de segurança — esses pontos não são verificáveis neste repositório. Nenhum achado abaixo, isoladamente, bloqueia os testes. Os principais riscos são o JWT persistente e o conteúdo integral dos rascunhos em `localStorage`: qualquer XSS futuro, extensão maliciosa ou acesso ao perfil do navegador pode capturá-los, e o logout não apaga os rascunhos.

## 2. Tabela de achados

| ID   | Severidade                    | Título                                                            | Arquivo:linha           | Bloqueia os testes? (sim/não) |
| ---- | ----------------------------- | ----------------------------------------------------------------- | ----------------------- | ----------------------------- |
| F-01 | Média                         | JWT persistente em `localStorage` fica acessível a JavaScript     | `src/lib/session.ts:25` | não                           |
| F-02 | Média                         | Logout mantém redações em rascunho e nome no navegador            | `src/lib/session.ts:47` | não                           |
| F-03 | Baixa (a confirmar no deploy) | Não há CSP nem configuração versionada de cabeçalhos de segurança | `index.html:3`          | não                           |

## 3. Detalhe dos achados

### F-01 — JWT persistente em `localStorage`

**Evidência** (`src/lib/session.ts:25-41`):

```ts
const accessToken = localStorage.getItem(TOKEN_KEY);
// ...
localStorage.setItem(TOKEN_KEY, session.accessToken);
localStorage.setItem(EXPIRES_AT_KEY, session.expiraEm);
localStorage.setItem(EMAIL_KEY, normalizedEmail);
```

`src/lib/api.ts:80-85` recupera esse valor e o envia como `Authorization: Bearer`.

**Cenário de ataque:** se uma dependência, script de terceiros ou novo componente introduzir XSS, o código injetado poderá ler `studymind:accessToken` e enviá-lo ao atacante. O token continua disponível após fechar e reabrir o navegador até sua expiração. Uma extensão maliciosa ou alguém com acesso ao mesmo perfil do navegador também pode obtê-lo. Não encontrei sink direto de XSS no código atual, portanto o risco não é classificado como alto.

**Impacto:** sequestro da sessão até a expiração/revogação do JWT, com acesso às redações e avaliações da vítima conforme os privilégios do token.

**Recomendação:** preferir sessão em cookie `HttpOnly`, `Secure` e `SameSite`, em coordenação com o backend, e implementar proteção CSRF compatível. Se a arquitetura continuar com Bearer token no navegador, reduzir a validade, considerar armazenamento apenas em memória com mecanismo seguro de renovação e manter uma CSP restritiva. Não guardar refresh token em `localStorage`.

**Esforço:** G (mudança coordenada frontend/backend); M para mitigação com sessão em memória e validade curta.

### F-02 — Logout mantém redações em rascunho e nome no navegador

**Evidência:** os rascunhos contêm o texto integral e são gravados por usuário/tema em `src/hooks/useRascunho.ts:10-12` e `src/hooks/useRascunho.ts:46-53`:

```ts
return `studymind:rascunho:${email.trim().toLowerCase()}:${temaId}`;
// ...
localStorage.setItem(draftKey(email, temaId), JSON.stringify(draft));
```

O logout em `src/lib/session.ts:47-55` remove token, expiração, e-mail e apenas chaves legadas de limite diário; não remove `studymind:rascunho:*` nem `studymind:nome:*`:

```ts
localStorage.removeItem(TOKEN_KEY);
localStorage.removeItem(EXPIRES_AT_KEY);
localStorage.removeItem(EMAIL_KEY);
Object.keys(localStorage)
  .filter((key) => key.startsWith(LEGACY_DAILY_LIMIT_PREFIX))
  .forEach((key) => localStorage.removeItem(key));
```

O cache do TanStack Query é corretamente limpo em `src/lib/auth.tsx:40-46`.

**Cenário de ataque:** em computador compartilhado, laboratório ou perfil de navegador reutilizado, o usuário seguinte — ou qualquer script executado nessa origem — pode enumerar `localStorage` e ler redações completas e nomes de usuários anteriores mesmo após o logout. A interface separa rascunhos por e-mail, mas isso não protege contra inspeção local nem contra JavaScript na mesma origem.

**Impacto:** exposição local de conteúdo possivelmente pessoal das redações e do nome; a sessão autenticada em si é removida.

**Recomendação:** no logout, oferecer a escolha de apagar dados locais ou remover todas as chaves `studymind:rascunho:*` e `studymind:nome:*`. Se a preservação de rascunhos for requisito, comunicar explicitamente que eles ficam no dispositivo e disponibilizar “apagar dados deste dispositivo”. Evitar usar o e-mail em nomes de chave quando não for necessário.

**Esforço:** P.

### F-03 — Não há CSP nem configuração versionada de cabeçalhos de segurança (a confirmar no deploy)

**Evidência:** `index.html:3-19` não define CSP via `<meta>` e não há `vercel.json`, `netlify.toml`, `_headers`, configuração Nginx ou equivalente no repositório. O documento ainda carrega CSS/fontes de terceiros em `index.html:7-11`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Figtree:..."
  rel="stylesheet"
/>
```

**Cenário de ataque:** se o host não adicionar cabeçalhos, o navegador não terá uma política explícita para restringir origens de scripts, frames, conexões e recursos. Isso reduz a defesa em profundidade contra um XSS futuro — especialmente relevante porque o JWT está em `localStorage` — e permite que a aplicação seja enquadrada por outro site caso também falte `frame-ancestors`/`X-Frame-Options`.

**Impacto:** ampliação do impacto de uma futura injeção e possível clickjacking. Não foi encontrado um vetor de injeção atual. O achado permanece **a confirmar**, pois CDN/proxy pode configurar tudo fora do repositório.

**Recomendação:** verificar a resposta HTTPS publicada e configurar no host, no mínimo, uma CSP compatível (`default-src 'self'`; `script-src 'self'`; `connect-src 'self' https://<API>`; origens necessárias para fontes/estilos; `object-src 'none'`; `base-uri 'self'`; `frame-ancestors 'none'`), além de `X-Content-Type-Options: nosniff`, `Referrer-Policy` e HSTS no domínio HTTPS. Avaliar hospedar a fonte localmente para simplificar a CSP.

**Esforço:** P/M, dependendo da plataforma de hospedagem e dos ajustes de CSP.

## 4. O que foi verificado e está OK

- **Segredos e bundle:** `.env.example` só contém `VITE_API_URL=` e proxy local; nenhum `.env` real foi encontrado. O `dist/` não contém chave `AIza`, segredo ou URL de API interna. O `http://localhost` encontrado é fallback interno do React Router, não endpoint da aplicação. `VITE_API_PROXY_TARGET` não foi incorporado ao bundle.
- **Histórico Git:** commits foram filtrados por `AIza`, `password`, `secret`, `jwt`, `DB_PASSWORD`, `api-key`, `token` e `VITE_`. O único match com forma `AIza…` ocorre como coincidência dentro de um blob comprimido/base64 de protótipo no commit `67b3c5de991ed61ed83a28ddb7aa7bd6151a7175`; não é uma credencial legível/utilizável. Nenhum segredo real foi confirmado.
- **`.gitignore`:** cobre `.env` e `.env.local`. Não há `.env` real rastreado. Observação informativa: variantes como `.env.production` não são ignoradas; manter nelas somente valores públicos `VITE_*` e considerar uma regra abrangente com exceção para `.env.example`.
- **XSS:** não há uso de `dangerouslySetInnerHTML`, atribuição a `innerHTML`, `eval`, `new Function` ou `javascript:` em `src/`. Texto da redação e feedback da IA são interpolados como filhos React (por exemplo, `src/pages/Resultado.tsx:311-313`, `465-476`, `512-515` e `547-549`), portanto são escapados pelo React.
- **URLs controladas por dados:** IDs entram apenas em rotas relativas da própria aplicação/API. Não foi encontrado `href` externo construído com entrada do usuário.
- **Logout/cache:** token, expiração e e-mail da sessão são removidos; o cache do TanStack Query é limpo tanto no logout quanto na expiração (`src/lib/auth.tsx:40-46`). O achado F-02 registra a exceção dos rascunhos e nomes.
- **Expiração local:** sessões vencidas são rejeitadas na leitura e há timer/validação ao retornar à aba (`src/lib/session.ts:25-34`; `src/lib/auth.tsx:69-87`). A validação autoritativa continua sendo responsabilidade do backend.
- **Erros:** mensagens e detalhes retornados pelo backend são renderizados como texto, não HTML. Para respostas `5xx`, o cliente usa fallback genérico quando não recebe `detail`; a sanitização de `ProblemDetail.detail` precisa ser garantida pelo backend.
- **Entrada:** cadastro valida nome/e-mail e senha de 8 a 72 caracteres (`src/pages/CriarConta.tsx:17-33`); login limita e valida e-mail (`src/pages/Entrar.tsx:16-24`); editor impede envio vazio e acima de 5.000 caracteres (`src/pages/Editor.tsx:75-83`). Validação frontend não substitui a do backend.
- **Dependências:** `npm audit --omit=dev --json` reportou 0 vulnerabilidades em 96 dependências de produção (0 crítica/alta/moderada/baixa/informativa) em 2026-10-02.
- **Build/source maps:** o build de produção regenerou `dist/`; nenhum arquivo `.map` nem comentário `sourceMappingURL` foi gerado. Os artefatos foram inspecionados sem encontrar segredo ou URL interna da aplicação.
- **API:** com `VITE_API_URL` vazio, as chamadas usam mesma origem, uma configuração segura quando o proxy HTTPS encaminha ao backend. Não há configuração de produção no repositório para confirmar o valor implantado; antes dos testes, confirmar que ele é vazio/same-origin ou começa com `https://`.
- **Logs:** não há `console.log`, `console.debug` ou `console.info` em `src/`.
- **Backend:** autenticação/autorização/IDOR, rate limit, corrida no limite diário, prompt injection, SQL, Actuator, CORS, privilégios de banco e validação do Gemini não se aplicam a este repositório frontend e precisam ser auditados no repositório `studymindredacao`.

## 5. Comandos executados

Os comandos abaixo foram executados em PowerShell, na raiz do repositório. Buscas equivalentes usaram `Get-ChildItem`/`Select-String` porque `rg` não está instalado neste ambiente.

```powershell
Get-Content -Raw docs/AUDITORIA_SEGURANCA_PROMPT.md
git status --short
git ls-files
Get-Content -Raw package.json
Get-ChildItem -Force -Name .env*
Get-Content -Raw .gitignore
Get-ChildItem src -Recurse -File | Select-String -Pattern 'dangerouslySetInnerHTML|\.innerHTML|eval\(|new Function|localStorage|sessionStorage|console\.(log|debug|info)|javascript:|VITE_|Authorization|Bearer|token|logout|queryClient|href=' -CaseSensitive:$false
Get-ChildItem src -Recurse -File -Include *.ts,*.tsx | Get-Content
npm.cmd run build
npm.cmd audit --omit=dev --json
Get-ChildItem dist -Recurse -File
Get-ChildItem dist -Recurse -File -Filter '*.map'
Get-ChildItem dist -Recurse -File | Select-String -Pattern 'AIza|api[_-]?key|secret|password|localhost|127\.0\.0\.1|@[A-Za-z0-9.-]+\.[A-Za-z]{2,}|http://' -CaseSensitive:$false
git check-ignore -v .env .env.local .env.production
git log --all --date=iso-strict --pretty=format:'%H%x09%ad%x09%s' -G 'AIza|password|secret|jwt|DB_PASSWORD|api[-_]?key|VITE_' -- .
git log --all -p --format='@@COMMIT@@%H%x09%ad%x09%s' --date=iso-strict -- .
git log --all --name-only --pretty=format:
git show '67b3c5de991ed61ed83a28ddb7aa7bd6151a7175:docs/prototipo/StudyMind Redação — Resultado.html'
```

Notas de execução: o wrapper do primeiro `npm run build` encontrou restrição de acesso ao Node fora do workspace; a repetição autorizada gerou os artefatos do `dist/`, mas o processo wrapper permaneceu aberto e foi encerrado depois da geração. O `npm audit` foi repetido com acesso autorizado ao registro e concluiu normalmente. Nenhum serviço da aplicação ou ambiente de produção foi acessado.
