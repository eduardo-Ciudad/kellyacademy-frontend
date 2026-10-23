import { useRef, useState, type KeyboardEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Check, ChevronDown, X } from 'lucide-react';
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
import { useAuth } from '@/lib/auth';
import { acaoBotaoPro, pagamentoHabilitado } from '@/lib/assinatura';

export function PlanosMobile({
  ciclo,
  onCicloChange,
}: {
  ciclo: Ciclo;
  onCicloChange: (ciclo: Ciclo) => void;
}) {
  const [aberto, setAberto] = useState(false);
  return (
    <section id="planos" className="landing-section scroll-mt-20 px-4">
      <header className="mx-auto max-w-[520px] text-left">
        <h2 className="font-display text-text text-[36px] leading-[1.08] font-light tracking-[-0.03em] text-balance">
          {textosPlanos.tituloInicio}{' '}
          <span className="text-text-3">{textosPlanos.tituloFim}</span>
        </h2>
        <p className="text-text-3 mt-4 text-base leading-[1.6]">
          {textosPlanos.descricao}
        </p>
      </header>
      <div className="mt-7 flex justify-center">
        <CicloSelector ciclo={ciclo} onChange={onCicloChange} />
      </div>
      <div className="mx-auto mt-8 flex max-w-[560px] flex-col gap-4">
        <PlanoCard tipo="pro" ciclo={ciclo} />
        <PlanoCard tipo="gratis" ciclo={ciclo} />
        <div className="mt-7 border-y border-[#2a2b2c]">
          <button
            type="button"
            aria-expanded={aberto}
            aria-controls="comparativo-planos-mobile"
            onClick={() => setAberto((valor) => !valor)}
            className="focus-ring text-text flex min-h-14 w-full items-center justify-between py-3 text-left text-[15px] font-medium"
          >
            {textosPlanos.comparativo.titulo}
            <ChevronDown
              size={18}
              aria-hidden="true"
              className={`text-text-3 transition-transform motion-reduce:transition-none ${aberto ? 'rotate-180' : ''}`}
            />
          </button>
          {aberto && (
            <div id="comparativo-planos-mobile" className="pb-3">
              {linhasComparativo.map((linha) => (
                <div
                  key={linha.nome}
                  className="border-t border-[#2a2b2c] py-4"
                >
                  <p className="text-text-body text-[14px] leading-[1.45]">
                    {linha.nome}
                  </p>
                  <p className="text-text-3 mt-2 flex flex-wrap items-center gap-x-2 text-[13px]">
                    <span>{textosPlanos.comparativo.gratis}:</span>
                    <Valor valor={linha.gratis} />
                    <span aria-hidden="true">·</span>
                    <span>{textosPlanos.comparativo.pro}:</span>
                    <Valor valor={linha.pro} />
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
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
            className={`focus-ring min-h-9 rounded-full px-3.5 text-[13px] font-medium transition-colors motion-reduce:transition-none ${ativo ? 'bg-surface-2 text-text' : 'text-text-3'}`}
          >
            {item === 'mensal'
              ? textosPlanos.seletor.mensal
              : textosPlanos.seletor.anual}
            {item === 'anual' && (
              <span className="text-accent-text ml-0.5">
                {' '}
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
      className={`flex flex-col rounded-[20px] border p-6 ${pro ? 'border-accent bg-[linear-gradient(180deg,color-mix(in_srgb,var(--color-accent)_6%,transparent),transparent_55%)]' : 'border-surface-2'}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-text text-[22px] font-semibold">{plano.nome}</h3>
          <p className="text-text-2 mt-1.5 text-[14px] leading-[1.5]">
            {plano.descricao}
          </p>
        </div>
        {pro && (
          <span className="border-accent/40 bg-accent/10 text-accent-text mt-0.5 shrink-0 rounded-full border px-2 py-1 font-mono text-[9px] font-semibold tracking-[0.09em]">
            {planos.pro.selo}
          </span>
        )}
      </div>
      <div className="mt-7">
        {pro ? <PrecoPro ciclo={ciclo} /> : <PrecoGratis />}
      </div>
      <ul className="text-text-body mt-6 flex flex-col gap-2.5 border-t border-[#2a2b2c] pt-5 text-[14px] leading-[1.45]">
        {plano.itens.map((item) => (
          <li key={item} className="flex gap-2.5">
            <Check
              size={17}
              strokeWidth={2}
              aria-hidden="true"
              className={`mt-0.5 shrink-0 ${pro ? 'text-accent-text' : 'text-text-3'}`}
            />
            {item}
          </li>
        ))}
      </ul>
      {pro && acaoPro === 'em-breve' ? (
        <div className="bg-control text-text-2 mt-7 flex min-h-12 items-center justify-center rounded-full px-4 text-center text-[14px] font-semibold">
          Assinatura disponível em breve
        </div>
      ) : (
        <Link
          to={pro ? acaoPro : planos.gratis.destino}
          className={`focus-ring mt-7 flex min-h-12 items-center justify-center rounded-full border px-4 text-center text-[14px] font-semibold transition-colors motion-reduce:transition-none ${pro ? 'border-accent bg-accent active:bg-accent-hover text-white' : 'text-text active:bg-surface-2 border-[#3a3b3c]'}`}
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
      <p className="font-display text-text flex items-end gap-2 text-[46px] leading-none font-light tracking-[-0.04em] tabular-nums">
        {formatarPreco(planos.gratis.preco)}
        <span className="text-text-3 pb-1 font-sans text-[14px] font-normal tracking-normal">
          {planos.gratis.sufixo}
        </span>
      </p>
      <div className="mt-2 h-6" aria-hidden="true" />
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
        <p className="font-display text-text flex items-end gap-2 text-[46px] leading-none font-light tracking-[-0.04em] tabular-nums">
          {formatarPreco(preco)}
          <span className="text-text-3 pb-1 font-sans text-[14px] font-normal tracking-normal">
            {planos.pro.sufixo}
          </span>
        </p>
        <p className="text-text-3 mt-2 h-6 text-[11px] leading-6 whitespace-nowrap">
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

function Valor({ valor }: { valor: ValorComparativo }) {
  if (typeof valor === 'string')
    return <span className="text-text-2">{valor}</span>;
  const Icon = valor ? Check : X;
  return (
    <span className="inline-flex items-center">
      <Icon
        size={16}
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
