import { useEffect, useRef, useState, type Ref } from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/pricing';

interface CartBottomSheetProps {
  itemCount: number;
  total: number;
  onExitComplete?: () => void;
  ref?: Ref<HTMLDivElement>;
}

const EXIT_MS = 300;

// CR-001: respeita `prefers-reduced-motion` — desativa a animação de entrada/saída
// quando o usuário preferir movimento reduzido (WCAG 2.3.3).
function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduced;
}

export default function CartBottomSheet({ itemCount, total, onExitComplete, ref }: CartBottomSheetProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [entering, setEntering] = useState(() => !reducedMotion);
  const [exiting, setExiting] = useState(false);
  const prevItemCount = useRef(itemCount);
  const onExitCompleteRef = useRef(onExitComplete);
  onExitCompleteRef.current = onExitComplete;

  // CR-004: congela os últimos valores exibidos enquanto o sheet desliza para baixo —
  // o contexto já zerou itemCount/total, mas o usuário não deve ver "0 itens — R$ 0,00".
  const lastValues = useRef({ itemCount, total });
  if (itemCount > 0) {
    lastValues.current = { itemCount, total };
  }
  const displayItemCount = exiting ? lastValues.current.itemCount : itemCount;
  const displayTotal = exiting ? lastValues.current.total : total;

  // FR-009: entrada — monta oculto e desliza para cima após o reflow (double rAF).
  // CR-001: com reduced motion o sheet já monta visível (entering=false), sem animação.
  useEffect(() => {
    if (reducedMotion) return;
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => setEntering(false));
    });
    return () => cancelAnimationFrame(raf);
  }, [reducedMotion]);

  // FR-010: saída — itemCount transita p/ 0 → exiting=true; o pai desmonta via onExitComplete.
  // CR-001: com reduced motion, desmonta imediatamente (sem animação).
  useEffect(() => {
    const hadItems = prevItemCount.current > 0;
    prevItemCount.current = itemCount;
    if (itemCount > 0) {
      setExiting(false);
    } else if (hadItems) {
      if (reducedMotion) {
        onExitCompleteRef.current?.();
        return;
      }
      setExiting(true);
      const fallback = window.setTimeout(() => onExitCompleteRef.current?.(), EXIT_MS + 100);
      return () => window.clearTimeout(fallback);
    }
  }, [itemCount, reducedMotion]);

  const handleTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (exiting && e.target === e.currentTarget && e.propertyName === 'transform') {
      onExitCompleteRef.current?.();
    }
  };

  const hidden = entering || exiting;

  return (
    <div
      ref={ref}
      onTransitionEnd={handleTransitionEnd}
      className={`fixed bottom-0 left-0 right-0 z-30 transition-all duration-300 ease-out motion-reduce:transition-none ${
        hidden ? 'translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
      }`}
    >
      {/* CR-001: card = único elemento interativo (<Link>). Acessível por teclado (Enter nativo),
          sem aninhamento de interativos nem tab stops duplicados — o CTA visual "Ver Carrinho"
          é um <span> estilizado dentro do link, não um segundo elemento interativo. */}
      <Link
        to="/carrinho"
        className="max-w-lg mx-auto bg-white border-t border-gray-200 rounded-t-2xl shadow-[0_-4px_16px_rgba(0,0,0,0.06)] px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] flex items-center justify-between gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
      >
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-wide text-gray-400 font-semibold">Seu pedido</p>
          <p className="font-bold text-gray-900 text-sm truncate">
            {displayItemCount} {displayItemCount === 1 ? 'item' : 'itens'}
          </p>
        </div>
        <p className="font-bold text-brand-600 text-lg whitespace-nowrap shrink-0">{formatCurrency(displayTotal)}</p>
        <span className="bg-brand-500 text-white text-sm font-semibold px-4 py-3 rounded-xl shrink-0">
          Ver Carrinho
        </span>
      </Link>
    </div>
  );
}
