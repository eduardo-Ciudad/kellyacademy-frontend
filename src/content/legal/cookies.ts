import type { LegalDoc } from '@/content/legal/types';

export const cookies: LegalDoc = {
  title: 'Política de Cookies',
  description:
    'Entenda quais cookies e dados do navegador a Kelly Academy usa, para que servem e como mudar suas preferências.',
  updatedAt: '2026-10-16',
  intro:
    'Esta política explica o que são cookies, quais a Kelly Academy usa e como você controla isso. Ela complementa a nossa Política de Privacidade.',
  sections: [
    {
      id: 'o-que-sao',
      title: 'O que são cookies',
      paragraphs: [
        'Cookies são pequenos arquivos que um site guarda no seu navegador. Além deles, sites podem usar o armazenamento local do navegador (localStorage) para guardar informações no seu dispositivo.',
      ],
    },
    {
      id: 'necessarios',
      title: 'Dados necessários para o funcionamento',
      paragraphs: [
        'Estes dados são guardados no armazenamento local do seu navegador e são indispensáveis para a plataforma funcionar, por isso não dependem de consentimento:',
      ],
      items: [
        'Sessão: token de acesso, e-mail e nome, para manter você conectado.',
        'Rascunhos: o texto das redações em andamento, para você não perder o que escreveu.',
        'Sua escolha sobre cookies: para não perguntarmos de novo a cada visita.',
      ],
      closing: ['A Kelly Academy não usa cookies próprios de publicidade.'],
    },
    {
      id: 'analise',
      title: 'Cookies de análise (opcionais)',
      paragraphs: [
        'Se você aceitar, usamos o Google Analytics para entender, de forma estatística, como as pessoas usam o site — por exemplo, quais páginas são mais visitadas e de quais dispositivos. Isso nos ajuda a melhorar a plataforma.',
      ],
      items: [
        '_ga: diferencia visitantes de forma anônima. Duração: até 2 anos.',
        '_ga_Y8T5J3MNJE: mantém o estado da sessão de navegação. Duração: até 2 anos.',
      ],
      closing: [
        'Esses cookies só são criados depois que você clica em "Aceitar". Se você recusar, o Google Analytics não é carregado.',
        'Os dados são tratados pelo Google, que pode processá-los fora do Brasil. Recursos de publicidade do Google ficam desativados.',
      ],
    },
    {
      id: 'controle',
      title: 'Como mudar sua escolha',
      paragraphs: [
        'Você pode mudar sua escolha a qualquer momento pelo link "Preferências de cookies", no rodapé do site. Se você retirar o consentimento, o Google Analytics é desativado e os cookies dele são apagados.',
        'Também é possível apagar cookies e dados do site nas configurações do seu navegador. Nesse caso, você precisará entrar na sua conta de novo.',
      ],
    },
    {
      id: 'alteracoes',
      title: 'Alterações nesta política',
      paragraphs: [
        'Podemos atualizar esta política se passarmos a usar outros cookies. Nesse caso, a data no topo da página muda e, se for uma mudança relevante, pediremos sua escolha de novo.',
      ],
    },
    {
      id: 'contato',
      title: 'Contato',
      paragraphs: ['Dúvidas sobre cookies: ciudadlab.dev@gmail.com.'],
    },
  ],
};
