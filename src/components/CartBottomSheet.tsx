import { useEffect, useRef, useState, type Ref } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../utils/pricing';

interface CartBottomSheetProps {
  itemCount: number;
  total: number;
  onExitComplete?: () => void;
  ref?: Ref<HTMLDivElement>;
}

const EXIT_MS = 300;

export default function CartBottomSheet({ itemCount, total, onExitComplete, ref }: CartBottomSheetProps) {
  const navigate = useNavigate();
  const [entering, setEntering] = useState(true);
  const [exiting, setExiting] = useState(false);
  const prevItemCount = useRef(itemCount);
  const onExitCompleteRef = useRef(onExitComplete);
  onExitCompleteRef.current = onExitComplete;

  const goToCart = () => navigate('/carrinho');

  // FR-009: entrada — monta oculto e desliza para cima após o reflow (double rAF)
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => setEntering(false));
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  // FR-010: saída — itemCount transita p/ 0 → exiting=true; o pai desmonta via onExitComplete
  useEffect(() => {
    const hadItems = prevItemCount.current > 0;
    prevItemCount.current = itemCount;
    if (itemCount > 0) {
      setExiting(false);
    } else if (hadItems) {
      setExiting(true);
      const fallback = window.setTimeout(() => onExitCompleteRef.current?.(), EXIT_MS + 100);
      return () => window.clearTimeout(fallback);
    }
  }, [itemCount]);

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
      className={`fixed bottom-0 left-0 right-0 z-30 transition-all duration-300 ease-out ${
        hidden ? 'translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
      }`}
    >
      <div
        onClick={goToCart}
        className="max-w-lg mx-auto bg-white border-t border-gray-200 rounded-t-2xl shadow-[0_-4px_16px_rgba(0,0,0,0.06)] px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] flex items-center justify-between gap-3 cursor-pointer"
      >
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-wide text-gray-400 font-semibold">Seu pedido</p>
          <p className="font-bold text-gray-900 text-sm truncate">
            {itemCount} {itemCount === 1 ? 'item' : 'itens'}
          </p>
        </div>
        <p className="font-bold text-brand-600 text-lg whitespace-nowrap shrink-0">{formatCurrency(total)}</p>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); goToCart(); }}
          className="bg-brand-500 text-white text-sm font-semibold px-4 py-3 rounded-xl hover:bg-brand-600 active:scale-[0.98] transition-all cursor-pointer shrink-0"
        >
          Ver Carrinho
        </button>
      </div>
    </div>
  );
}
