import {
  ArrowLeft,
  BookOpen,
  Check,
  ChevronRight,
  Clock3,
  FilePenLine,
  ImageUp,
  PenLine,
  RotateCcw,
  Search,
} from 'lucide-react';
import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react';
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { Skeleton } from '@/components/ui/Skeleton';
import { useTour } from '@/features/tour/TourProvider';
import { useCriarTemaPersonalizado } from '@/hooks/useCriarTemaPersonalizado';
import { useTemas } from '@/hooks/useTemas';
import {
  chaveTitulo,
  normalizarTitulo,
  resolverTemaDigitado,
} from '@/lib/temaPersonalizado';
import { rotuloTema } from '@/lib/temas';
import type { Tema } from '@/types/api';

type Filtro = 'todos' | 'seus' | 'enem' | 'possiveis';

export function NovaRedacao() {
  const { temaId } = useParams();
  return temaId ? <ComoEnviar temaId={temaId} /> : <EscolhaTema />;
}

function EscolhaTema() {
  const [params] = useSearchParams();
  const etapa = params.get('etapa');
  if (etapa === 'lista') return <ListaTemas />;
  if (etapa === 'meu-tema') return <MeuTema />;
  return <Inicio />;
}

function Page({ children, etapa = 1 }: { children: ReactNode; etapa?: 1 | 2 }) {
  return (
    <div className="mx-auto max-w-[1040px] px-5 pt-5 pb-8 lg:px-0 lg:pt-2">
      <Etapas atual={etapa} />
      {children}
    </div>
  );
}

function Etapas({ atual }: { atual: 1 | 2 }) {
  return (
    <div data-tour="nova-redacao-etapas" className="mb-8 lg:mb-14">
      <div className="flex items-center gap-2 lg:hidden">
        {[1, 2].map((n) => (
          <span
            key={n}
            className={`h-1 flex-1 rounded-full ${n <= atual ? 'bg-[#2f5bff]' : 'bg-[#2c2f42]'}`}
          />
        ))}
        <span className="font-mono text-xs text-[#8b8fa3]">{atual} de 2</span>
      </div>
      <div className="hidden items-center justify-center lg:flex">
        <Step n={1} label="Tema" state={atual === 1 ? 'current' : 'done'} />
        <span
          className={`mx-4 h-px w-24 ${atual === 2 ? 'bg-[#285c3c]' : 'bg-[#2c2f42]'}`}
        />
        <Step
          n={2}
          label="Como enviar"
          state={atual === 2 ? 'current' : 'future'}
        />
      </div>
    </div>
  );
}

function Step({
  n,
  label,
  state,
}: {
  n: number;
  label: string;
  state: 'current' | 'done' | 'future';
}) {
  return (
    <div className="flex items-center gap-2.5 text-sm font-semibold">
      <span
        className={`flex size-8 items-center justify-center rounded-full border ${state === 'current' ? 'border-[#2f5bff] bg-[#2f5bff] text-white' : state === 'done' ? 'border-[#285c3c] bg-[#15251b] text-[#5dd39e]' : 'border-[#2c2f42] text-[#8b8fa3]'}`}
      >
        {state === 'done' ? <Check size={15} /> : n}
      </span>
      <span className={state === 'future' ? 'text-[#8b8fa3]' : 'text-white'}>
        {label}
      </span>
    </div>
  );
}

function Heading({
  title,
  support,
  back,
}: {
  title: string;
  support?: ReactNode;
  back?: string;
}) {
  return (
    <header>
      {back && (
        <Link
          to={back}
          className="focus-ring mb-5 inline-flex min-h-11 items-center gap-2 rounded-full text-sm font-semibold text-[#b4b8c8] hover:text-white"
        >
          <ArrowLeft size={17} /> Voltar
        </Link>
      )}
      <p className="font-mono text-xs tracking-[.14em] text-[#7f9bff]">
        NOVA REDAÇÃO
      </p>
      <h1 className="font-display mt-3 max-w-[760px] text-[30px] leading-[1.08] font-light tracking-[-.03em] text-white lg:text-[44px] lg:tracking-[-.035em]">
        {title}
      </h1>
      {support && (
        <p className="mt-4 max-w-[720px] text-[15px] leading-6 text-[#b4b8c8] lg:text-base">
          {support}
        </p>
      )}
    </header>
  );
}

function Inicio() {
  const tour = useTour();
  useEffect(() => {
    if (tour.screen !== 'closed' || tour.isTourCompleted('nova-redacao'))
      return;
    const timer = window.setTimeout(() => tour.startTour('nova-redacao'), 600);
    return () => window.clearTimeout(timer);
  }, [tour]);
  return (
    <Page>
      <Heading
        title="Como você quer escolher o tema?"
        support={
          <>
            <span className="hidden sm:inline">
              Pratique com um tema da nossa lista ou traga o tema de outra
              proposta, como uma da escola ou do cursinho.
            </span>
            <span className="sm:hidden">
              Pratique com um tema da lista ou traga o de outra proposta.
            </span>
          </>
        }
      />
      <div className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))] gap-4 lg:mt-10">
        <ChoiceCard
          to="?etapa=lista"
          tour="nova-redacao-lista"
          icon={<BookOpen size={25} />}
          title="Escolher um tema da lista"
          text="Temas oficiais do ENEM, possíveis temas de 2026 e os temas que você já criou."
          cta="Ver temas →"
        >
          <Badge kind="enem">ENEM oficial</Badge>
          <Badge kind="possivel">Possíveis</Badge>
          <Badge kind="meu">Seus temas</Badge>
        </ChoiceCard>
        <ChoiceCard
          to="?etapa=meu-tema"
          tour="nova-redacao-meu-tema"
          icon={<PenLine size={25} />}
          title="Escrever meu próprio tema"
          text="Digite o título de qualquer proposta. A correção segue as mesmas 5 competências do ENEM."
          cta="Escrever tema →"
        >
          <Badge kind="meu">Fica salvo em Seus temas</Badge>
        </ChoiceCard>
      </div>
    </Page>
  );
}

function ChoiceCard({
  to,
  tour,
  icon,
  title,
  text,
  cta,
  children,
}: {
  to: string;
  tour: string;
  icon: ReactNode;
  title: string;
  text: string;
  cta: string;
  children: ReactNode;
}) {
  return (
    <Link
      to={to}
      data-tour={tour}
      className="focus-ring group flex min-h-[132px] items-center gap-4 rounded-[18px] border border-[#1f2130] bg-[#12131b] p-5 transition-colors hover:border-[#3e5a85] lg:min-h-[300px] lg:flex-col lg:items-start lg:rounded-[20px] lg:p-7"
    >
      <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#1a1f3d] text-[#a3b6ff]">
        {icon}
      </span>
      <div className="min-w-0 flex-1 lg:flex lg:flex-col">
        <h2 className="text-[17px] font-semibold text-white lg:mt-5 lg:text-xl">
          {title}
        </h2>
        <p className="mt-1.5 text-sm leading-5 text-[#b4b8c8] lg:mt-3 lg:text-[15px] lg:leading-6">
          {text}
        </p>
        <div className="mt-4 hidden flex-wrap gap-2 lg:flex">{children}</div>
        <span className="mt-6 hidden text-sm font-semibold text-[#7f9bff] lg:block">
          {cta}
        </span>
      </div>
      <ChevronRight className="shrink-0 text-[#7f9bff] lg:hidden" size={20} />
    </Link>
  );
}

function Badge({
  kind,
  children,
}: {
  kind: 'enem' | 'possivel' | 'meu';
  children: ReactNode;
}) {
  const style =
    kind === 'enem'
      ? 'bg-[#1a1f3d] text-[#a3b6ff]'
      : kind === 'possivel'
        ? 'border border-dashed border-[#536494] text-[#a9b8ff]'
        : 'border border-[#2b4a7a] bg-[#1b2638] text-[#b9c7dd]';
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${style}`}>
      {children}
    </span>
  );
}

function ListaTemas() {
  const query = useTemas();
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState<Filtro>('todos');
  const temas = useMemo(
    () =>
      (query.data ?? []).filter((tema) => {
        const matchesBusca = chaveTitulo(tema.titulo).includes(
          chaveTitulo(busca),
        );
        const matchesFiltro =
          filtro === 'todos' ||
          (filtro === 'seus' && tema.origem === 'PERSONALIZADO') ||
          (filtro === 'enem' &&
            (tema.origem === 'ENEM_OFICIAL' || tema.origem === 'AUTORAL')) ||
          (filtro === 'possiveis' && tema.origem === 'PREVISAO');
        return matchesBusca && matchesFiltro;
      }),
    [busca, filtro, query.data],
  );
  return (
    <Page>
      <Heading back="/nova-redacao" title="Escolha um tema" />
      <div className="mt-8 flex flex-col gap-3 lg:flex-row">
        <label className="relative block flex-1">
          <span className="sr-only">Buscar tema</span>
          <Search
            className="absolute top-3.5 left-4 text-[#8b8fa3]"
            size={18}
          />
          <input
            type="search"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar tema"
            className="focus-ring h-12 w-full rounded-full border border-[#2c2f42] bg-[#12131b] pr-4 pl-11 text-white placeholder:text-[#8b8fa3]"
          />
        </label>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {(
            [
              ['todos', 'Todos'],
              ['seus', 'Seus temas'],
              ['enem', 'ENEM'],
              ['possiveis', 'Possíveis'],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              aria-pressed={filtro === value}
              onClick={() => setFiltro(value)}
              className={`focus-ring min-h-11 shrink-0 rounded-full border px-4 text-sm font-semibold ${filtro === value ? 'border-[#2f5bff] bg-[#1d2240] text-white' : 'border-[#2c2f42] text-[#b4b8c8]'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-6 space-y-2.5">
        {query.isLoading ? (
          Array.from({ length: 5 }, (_, i) => (
            <Skeleton key={i} className="h-[78px] rounded-[18px]" />
          ))
        ) : query.isError ? (
          <State title="Não foi possível carregar os temas">
            <button
              type="button"
              onClick={() => void query.refetch()}
              className="focus-ring mt-4 inline-flex min-h-11 items-center gap-2 rounded-full border border-[#2c2f42] px-5 text-sm font-semibold"
            >
              <RotateCcw size={16} /> Tentar de novo
            </button>
          </State>
        ) : temas.length ? (
          temas.map((tema) => (
            <Link
              key={tema.id}
              to={`/nova-redacao/${tema.id}`}
              className="focus-ring flex min-h-[76px] items-center gap-4 rounded-[18px] border border-[#1f2130] bg-[#12131b] px-5 py-4 hover:border-[#3e5a85]"
            >
              <BadgeTema tema={tema} />
              <span className="min-w-0 flex-1 text-[15px] font-semibold text-white">
                {tema.titulo}
              </span>
              <ChevronRight size={19} className="text-[#8b8fa3]" />
            </Link>
          ))
        ) : (
          <State title="Nenhum tema encontrado com essa busca." />
        )}
      </div>
      <div className="mt-7 flex flex-col gap-3 rounded-[18px] border border-dashed border-[#2c2f42] p-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[#b4b8c8]">Não achou o tema que procura?</p>
        <Link
          to={`?etapa=meu-tema&titulo=${encodeURIComponent(busca)}`}
          className="focus-ring inline-flex min-h-11 items-center justify-center rounded-full border border-[#2c2f42] px-5 text-sm font-semibold text-[#7f9bff]"
        >
          Escrever meu próprio tema
        </Link>
      </div>
    </Page>
  );
}

function State({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="rounded-[18px] border border-[#1f2130] bg-[#12131b] p-8 text-center text-sm text-[#b4b8c8]">
      {title}
      {children}
    </div>
  );
}

function MeuTema() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const temas = useTemas();
  const mutation = useCriarTemaPersonalizado();
  const [texto, setTexto] = useState(params.get('titulo') ?? '');
  const resolucao = resolverTemaDigitado(texto, temas.data ?? []);
  const quantidade = normalizarTitulo(texto).length;
  const disabled =
    ['vazio', 'curto', 'longo'].includes(resolucao.tipo) ||
    mutation.limiteAtingido ||
    mutation.isPending;
  function submit(event: FormEvent) {
    event.preventDefault();
    if (resolucao.tipo === 'existente')
      void navigate(`/nova-redacao/${resolucao.tema.id}`);
    if (resolucao.tipo === 'novo')
      mutation.mutate(resolucao.titulo, {
        onSuccess: (tema) => {
          void navigate(`/nova-redacao/${tema.id}`, {
            state: { temaCriado: tema },
          });
        },
      });
  }
  return (
    <Page>
      <Heading
        back="/nova-redacao"
        title="Escreva seu tema"
        support="Digite o tema do jeito que ele aparece na proposta."
      />
      <form onSubmit={submit} className="mt-8 max-w-[760px]">
        <label
          htmlFor="tema-redacao"
          className="text-sm font-semibold text-white"
        >
          Tema da redação
        </label>
        <textarea
          id="tema-redacao"
          aria-describedby="tema-redacao-ajuda"
          rows={3}
          maxLength={500}
          value={texto}
          onChange={(e) => {
            setTexto(e.target.value);
            if (mutation.isError) mutation.reset();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              e.currentTarget.form?.requestSubmit();
            }
          }}
          placeholder="Ex.: Os desafios da mobilidade urbana no Brasil"
          className="focus-ring mt-2 min-h-[112px] w-full resize-none rounded-[18px] border border-[#2c2f42] bg-[#12131b] p-4 text-base text-white placeholder:text-[#696d80] sm:min-h-[96px]"
        />
        <div className="mt-2 flex justify-between gap-4 text-xs">
          <span
            id="tema-redacao-ajuda"
            className={
              resolucao.tipo === 'longo'
                ? 'text-[#f3727f]'
                : 'text-[#f5b94a]'
            }
          >
            {resolucao.tipo === 'curto'
              ? 'Use pelo menos 10 caracteres.'
              : resolucao.tipo === 'longo'
                ? 'Use no máximo 200 caracteres.'
                : ''}
          </span>
          <span className="font-mono text-[#8b8fa3]">{quantidade}/200</span>
        </div>
        {resolucao.tipo === 'existente' && (
          <div className="mt-5 rounded-[16px] border border-[#2b4a7a] bg-[#1b2638] p-4 text-sm leading-6 text-[#b9c7dd]">
            {resolucao.tema.origem === 'PERSONALIZADO'
              ? 'Você já tem esse tema em Seus temas. Vamos usar o mesmo.'
              : `Esse tema já está na lista (${rotuloTema(resolucao.tema)}). Vamos usar o da lista.`}
          </div>
        )}
        {mutation.erroCampo && (
          <p className="mt-3 text-sm text-[#f3727f]" role="alert">
            {mutation.erroCampo}
          </p>
        )}
        {mutation.limiteAtingido && (
          <div className="mt-5 flex gap-3 rounded-[16px] border border-[#5c4a1f] bg-[#2a2415] p-4">
            <Clock3 className="mt-0.5 shrink-0 text-[#f5b94a]" size={19} />
            <div>
              <p className="font-semibold text-white">
                Você já criou 10 temas hoje.
              </p>
              <p className="mt-1 text-sm text-[#d7cba9]">
                Escolha um tema da lista ou volte amanhã para criar outro.
              </p>
            </div>
          </div>
        )}
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="submit"
            disabled={disabled}
            className="focus-ring h-[52px] rounded-full bg-[#2f5bff] px-7 text-sm font-semibold text-white disabled:bg-[#2c2f42] disabled:text-[#8b8fa3] sm:h-12"
          >
            {mutation.isPending ? 'Salvando…' : 'Continuar →'}
          </button>
          <p className="text-xs leading-5 text-[#8b8fa3]">
            O tema fica salvo em Seus temas para você praticar de novo.
          </p>
        </div>
      </form>
    </Page>
  );
}

function BadgeTema({ tema }: { tema: Tema }) {
  const label = rotuloTema(tema);
  const kind =
    tema.origem === 'PERSONALIZADO'
      ? 'meu'
      : tema.origem === 'PREVISAO'
        ? 'possivel'
        : 'enem';
  return <Badge kind={kind}>{label}</Badge>;
}

function ComoEnviar({ temaId }: { temaId: string }) {
  const query = useTemas();
  const location = useLocation();
  const tema = query.data?.find((item) => item.id === temaId);
  if (query.isLoading)
    return (
      <Page etapa={2}>
        <Skeleton className="h-[360px] rounded-[20px]" />
      </Page>
    );
  if (!tema)
    return (
      <Page etapa={2}>
        <Heading
          title="Tema não encontrado"
          support={
            <Link className="text-[#7f9bff]" to="/nova-redacao">
              Voltar para escolher um tema
            </Link>
          }
        />
      </Page>
    );
  return (
    <Page etapa={2}>
      <Heading title="Como você vai enviar sua redação?" />
      <div className="mt-8 rounded-[18px] border border-[#1f2130] bg-[#12131b] p-5 lg:flex lg:items-center lg:gap-5 lg:rounded-[20px]">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs tracking-[.12em] text-[#8b8fa3]">
              TEMA
            </span>
            <BadgeTema tema={tema} />
          </div>
          <p className="mt-3 text-[17px] font-semibold text-white">
            {tema.titulo}
          </p>
        </div>
        <Link
          to="/nova-redacao"
          className="focus-ring mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-[#7f9bff] lg:mt-0 lg:rounded-full lg:border lg:border-[#2c2f42] lg:px-5"
        >
          Trocar tema
        </Link>
      </div>
      {(location.state as { temaCriado?: Tema } | null)?.temaCriado && (
        <p className="mt-4 flex items-center gap-2 text-sm text-[#c9eed6]">
          <Check size={17} className="text-[#5dd39e]" /> Tema salvo em Seus
          temas.
        </p>
      )}
      <div className="mt-7 grid gap-3 lg:grid-cols-2 lg:gap-4">
        <SendCard
          to={`/temas/${tema.id}/escrever`}
          icon={<FilePenLine size={24} />}
          title="Escrever no editor"
          text="Digite sua redação aqui mesmo. O rascunho fica salvo enquanto você escreve."
          cta="Começar a escrever →"
        />
        <SendCard
          to={`/temas/${tema.id}/foto`}
          icon={<ImageUp size={24} />}
          title="Enviar foto da redação"
          text="Fotografe a redação escrita à mão. A Kelly transcreve o texto e você revisa antes de mandar para correção."
          cta="Enviar foto →"
          note="Usa 1 transcrição do dia"
        />
      </div>
    </Page>
  );
}

function SendCard({
  to,
  icon,
  title,
  text,
  cta,
  note,
}: {
  to: string;
  icon: ReactNode;
  title: string;
  text: string;
  cta: string;
  note?: string;
}) {
  return (
    <Link
      to={to}
      className="focus-ring group flex min-h-[118px] items-center gap-4 rounded-[18px] border border-[#1f2130] bg-[#12131b] p-5 hover:border-[#3e5a85] lg:min-h-[250px] lg:flex-col lg:items-start lg:rounded-[20px] lg:p-7"
    >
      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#1a1f3d] text-[#a3b6ff]">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <h2 className="text-[17px] font-semibold text-white lg:mt-4 lg:text-xl">
          {title}
        </h2>
        <p className="mt-1.5 line-clamp-2 text-sm leading-5 text-[#b4b8c8] lg:mt-3 lg:line-clamp-none lg:text-[15px] lg:leading-6">
          {text}
        </p>
        <p className="mt-5 hidden text-sm font-semibold text-[#7f9bff] lg:block">
          {cta}
        </p>
        {note && (
          <p className="mt-2 hidden text-xs text-[#8b8fa3] lg:block">{note}</p>
        )}
      </div>
      <ChevronRight size={20} className="shrink-0 text-[#7f9bff] lg:hidden" />
    </Link>
  );
}
