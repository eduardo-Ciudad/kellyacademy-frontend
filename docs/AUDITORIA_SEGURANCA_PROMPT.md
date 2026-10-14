# Auditoria de segurança — StudyMind Redação (somente investigação)

Você vai fazer uma **auditoria de segurança somente leitura** deste repositório e gerar um relatório. **Não altere nenhum arquivo de código, configuração ou dependência, não faça commit e não instale nada globalmente.** O único arquivo que você cria é o relatório.

## Contexto

O StudyMind Redação é uma plataforma de treino de redação do ENEM com correção por IA. São dois repositórios:

- **Backend:** `studymindredacao`, Spring Boot 4, Java 17, arquitetura hexagonal, PostgreSQL + Flyway, Spring Security com JWT, BCrypt, integração com a API do Gemini (chave via variável de ambiente), CORS configurável, erros em ProblemDetail, limite diário de correções por usuário.
- **Frontend:** `redacao-sm-frontend`, React + Vite + TypeScript, TanStack Query, sessão JWT guardada no navegador.

Na próxima semana, a aplicação vai para a internet para 2 testadores reais, com contas criadas por mim. O objetivo é saber o que precisa ser corrigido **antes** disso e o que pode esperar. Seja concreto: aponte arquivo e linha, mostre o trecho e explique o risco real neste contexto. Não liste boas práticas genéricas sem relação com o código.

## O que investigar

Cubra todos os itens que se aplicam ao repositório em que você está. Se um item não se aplicar, diga em uma linha.

### Backend

1. **Segredos e configuração**
   - Chaves, senhas, segredo do JWT ou URLs de banco hardcoded em `application*.properties`, código, testes, collections do Postman, Dockerfile ou docker-compose.
   - Valores padrão inseguros em `${VAR:padrão}`, como um segredo JWT com fallback.
   - **Histórico do git:** procure segredos em commits antigos, mesmo que já removidos (`git log -p` filtrando por padrões como `AIza`, `password`, `secret`, `jwt`, `DB_PASSWORD`, `api-key`). Ao encontrar um, **mascare o valor** no relatório (só os 4 primeiros caracteres) e informe o commit.
   - `.gitignore` cobrindo `.env` e arquivos locais.
2. **Autenticação e JWT**
   - Algoritmo e tamanho do segredo, validação de assinatura e expiração, de onde vem o segredo.
   - Tempo de vida do token e existência (ou falta) de revogação/logout no servidor.
   - O que vai dentro do token: nada sensível deveria ir.
3. **Autorização e IDOR**
   - Para cada endpoint, confirme que o usuário só acessa os próprios dados (redações, avaliações, evolução, temas adicionados, uso diário).
   - Teste mentalmente: o usuário A consegue ler ou alterar algo do usuário B trocando um UUID na URL ou no corpo?
   - Liste a tabela endpoint → regra de acesso que você verificou.
4. **Força bruta e abuso**
   - Existe rate limit em `/auth/login` e `/auth/cadastro`? E por IP?
   - O cadastro é aberto a qualquer pessoa? (Isso importa porque cada conta ganha correções que custam dinheiro no Gemini.)
   - O limite diário de correções é seguro contra corrida, com várias requisições simultâneas?
   - Há limite de tamanho do corpo e do texto da redação?
5. **Injeção**
   - SQL: procure concatenação de strings em `@Query`, `nativeQuery` e qualquer SQL montado manualmente.
   - **Prompt injection no Gemini:** o texto do aluno é inserido no prompt de correção. Avalie se um aluno consegue manipular a nota ou extrair o prompt, e se a resposta da IA é validada antes de ser salva (faixas de nota, formato).
   - Log injection e dados do usuário em logs.
6. **Exposição de dados**
   - O que vai nos logs (senha, token, texto da redação, chave da API, resposta bruta da IA).
   - O que vai nas respostas de erro (stack trace, mensagens internas, detalhes do Gemini).
   - Campos sensíveis em DTOs (hash de senha, tokens, dados de custo).
   - Actuator ou outros endpoints expostos.
7. **CORS, cabeçalhos e transporte**
   - Origens permitidas e se aceitam `*` com credenciais.
   - Cabeçalhos de segurança.
   - Comportamento atrás de proxy/HTTPS no deploy.
8. **Validação de entrada**
   - Bean Validation nos DTOs, tamanhos máximos, e-mail, senha mínima, UUIDs.
   - Política de senha no cadastro.
9. **Dependências**
   - Versões com vulnerabilidades conhecidas no `pom.xml`. Se não conseguir rodar uma ferramenta de checagem, liste as versões principais e marque o que merece verificação.
10. **Banco**
    - Usuário do banco com privilégios além do necessário (se for possível ver pela configuração), `ddl-auto` e migrations.
    - Dados pessoais armazenados e se faz sentido guardar a resposta bruta da IA.

### Frontend

1. **Segredos no bundle**
   - Procure no código e em todos os `.env*` variáveis `VITE_*` que contenham algo sensível. Tudo que começa com `VITE_` vai para o navegador.
   - Rode `npm run build` e procure no `dist/` por chaves, URLs internas e e-mails.
2. **Sessão**
   - Onde o JWT fica guardado (localStorage, sessionStorage ou cookie) e o risco disso com XSS.
   - Se o logout limpa tudo (token, cache do TanStack Query, rascunhos de outro usuário no mesmo navegador).
3. **XSS**
   - Uso de `dangerouslySetInnerHTML`, `innerHTML`, `eval`, `new Function`, URLs montadas com dados do usuário e `href` com `javascript:`.
   - Como o texto da redação e o feedback da IA são renderizados.
4. **Dados no navegador**
   - O que fica em localStorage e sessionStorage: rascunhos, e-mail, dados de outros usuários.
   - O que aparece em `console.log`.
5. **Dependências**
   - Rode `npm audit --omit=dev` e resuma as vulnerabilidades por severidade, com o caminho de cada uma.
6. **Configuração de deploy**
   - Source maps em produção, cabeçalhos (CSP), e se `VITE_API_URL` aponta para HTTPS.

## Formato do relatório

Crie `docs/SECURITY_AUDIT.md` neste repositório, com:

1. **Resumo:** 3 a 5 linhas com o veredito. Dá para liberar para 2 testadores? O que bloqueia?
2. **Tabela de achados**, ordenada por severidade, com as colunas: `ID | Severidade | Título | Arquivo:linha | Bloqueia os testes? (sim/não)`.
   - **Crítica:** vazamento de segredo ou acesso a dados de outro usuário.
   - **Alta:** abuso que gera custo ou derruba o serviço, ou autenticação fraca.
   - **Média.**
   - **Baixa.**
   - **Informativa.**
3. **Detalhe de cada achado:** evidência (trecho curto de código ou comando), cenário de ataque concreto neste sistema, impacto, recomendação de correção (sem aplicar) e esforço estimado (P/M/G).
4. **O que foi verificado e está OK:** lista curta, para eu saber o que não precisa ser revisto.
5. **Comandos executados**, para eu poder reproduzir.

Regras:

- **Nunca** escreva um segredo completo no relatório nem no terminal; mascare como `AIza****`.
- Não invente achados: se não tiver certeza, marque como "a confirmar" e diga o que falta para confirmar.
- Não faça requisições para serviços externos nem tente explorar nada em produção. A análise é estática, mais comandos locais de leitura (`git log`, `grep`, `npm audit`, `npm run build`).

Ao terminar, responda só com o resumo e a tabela de achados. O detalhe fica no arquivo.
