# Fontes das telas do protótipo (StudyMind Redação)

Estes arquivos são o código-fonte de cada tela do protótipo, em HTML legível com estilos inline.
Use-os como referência exata de layout, espaçamentos, cores, raios e textos.

- Ignore `<script src="./support.js">`, as tags `<x-dc>`/`<helmet>` e o bloco `<script type="text/x-dc">`: são do editor de design, não fazem parte da tela.
- `{{accent}}` significa `#0866FF`.
- Links `href="Xxx.dc.html"` indicam o fluxo de navegação entre telas.
- Números, nomes e textos de redação são dados de exemplo; na aplicação vêm da API.

| Arquivo | Tela | Rota |
|---|---|---|
| Login.html | 01 Entrar (desktop) | /entrar |
| Cadastro.html | 02 Criar conta (desktop) | /criar-conta |
| Historico.html | 03 Suas redações (desktop) | / |
| Temas.html | 04 Escolher tema (desktop) | /temas |
| Editor.html | 05 Editor (desktop) | /temas/:temaId/escrever |
| Corrigindo.html | 06 Corrigindo (desktop) | estado do editor |
| Resultado.html | 07 Resultado (desktop) | /redacoes/:id |
| Anulada.html | 08 Redação anulada (desktop) | /redacoes/:id com anulada=true |
| M-Login.html | Entrar (mobile) | /entrar |
| M-Historico.html | Suas redações (mobile) | / |
| M-Temas.html | Escolher tema (mobile) | /temas |
| M-Editor.html | Editor (mobile) | /temas/:temaId/escrever |
| M-Corrigindo.html | Corrigindo (mobile) | estado do editor |
| M-Resultado.html | Resultado (mobile) | /redacoes/:id |
| M-Limite.html | Limite diário, 429 (mobile) | dialog/sheet |
| Evolucao.html | 09 Sua evolução (desktop) | /evolucao |
| M-Evolucao.html | Sua evolução (mobile) | /evolucao |
| Evolucao-Vazia.html | Sua evolução sem redações | /evolucao (estado vazio) |
| Temas-v2.html | 04 Escolher tema, com entrada para temas possíveis (desktop) | /temas (substitui Temas.html) |
| M-Temas-v2.html | Escolher tema, com entrada para temas possíveis (mobile) | /temas (substitui M-Temas.html) |
| Temas-Possiveis.html | 10 Possíveis temas do ENEM 2026 (desktop, interativo) | /temas/possiveis |
| M-Temas-Possiveis.html | Possíveis temas do ENEM 2026 (mobile, interativo) | /temas/possiveis |

Nas telas de temas possíveis, os dados de exemplo ficam no `renderVals()` do bloco `text/x-dc` (no app vêm de `GET /temas/possiveis`). `Possiveis.dc.html` = Temas-Possiveis.html, `MPossiveis.dc.html` = M-Temas-Possiveis.html, `Main.dc.html` = Temas-v2.html, `MTemas.dc.html` = M-Temas-v2.html.
