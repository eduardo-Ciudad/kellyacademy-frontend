
# Kelly Academy · Frontend

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite)
![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss)

Frontend da [Kelly Academy](https://kellyacademy.com.br), plataforma de treino da redação do ENEM com correção por IA. Consome a [API da Kelly Academy](https://github.com/eduardo-Ciudad/KellyAcademy).

Produto próprio da [CiudadLab](https://ciudadlab.com.br), desenvolvido por mim.

## O que tem

* **Landing page** para visitantes, com animações de scroll (GSAP, ScrollTrigger e Lenis)
* **Nova redação:** escolher um tema do banco ou escrever o próprio tema, depois digitar o texto ou enviar a foto da redação manuscrita
* **Transcrição:** captura pela câmera ou galeria, compressão da imagem no navegador e revisão obrigatória do texto ao lado da foto
* **Resultado:** nota por competência, problemas apontados e a assistente Julia para tirar dúvidas sobre a correção
* **Repertório:** listagem com filtros e busca, com o detalhe em sheet no mobile e em painel no desktop
* **Temas e possíveis temas do ENEM 2026**
* **Evolução:** gráfico das notas por competência
* **Planos:** comparação Grátis × Pro e assinatura pelo Stripe
* **Conta:** cadastro, verificação de e-mail, recuperação, redefinição e troca de senha
* **Painel admin:** visão geral, usuários e detalhe do usuário com concessão manual do Pro
* **Tours guiados** na primeira visita a cada área
* **Legal e SEO:** privacidade, termos e cookies, metadados por página e Google Analytics 4 com Consent Mode

## Decisões técnicas

**Estado do servidor no React Query.** Cada recurso da API tem seu hook (`useIniciarCheckout`, `usePlano`...), e as telas não fazem `fetch` direto.

**Formulários validados no cliente.** React Hook Form com schemas Zod, para o erro aparecer antes da requisição.

**Funcionalidades ligadas por variável.** Julia, pagamento e modo de manutenção são ligados por variáveis de ambiente. Assim, uma funcionalidade pode ir para produção desligada e ser ligada só quando o backend estiver pronto.

**Pensado para o celular.** Safe areas, BottomNav, sheets no lugar de modais no mobile e envio da redação pela câmera.

## Stack

* React 19, TypeScript, Vite
* Tailwind CSS 4, Radix UI, lucide-react
* TanStack React Query, React Router 7, React Hook Form e Zod
* Recharts para os gráficos, motion e GSAP para as animações
* Vitest e Testing Library
* ESLint e Prettier
* Deploy na Vercel

## Estrutura

```
src/
├── pages/            # Uma página por rota (e pages/admin para o painel)
├── components/       # Componentes por área: redacao, repertorio, julia, planos, admin, landing...
│   └── ui/           # Componentes base
├── features/tour/    # Tours guiados
├── hooks/            # Hooks de dados (React Query)
├── lib/              # Cliente da API, autenticação, formatação e regras de tela
├── content/legal/    # Textos das páginas legais
├── types/            # Tipos da API
└── assets/
```

## Como rodar

Pré-requisitos: Node 20.19 ou mais novo (exigência do Vite 7) e a [API](https://github.com/eduardo-Ciudad/KellyAcademy) rodando localmente.

```bash
git clone https://github.com/eduardo-Ciudad/kellyacademy-frontend.git
cd kellyacademy-frontend
cp .env.example .env
npm install
npm run dev
```

Em desenvolvimento, o Vite encaminha as chamadas para a API em `VITE_API_PROXY_TARGET` (padrão `http://localhost:8080`).

### Variáveis de ambiente

| Variável | Uso |
|---|---|
| `VITE_API_URL` | URL da API em produção |
| `VITE_API_PROXY_TARGET` | API usada pelo proxy do Vite em desenvolvimento |
| `VITE_JULIA_HABILITADA` | Mostra a Julia na tela de resultado |
| `VITE_PAGAMENTO_HABILITADO` | Liga a assinatura do Pro |
| `VITE_MAINTENANCE_MODE` | Troca o app inteiro pela tela de manutenção |
| `VITE_GA_MEASUREMENT_ID` | Google Analytics, usado só em produção |

### Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Checagem de tipos e build de produção |
| `npm test` | Testes com Vitest |
| `npm run lint` | ESLint |
| `npm run format:check` | Confere a formatação com Prettier |

## Testes

São mais de 240 testes com Vitest e Testing Library, cobrindo autenticação, fluxos de senha e verificação de e-mail, planos, tours, navegação e as regras de cada tela.

## Autor

Eduardo · [CiudadLab](https://ciudadlab.com.br) · [LinkedIn](https://www.linkedin.com/in/eduardociudadf) · [GitHub](https://github.com/eduardo-Ciudad)