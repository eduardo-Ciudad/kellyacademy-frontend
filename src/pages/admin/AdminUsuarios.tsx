import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Search,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAdminUsuarios } from '@/hooks/useAdmin';
import type { AdminUsuarioResumo } from '@/types/admin';

const cardClass =
  'bg-surface border-border-subtle rounded-[18px] border min-w-0';
const numberFormatter = new Intl.NumberFormat('pt-BR');
const selectClass =
  'focus-ring bg-surface border-control text-text rounded-input min-h-11 border px-3 text-sm';

export function AdminUsuarios() {
  const [params, setParams] = useSearchParams();
  const location = useLocation();
  const buscaUrl = params.get('busca')?.slice(0, 100) ?? '';
  const [busca, setBusca] = useState(buscaUrl);
  const plano =
    params.get('plano') === 'GRATIS' || params.get('plano') === 'PRO'
      ? params.get('plano')!
      : '';
  const email =
    params.get('email') === 'VERIFICADO' || params.get('email') === 'PENDENTE'
      ? params.get('email')!
      : '';
  const paginaParam = Number(params.get('pagina'));
  const pagina =
    Number.isInteger(paginaParam) && paginaParam >= 0 ? paginaParam : 0;

  useEffect(() => setBusca(buscaUrl), [buscaUrl]);
  useEffect(() => {
    if (busca.trim().slice(0, 100) === buscaUrl) return;
    const timeout = window.setTimeout(() => {
      setParams((atual) => {
        const proxima = new URLSearchParams(atual);
        const valor = busca.trim().slice(0, 100);
        if (valor) proxima.set('busca', valor);
        else proxima.delete('busca');
        proxima.set('pagina', '0');
        return proxima;
      });
    }, 300);
    return () => window.clearTimeout(timeout);
  }, [busca, buscaUrl, setParams]);

  const query = useAdminUsuarios({
    busca: buscaUrl,
    plano: plano as 'GRATIS' | 'PRO' | '',
    email: email as 'VERIFICADO' | 'PENDENTE' | '',
    pagina,
    tamanho: 20,
  });
  const data = query.data;
  const temFiltros = Boolean(buscaUrl || plano || email);
  const filtro = (nome: 'plano' | 'email', valor: string) =>
    setParams((atual) => {
      const proxima = new URLSearchParams(atual);
      if (valor) proxima.set(nome, valor);
      else proxima.delete(nome);
      proxima.set('pagina', '0');
      return proxima;
    });
  const limpar = () => {
    setBusca('');
    setParams({ pagina: '0' });
  };

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-text font-display text-[34px] leading-tight font-light tracking-[-0.03em]">
            Usuários
          </h1>
          <p className="text-text-3 mt-2 text-sm">
            {data
              ? `${numberFormatter.format(data.totalItens)} resultado${data.totalItens === 1 ? '' : 's'}`
              : 'Gerencie as contas da plataforma'}
          </p>
        </div>
        {query.isPlaceholderData ? (
          <span role="status" className="text-text-3 text-xs">
            Atualizando…
          </span>
        ) : null}
      </header>
      <section
        aria-label="Filtros de usuários"
        className={`${cardClass} mt-7 grid gap-3 p-4 md:grid-cols-[minmax(240px,1fr)_180px_180px]`}
      >
        <label className="relative">
          <span className="sr-only">Buscar por nome ou e-mail</span>
          <Search
            className="text-text-3 pointer-events-none absolute top-1/2 left-4 -translate-y-1/2"
            size={18}
            aria-hidden="true"
          />
          <Input
            value={busca}
            maxLength={100}
            onChange={(event) => setBusca(event.target.value)}
            placeholder="Buscar nome ou e-mail"
            className="h-11 pl-11"
          />
        </label>
        <select
          aria-label="Plano"
          value={plano}
          onChange={(event) => filtro('plano', event.target.value)}
          className={selectClass}
        >
          <option value="">Todos os planos</option>
          <option value="GRATIS">Grátis</option>
          <option value="PRO">Pro</option>
        </select>
        <select
          aria-label="E-mail"
          value={email}
          onChange={(event) => filtro('email', event.target.value)}
          className={selectClass}
        >
          <option value="">Todos os e-mails</option>
          <option value="VERIFICADO">Verificado</option>
          <option value="PENDENTE">Pendente</option>
        </select>
      </section>
      {query.isPending ? (
        <UsuariosSkeleton />
      ) : query.isError ? (
        <Estado
          mensagem="Não foi possível carregar os usuários."
          acao="Tentar de novo"
          onClick={() => void query.refetch()}
        />
      ) : data?.itens.length === 0 ? (
        <Estado
          mensagem={
            temFiltros
              ? 'Nenhum usuário encontrado com esses filtros.'
              : 'Ainda não há usuários cadastrados.'
          }
          acao={temFiltros ? 'Limpar filtros' : undefined}
          onClick={limpar}
        />
      ) : data ? (
        <>
          <UsuariosTabela
            usuarios={data.itens}
            voltarPara={`${location.pathname}${location.search}`}
          />
          <nav
            aria-label="Paginação"
            className="mt-5 flex flex-wrap items-center justify-between gap-3"
          >
            <Button
              variant="outline"
              disabled={pagina === 0}
              onClick={() =>
                setParams((atual) => {
                  const p = new URLSearchParams(atual);
                  p.set('pagina', String(Math.max(0, pagina - 1)));
                  return p;
                })
              }
            >
              <ChevronLeft size={17} aria-hidden="true" /> Anterior
            </Button>
            <span className="text-text-2 text-sm">
              Página {pagina + 1} de {Math.max(1, data.totalPaginas)}
            </span>
            <Button
              variant="outline"
              disabled={!data.temProxima}
              onClick={() =>
                setParams((atual) => {
                  const p = new URLSearchParams(atual);
                  p.set('pagina', String(pagina + 1));
                  return p;
                })
              }
            >
              Próxima <ChevronRight size={17} aria-hidden="true" />
            </Button>
          </nav>
        </>
      ) : null}
    </div>
  );
}

function UsuariosTabela({
  usuarios,
  voltarPara,
}: {
  usuarios: AdminUsuarioResumo[];
  voltarPara: string;
}) {
  return (
    <>
      <div className={`${cardClass} mt-5 hidden overflow-hidden md:block`}>
        <div className="text-text-3 border-border-subtle grid grid-cols-[minmax(220px,2fr)_90px_130px_75px_85px_110px] gap-3 border-b px-5 py-3 text-xs font-semibold">
          <span>Usuário</span>
          <span>Plano</span>
          <span>E-mail</span>
          <span>Redações</span>
          <span>Nota média</span>
          <span>Cadastro</span>
        </div>
        {usuarios.map((usuario) => (
          <UsuarioLinha
            key={usuario.id}
            usuario={usuario}
            voltarPara={voltarPara}
          />
        ))}
      </div>
      <div className="mt-5 space-y-3 md:hidden">
        {usuarios.map((usuario) => (
          <UsuarioCard
            key={usuario.id}
            usuario={usuario}
            voltarPara={voltarPara}
          />
        ))}
      </div>
    </>
  );
}

function PlanoBadge({ plano }: { plano: AdminUsuarioResumo['plano'] }) {
  return (
    <span
      className={`rounded-pill inline-flex w-fit px-2.5 py-1 text-xs font-semibold ${plano === 'PRO' ? 'bg-nav-active text-accent-text' : 'bg-control text-text-2'}`}
    >
      {plano === 'PRO' ? 'Pro' : 'Grátis'}
    </span>
  );
}
function Verificacao({ ok }: { ok: boolean }) {
  const Icon = ok ? CheckCircle2 : Clock3;
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs ${ok ? 'text-success' : 'text-warning'}`}
    >
      <Icon size={15} aria-hidden="true" />
      {ok ? 'Verificado' : 'Pendente'}
    </span>
  );
}
const nota = (valor: number | null) =>
  valor === null ? '—' : numberFormatter.format(valor);
const relativa = (valor: string | null) =>
  valor
    ? formatDistanceToNow(parseISO(valor), { addSuffix: true, locale: ptBR })
    : '—';
const href = (id: string) => `/admin/usuarios/${encodeURIComponent(id)}`;

function UsuarioLinha({
  usuario,
  voltarPara,
}: {
  usuario: AdminUsuarioResumo;
  voltarPara: string;
}) {
  return (
    <Link
      to={href(usuario.id)}
      state={{ from: voltarPara }}
      className="focus-ring hover:bg-surface-2 border-border-subtle grid min-h-[82px] grid-cols-[minmax(220px,2fr)_90px_130px_75px_85px_110px] items-center gap-3 border-b px-5 py-3 transition-colors last:border-0"
    >
      <span className="min-w-0">
        <strong className="text-text block truncate text-sm font-semibold">
          {usuario.nome}
        </strong>
        <span className="text-text-3 mt-1 block truncate text-xs">
          {usuario.email}
        </span>
        <span className="text-text-3 mt-1 block truncate text-[11px]">
          Última redação: {relativa(usuario.ultimaRedacaoEm)}
        </span>
      </span>
      <PlanoBadge plano={usuario.plano} />
      <Verificacao ok={usuario.emailVerificado} />
      <span className="text-text-2 text-sm">{usuario.totalRedacoes}</span>
      <span className="text-text text-sm">{nota(usuario.notaMedia)}</span>
      <span className="text-text-2 text-xs">
        {format(parseISO(usuario.criadoEm), 'dd/MM/yyyy')}
      </span>
    </Link>
  );
}
function UsuarioCard({
  usuario,
  voltarPara,
}: {
  usuario: AdminUsuarioResumo;
  voltarPara: string;
}) {
  return (
    <Link
      to={href(usuario.id)}
      state={{ from: voltarPara }}
      className={`${cardClass} focus-ring hover:border-border-hover block p-5 transition-colors`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="min-w-0">
          <strong className="text-text block truncate">{usuario.nome}</strong>
          <span className="text-text-3 mt-1 block truncate text-xs">
            {usuario.email}
          </span>
        </span>
        <PlanoBadge plano={usuario.plano} />
      </div>
      <div className="mt-4">
        <Verificacao ok={usuario.emailVerificado} />
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-4 text-xs">
        <div>
          <dt className="text-text-3">Redações</dt>
          <dd className="text-text mt-1">{usuario.totalRedacoes}</dd>
        </div>
        <div>
          <dt className="text-text-3">Nota média</dt>
          <dd className="text-text mt-1">{nota(usuario.notaMedia)}</dd>
        </div>
        <div>
          <dt className="text-text-3">Última redação</dt>
          <dd className="text-text mt-1">
            {relativa(usuario.ultimaRedacaoEm)}
          </dd>
        </div>
        <div>
          <dt className="text-text-3">Cadastro</dt>
          <dd className="text-text mt-1">
            {format(parseISO(usuario.criadoEm), 'dd/MM/yyyy')}
          </dd>
        </div>
      </dl>
    </Link>
  );
}
function Estado({
  mensagem,
  acao,
  onClick,
}: {
  mensagem: string;
  acao?: string;
  onClick: () => void;
}) {
  return (
    <section className={`${cardClass} mt-5 px-6 py-12 text-center`}>
      <p className="text-text-2 text-sm">{mensagem}</p>
      {acao ? (
        <Button variant="outline" className="mt-5" onClick={onClick}>
          {acao}
        </Button>
      ) : null}
    </section>
  );
}
function UsuariosSkeleton() {
  return (
    <div aria-label="Carregando usuários" className="mt-5 space-y-3">
      <Skeleton className="h-16 rounded-[18px]" />
      {Array.from({ length: 5 }, (_, i) => (
        <Skeleton key={i} className="h-20 rounded-[18px]" />
      ))}
    </div>
  );
}
