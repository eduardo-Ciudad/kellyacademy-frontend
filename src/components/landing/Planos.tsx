import { useRef, useState, type KeyboardEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  formatarPreco,
  linhasComparativo,
  planos,
  PRECO_PRO_ANUAL,
  PRECO_PRO_MENSAL,
  textosPlanos,
  type Ciclo,
  type ValorComparativo,
} from '@/components/landing/data/planos';
import { PlanosMobile } from '@/components/landing/PlanosMobile';
import { useIsMobileLanding } from '@/components/landing/fx/useIsMobileLanding';
import { useAuth } from '@/lib/auth';
import { acaoBotaoPro, pagamentoHabilitado } from '@/lib/assinatura';

export function Planos() {
  const isMobile = useIsMobileLanding();
  const [ciclo, setCiclo] = useState<Ciclo>('mensal');
  return isMobile ? (
    <PlanosMobile ciclo={ciclo} onCicloChange={setCiclo} />
  ) : (
    <PlanosDesktop ciclo={ciclo} onCicloChange={setCiclo} />
  );
}

function PlanosDesktop({
  ciclo,
  onCicloChange,
}: {
  ciclo: Ciclo;
  onCicloChange: (ciclo: Ciclo) => void;
}) {
  return (
    <section id="planos" className="landing-section scroll-mt-20 px-6">
      <header className="mx-auto max-w-[760px] text-center">
        <h2 className="font-display text-text text-[56px] leading-[1.04] font-light tracking-[-0.04em]">
          {textosPlanos.tituloInicio}{' '}
          <span className="text-text-3">{textosPlanos.tituloFim}</span>
        </h2>
        <p className="text-text-2 mx-auto mt-5 max-w-[680px] text-[17px] leading-[1.6]">
          {textosPlanos.descricao}
        </p>
      </header>
      <div className="mt-8 flex justify-center">
        <CicloSelector ciclo={ciclo} onChange={onCicloChange} />
      </div>
      <div className="mx-auto mt-10 grid max-w-[1000px] grid-cols-2 gap-5">
        <PlanoCard tipo="gratis" ciclo={ciclo} />
        <PlanoCard tipo="pro" ciclo={ciclo} />
      </div>
      <Comparativo />
    </section>
  );
}

function CicloSelector({
  ciclo,
  onChange,
}: {
  ciclo: Ciclo;
  onChange: (ciclo: Ciclo) => void;
}) {
  const ciclos: Ciclo[] = ['mensal', 'anual'];
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const onKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    if (
      !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)
    )
      return;
    event.preventDefault();
    const delta = event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 1;
    const next = (index + delta + ciclos.length) % ciclos.length;
    onChange(ciclos[next]);
    refs.current[next]?.focus();
  };
  return (
    <div
      role="radiogroup"
      aria-label={textosPlanos.seletor.rotulo}
      className="border-surface-2 bg-photo-drop flex rounded-full border p-1"
    >
      {ciclos.map((item, index) => {
        const ativo = ciclo === item;
        return (
          <button
            key={item}
            ref={(el) => {
              refs.current[index] = el;
            }}
            type="button"
            role="radio"
            aria-checked={ativo}
            tabIndex={ativo ? 0 : -1}
            onClick={() => onChange(item)}
            onKeyDown={(event) => onKeyDown(event, index)}
            className={`focus-ring min-h-9 rounded-full px-4 text-sm font-medium transition-colors motion-reduce:transition-none ${ativo ? 'bg-surface-2 text-text' : 'text-text-3'}`}
          >
            {item === 'mensal'
              ? textosPlanos.seletor.mensal
              : textosPlanos.seletor.anual}
            {item === 'anual' && (
              <span className="text-accent-text ml-1">
                {textosPlanos.seletor.desconto}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function PlanoCard({ tipo, ciclo }: { tipo: 'gratis' | 'pro'; ciclo: Ciclo }) {
  const plano = planos[tipo];
  const pro = tipo === 'pro';
  const { isAuthenticated } = useAuth();
  const acaoPro = acaoBotaoPro({
    pagamentoHabilitado,
    logado: isAuthenticated,
  });
  return (
    <article
      className={`flex min-h-[540px] flex-col rounded-[20px] border p-9 ${pro ? 'border-accent bg-[linear-gradient(180deg,color-mix(in_srgb,var(--color-accent)_6%,transparent),transparent_55%)]' : 'border-surface-2'}`}
    >
      <div className="flex min-h-16 items-start justify-between gap-5">
        <div>
          <h3 className="text-text text-[24px] leading-tight font-semibold">
            {plano.nome}
          </h3>
          <p className="text-text-2 mt-2 max-w-[340px] text-[15px] leading-[1.55]">
            {plano.descricao}
          </p>
        </div>
        {pro && (
          <span className="border-accent/40 bg-accent/10 text-accent-text shrink-0 rounded-full border px-2.5 py-1 font-mono text-[10px] font-semibold tracking-[0.1em]">
            {planos.pro.selo}
          </span>
        )}
      </div>
      <div className="mt-9">
        {pro ? <PrecoPro ciclo={ciclo} /> : <PrecoGratis />}
      </div>
      <ul className="text-text-body mt-8 mb-8 flex flex-col gap-3 border-t border-[#2a2b2c] pt-7 text-[15px] leading-[1.5]">
        {plano.itens.map((item) => (
          <li key={item} className="flex gap-3">
            <Check
              size={18}
              strokeWidth={2}
              aria-hidden="true"
              className={`mt-0.5 shrink-0 ${pro ? 'text-accent-text' : 'text-text-3'}`}
            />
            {item}
          </li>
        ))}
      </ul>
      {pro && acaoPro === 'em-breve' ? (
        <div className="bg-control text-text-2 mt-auto flex min-h-13 items-center justify-center rounded-full px-5 text-center text-[15px] font-semibold">
          Assinatura disponível em breve
        </div>
      ) : (
        <Link
          to={pro ? acaoPro : planos.gratis.destino}
          className={`focus-ring mt-auto flex min-h-13 items-center justify-center rounded-full border px-5 text-center text-[15px] font-semibold transition-colors motion-reduce:transition-none ${pro ? 'border-accent bg-accent hover:bg-accent-hover text-white' : 'text-text hover:bg-surface-2 border-[#3a3b3c]'}`}
        >
          {pro ? 'Assinar Pro' : planos.gratis.botao}
        </Link>
      )}
    </article>
  );
}

function PrecoGratis() {
  return (
    <>
      <p className="font-display text-text flex items-end gap-2 text-[56px] leading-none font-light tracking-[-0.04em] tabular-nums">
        {formatarPreco(planos.gratis.preco)}
        <span className="text-text-3 pb-1.5 font-sans text-[15px] font-normal tracking-normal">
          {planos.gratis.sufixo}
        </span>
      </p>
      <div className="mt-3 h-6" aria-hidden="true" />
    </>
  );
}

function PrecoPro({ ciclo }: { ciclo: Ciclo }) {
  const reduceMotion = useReducedMotion();
  const anual = ciclo === 'anual';
  const preco = anual ? PRECO_PRO_ANUAL.mensalComDesconto : PRECO_PRO_MENSAL;
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={ciclo}
        initial={reduceMotion ? false : { opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduceMotion ? undefined : { opacity: 0, y: -5 }}
        transition={{ duration: reduceMotion ? 0 : 0.18, ease: 'easeOut' }}
      >
        <p className="font-display text-text flex items-end gap-2 text-[56px] leading-none font-light tracking-[-0.04em] tabular-nums">
          {formatarPreco(preco)}
          <span className="text-text-3 pb-1.5 font-sans text-[15px] font-normal tracking-normal">
            {planos.pro.sufixo}
          </span>
        </p>
        <p className="text-text-3 mt-3 h-6 text-[13px] leading-6">
          {anual ? (
            <>
              {planos.pro.detalheAnual} ·{' '}
              {formatarPreco(PRECO_PRO_ANUAL.totalAnual)}/ano ·{' '}
              <span className="line-through">
                {formatarPreco(PRECO_PRO_MENSAL)}
              </span>
            </>
          ) : (
            planos.pro.detalheMensal
          )}
        </p>
      </motion.div>
    </AnimatePresence>
  );
}

function Comparativo() {
  return (
    <div className="mx-auto mt-24 max-w-[1000px]">
      <p className="text-text-2 mb-5 text-[15px]">
        {textosPlanos.comparativo.titulo}
      </p>
      <table className="w-full table-fixed border-collapse text-left text-[15px]">
        <thead>
          <tr className="border-b border-[#2a2b2c]">
            <th scope="col" className="text-text-3 w-1/2 px-5 py-4 font-medium">
              {textosPlanos.comparativo.recurso}
            </th>
            <th
              scope="col"
              className="text-text w-1/4 px-5 py-4 text-center font-semibold"
            >
              {textosPlanos.comparativo.gratis}
            </th>
            <th
              scope="col"
              className="text-accent-text bg-accent/[.05] w-1/4 px-5 py-4 text-center font-semibold"
            >
              {textosPlanos.comparativo.pro}
            </th>
          </tr>
        </thead>
        <tbody>
          {linhasComparativo.map((linha) => (
            <tr key={linha.nome} className="border-b border-[#2a2b2c]">
              <th
                scope="row"
                className="text-text-body px-5 py-[18px] font-normal"
              >
                {linha.nome}
              </th>
              <td className="text-text-2 px-5 py-[18px] text-center">
                <Valor valor={linha.gratis} />
              </td>
              <td className="text-text-2 bg-accent/[.05] px-5 py-[18px] text-center">
                <Valor valor={linha.pro} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Valor({ valor }: { valor: ValorComparativo }) {
  if (typeof valor === 'string') return valor;
  const Icon = valor ? Check : X;
  return (
    <span className="inline-flex items-center justify-center">
      <Icon
        size={19}
        strokeWidth={2}
        aria-hidden="true"
        className={valor ? 'text-accent-text' : 'text-[#4a4b4d]'}
      />
      <span className="sr-only">
        {valor
          ? textosPlanos.comparativo.incluido
          : textosPlanos.comparativo.naoIncluido}
      </span>
    </span>
  );
}
