import type { LegalDoc } from '@/content/legal/types';

export const termos: LegalDoc = {
  title: 'Termos de Uso',
  description:
    'Regras de uso da Kelly Academy: conta, planos, natureza das notas geradas por IA, conteúdo, responsabilidades e foro.',
  updatedAt: '2026-10-16',
  intro:
    'Estes Termos regulam o uso da Kelly Academy. Ao criar uma conta ou usar a plataforma, você concorda com eles e com a nossa Política de Privacidade. Se não concordar, não use a plataforma.',
  sections: [
    {
      id: 'o-servico',
      title: 'O serviço',
      paragraphs: [
        'A Kelly Academy é uma plataforma de treino de redação para o ENEM, desenvolvida e mantida pela CiudadLab (São José do Rio Preto/SP). Ela oferece correção por inteligência artificial com base nas 5 competências da matriz do INEP, banco de temas, repertório organizado por tema, transcrição de redações manuscritas e acompanhamento da sua evolução.',
        'A Kelly Academy não é afiliada, vinculada ou endossada pelo INEP ou pelo Ministério da Educação.',
      ],
    },
    {
      id: 'notas',
      title: 'Sobre as notas e correções',
      paragraphs: [
        'As notas e comentários são estimativas geradas por inteligência artificial a partir dos critérios públicos do INEP. Elas podem conter erros e não substituem a correção oficial do ENEM nem a orientação de um professor.',
        'Não garantimos nenhum resultado no ENEM ou em qualquer outro exame.',
      ],
    },
    {
      id: 'conta',
      title: 'Sua conta',
      paragraphs: [
        'Você deve informar dados verdadeiros no cadastro e mantê-los atualizados.',
      ],
      items: [
        'A conta é pessoal e intransferível. Não compartilhe sua senha; você é responsável pelo que for feito com a sua conta.',
        'Se perceber uso indevido da sua conta, avise imediatamente pelo e-mail ciudadlab.dev@gmail.com.',
        'Se você tem menos de 18 anos, use a plataforma com o conhecimento do seu responsável legal. A plataforma não é destinada a menores de 12 anos.',
      ],
    },
    {
      id: 'planos',
      title: 'Planos e limites de uso',
      paragraphs: [
        'Hoje a Kelly Academy oferece um plano gratuito, com limites diários de correções e de transcrições exibidos na plataforma. Esses limites podem ser ajustados para manter o serviço funcionando para todos.',
        'Um plano pago poderá ser oferecido no futuro. Antes de qualquer contratação, preço, forma de pagamento, renovação e cancelamento serão informados com clareza, e estes Termos serão atualizados.',
      ],
    },
    {
      id: 'uso-aceitavel',
      title: 'Uso aceitável',
      paragraphs: ['Ao usar a plataforma, você se compromete a não:'],
      items: [
        'usar robôs, scripts ou qualquer automação para enviar redações ou acessar o conteúdo;',
        'tentar burlar limites de uso, criar várias contas para isso ou compartilhar a conta;',
        'copiar, extrair em massa ou revender o conteúdo da plataforma, como o repertório e os temas;',
        'tentar acessar áreas, dados ou contas de outras pessoas, ou prejudicar o funcionamento do serviço;',
        'enviar conteúdo ilegal, ofensivo, discriminatório ou que viole direitos de terceiros.',
      ],
    },
    {
      id: 'conteudo-usuario',
      title: 'Seu conteúdo',
      paragraphs: [
        'As redações que você escreve são suas. Ao enviá-las, você nos autoriza, de forma limitada e não exclusiva, a armazená-las e processá-las — inclusive enviando ao provedor de inteligência artificial — somente para prestar o serviço a você, como descrito na Política de Privacidade.',
      ],
    },
    {
      id: 'propriedade-intelectual',
      title: 'Propriedade intelectual',
      paragraphs: [
        'A plataforma, a marca Kelly Academy, o design, o código e a curadoria de temas e repertório pertencem à CiudadLab ou a seus licenciantes. O uso da plataforma não transfere a você nenhum desses direitos.',
      ],
    },
    {
      id: 'disponibilidade',
      title: 'Disponibilidade e mudanças',
      paragraphs: [
        'Trabalhamos para manter a plataforma no ar, mas ela pode ficar indisponível por manutenção, falhas ou motivos fora do nosso controle. Também podemos alterar, incluir ou remover funcionalidades.',
      ],
    },
    {
      id: 'encerramento',
      title: 'Suspensão e encerramento',
      paragraphs: [
        'Você pode pedir a exclusão da sua conta a qualquer momento pelo e-mail ciudadlab.dev@gmail.com.',
        'Podemos suspender ou encerrar contas que violem estes Termos, com aviso sempre que possível.',
      ],
    },
    {
      id: 'responsabilidade',
      title: 'Limitação de responsabilidade',
      paragraphs: [
        'Na medida permitida pela lei, a CiudadLab não se responsabiliza por decisões tomadas com base nas notas e correções da plataforma, por resultados em exames, nem por indisponibilidades temporárias. Nada nestes Termos limita os direitos que você tem pelo Código de Defesa do Consumidor.',
      ],
    },
    {
      id: 'alteracoes',
      title: 'Alterações nestes Termos',
      paragraphs: [
        'Podemos atualizar estes Termos. A data da última atualização fica no topo da página e, se a mudança for relevante, avisaremos na plataforma. Continuar usando a plataforma depois disso significa que você concorda com a nova versão.',
      ],
    },
    {
      id: 'lei-e-foro',
      title: 'Lei aplicável e foro',
      paragraphs: [
        'Estes Termos seguem as leis brasileiras. Fica eleito o foro da comarca de São José do Rio Preto/SP, ressalvado o seu direito, como consumidor, de propor ação no foro do seu domicílio.',
      ],
    },
    {
      id: 'contato',
      title: 'Contato',
      paragraphs: ['Dúvidas sobre estes Termos: ciudadlab.dev@gmail.com.'],
    },
  ],
};
