import type { LegalDoc } from '@/content/legal/types';

export const privacidade: LegalDoc = {
  title: 'Política de Privacidade',
  description:
    'Saiba quais dados a Kelly Academy coleta, como usa, com quem compartilha e como exercer seus direitos pela LGPD.',
  updatedAt: '2026-10-16',
  intro:
    'Esta política explica como a Kelly Academy trata os seus dados pessoais, de acordo com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD). Ao usar a plataforma, você declara ter lido e entendido este documento.',
  sections: [
    {
      id: 'quem-somos',
      title: 'Quem somos',
      paragraphs: [
        'A Kelly Academy é uma plataforma de treino de redação para o ENEM desenvolvida e mantida pela CiudadLab, estúdio de desenvolvimento de software de São José do Rio Preto/SP, que é a controladora dos seus dados pessoais.',
        'Para qualquer assunto sobre privacidade, fale com a gente pelo e-mail ciudadlab.dev@gmail.com.',
      ],
    },
    {
      id: 'dados-coletados',
      title: 'Quais dados coletamos',
      paragraphs: [
        'Coletamos apenas o necessário para a plataforma funcionar:',
      ],
      items: [
        'Dados de cadastro: nome, e-mail e senha. A senha é armazenada somente de forma criptografada (hash) e ninguém da equipe tem acesso a ela.',
        'Conteúdo que você envia: o texto das suas redações e o tema escolhido.',
        'Fotos de redações manuscritas: usadas apenas para transcrever o texto. A imagem não fica guardada depois da transcrição; guardamos só o texto resultante.',
        'Resultados gerados: notas, avaliação por competência, comentários, histórico e evolução.',
        'Dados de uso: quantidade de correções e transcrições feitas por dia, para aplicar os limites do plano.',
        'Dados técnicos: endereço IP, data e hora de acesso e informações básicas do navegador, registrados pelo servidor por segurança e por obrigação legal.',
      ],
    },
    {
      id: 'navegador',
      title: 'Dados guardados no seu navegador',
      paragraphs: [
        'Para manter você conectado, guardamos no armazenamento local do navegador (localStorage) o seu token de acesso, e-mail e nome. Também salvamos ali os rascunhos das redações que você está escrevendo, para não perder o texto se a página fechar.',
        'Esses dados ficam só no seu dispositivo e são apagados quando você sai da conta (os rascunhos podem ser apagados limpando os dados do site no navegador).',
        'Também guardamos ali a sua escolha sobre cookies. Cookies de análise (Google Analytics) só são ativados se você aceitar no aviso de cookies, e você pode mudar essa escolha quando quiser. Não usamos cookies de publicidade. Veja os detalhes na Política de Cookies.',
      ],
    },
    {
      id: 'finalidades',
      title: 'Para que usamos seus dados',
      paragraphs: ['Usamos seus dados para:'],
      items: [
        'Criar e manter sua conta e permitir o login (execução de contrato — art. 7º, V, da LGPD).',
        'Corrigir e transcrever suas redações, mostrar resultados, histórico e evolução (execução de contrato).',
        'Aplicar limites de uso, prevenir abusos e proteger a plataforma (legítimo interesse — art. 7º, IX).',
        'Guardar registros de acesso exigidos pelo Marco Civil da Internet (cumprimento de obrigação legal — art. 7º, II).',
        'Enviar comunicações importantes sobre a sua conta, como avisos de segurança ou mudanças nestes documentos (execução de contrato).',
        'Medir, de forma estatística, como o site é usado para melhorar a plataforma, com o Google Analytics — somente se você aceitar (consentimento — art. 7º, I).',
      ],
      closing: [
        'Não vendemos seus dados e não usamos suas redações para publicidade.',
      ],
    },
    {
      id: 'inteligencia-artificial',
      title: 'Correção por inteligência artificial',
      paragraphs: [
        'A correção e a transcrição das redações são feitas com a API Gemini, do Google. Para isso, enviamos ao Google apenas o texto da redação, o tema e, no caso da transcrição, a imagem enviada. Seu nome e e-mail não são enviados.',
        'Enquanto usamos o nível gratuito dessa API, os termos do Google permitem que o conteúdo enviado seja usado para melhorar os produtos do Google, inclusive com leitura por revisores humanos. Por isso, recomendamos que você não escreva dados pessoais (seus ou de outras pessoas, como nome completo, endereço ou telefone) no texto das redações.',
        'As notas são estimativas geradas por IA e podem conter erros. Elas não são a nota oficial do INEP.',
      ],
    },
    {
      id: 'compartilhamento',
      title: 'Com quem compartilhamos',
      paragraphs: [
        'Compartilhamos dados somente com os fornecedores necessários para a plataforma funcionar, e apenas o que cada um precisa:',
      ],
      items: [
        'Google (API Gemini): processamento das correções e transcrições.',
        'Vercel: hospedagem do site.',
        'Provedor de servidor (VPS): hospedagem do sistema e do banco de dados.',
        'Google (Google Analytics): estatísticas de uso do site, somente com o seu consentimento.',
      ],
      closing: [
        'Também podemos compartilhar dados quando houver obrigação legal ou ordem de autoridade competente.',
      ],
    },
    {
      id: 'transferencia-internacional',
      title: 'Transferência internacional',
      paragraphs: [
        'Alguns desses fornecedores, como o Google e a Vercel, podem processar dados em servidores fora do Brasil, principalmente nos Estados Unidos. Essas transferências seguem o art. 33 da LGPD e as garantias contratuais de proteção de dados oferecidas por esses fornecedores.',
      ],
    },
    {
      id: 'seguranca',
      title: 'Segurança',
      paragraphs: [
        'Usamos conexão criptografada (HTTPS), senhas com hash, acesso restrito ao servidor e ao banco de dados, e limites contra uso abusivo. Nenhum sistema é 100% seguro, mas tratamos qualquer incidente com prioridade e, se ele puder causar risco a você, avisaremos você e a ANPD, como manda a lei.',
      ],
    },
    {
      id: 'retencao',
      title: 'Por quanto tempo guardamos',
      paragraphs: [
        'Mantemos seus dados enquanto sua conta existir. Se você pedir a exclusão, apagamos sua conta, redações e resultados em até 30 dias.',
        'Os registros de acesso (IP, data e hora) são guardados por 6 meses, conforme o art. 15 do Marco Civil da Internet (Lei nº 12.965/2014), mesmo após a exclusão da conta.',
      ],
    },
    {
      id: 'seus-direitos',
      title: 'Seus direitos',
      paragraphs: ['Pela LGPD (art. 18), você pode, a qualquer momento:'],
      items: [
        'confirmar se tratamos seus dados e acessá-los;',
        'corrigir dados incompletos, inexatos ou desatualizados;',
        'pedir a anonimização, o bloqueio ou a exclusão de dados desnecessários ou tratados em desacordo com a lei;',
        'pedir a portabilidade dos seus dados;',
        'pedir a exclusão da sua conta e dos seus dados;',
        'saber com quem compartilhamos seus dados;',
        'revogar um consentimento que tenha dado;',
        'reclamar à Autoridade Nacional de Proteção de Dados (ANPD).',
      ],
      closing: [
        'Para exercer qualquer direito, envie um e-mail para ciudadlab.dev@gmail.com a partir do e-mail cadastrado na conta. Respondemos em até 15 dias.',
      ],
    },
    {
      id: 'menores',
      title: 'Menores de idade',
      paragraphs: [
        'A Kelly Academy é voltada a estudantes que se preparam para o ENEM, o que inclui adolescentes. Se você tem menos de 18 anos, use a plataforma com o conhecimento do seu responsável legal.',
        'A plataforma não é destinada a crianças menores de 12 anos.',
      ],
    },
    {
      id: 'alteracoes',
      title: 'Alterações nesta política',
      paragraphs: [
        'Podemos atualizar esta política para refletir mudanças na plataforma ou na lei. A data da última atualização fica no topo da página e, se a mudança for relevante, avisaremos na plataforma.',
      ],
    },
    {
      id: 'contato',
      title: 'Contato',
      paragraphs: [
        'Dúvidas, pedidos ou reclamações sobre privacidade: ciudadlab.dev@gmail.com.',
      ],
    },
  ],
};
