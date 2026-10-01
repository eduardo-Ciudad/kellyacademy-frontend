export const competencias = [
  {
    numero: 1,
    codigo: 'C1',
    nome: 'Domínio da norma culta',
    nomeCurto: 'Domínio da norma culta',
    colorClass: 'text-c1',
    hex: '#7DB8FF',
    bgHex: '#22344C',
  },
  {
    numero: 2,
    codigo: 'C2',
    nome: 'Compreensão do tema e uso de repertório',
    nomeCurto: 'Tema e repertório',
    colorClass: 'text-c2',
    hex: '#B9A2FB',
    bgHex: '#30294A',
  },
  {
    numero: 3,
    codigo: 'C3',
    nome: 'Seleção e organização dos argumentos',
    nomeCurto: 'Argumentação',
    colorClass: 'text-c3',
    hex: '#4FD1B5',
    bgHex: '#1F3A36',
  },
  {
    numero: 4,
    codigo: 'C4',
    nome: 'Coesão entre frases e parágrafos',
    nomeCurto: 'Coesão',
    colorClass: 'text-c4',
    hex: '#F5B94A',
    bgHex: '#3D3120',
  },
  {
    numero: 5,
    codigo: 'C5',
    nome: 'Proposta de intervenção completa',
    nomeCurto: 'Proposta de intervenção',
    colorClass: 'text-c5',
    hex: '#F58DB0',
    bgHex: '#412834',
  },
] as const;

// Keep hex and bgHex in sync with --color-c1..c5 and their bg tokens in index.css.
