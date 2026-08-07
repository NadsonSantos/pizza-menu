import { useEffect, useRef, useState } from 'react';

const SPLASH_KEY = 'splash_shown';
const SPLASH_DURATION_MS = 2000;
const FADE_DURATION_MS = 500;

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const [fading, setFading] = useState(false);
  const [imgError, setImgError] = useState(false);
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    const fadeTimer = window.setTimeout(() => setFading(true), SPLASH_DURATION_MS);
    const finishTimer = window.setTimeout(() => {
      sessionStorage.setItem(SPLASH_KEY, '1');
      onFinish();
    }, SPLASH_DURATION_MS + FADE_DURATION_MS);
    timersRef.current = [fadeTimer, finishTimer];
    return () => {
      timersRef.current.forEach(id => window.clearTimeout(id));
    };
  }, [onFinish]);

  return (
    <div
      className={`min-h-dvh bg-brand-50 flex flex-col items-center justify-center gap-6 px-6 transition-opacity duration-500 ${
        fading ? 'opacity-0' : 'opacity-100'
      }`}
      role="status"
      aria-label="Carregando Rê Pizza's"
    >
      {imgError ? (
        <h1 className="text-3xl font-bold text-brand-900">Rê Pizza's</h1>
      ) : (
        <img
          src="/splash_logo.jpeg"
          alt="Logo Rê Pizza's"
          className="max-w-[200px] w-full h-auto rounded-2xl"
          onError={() => setImgError(true)}
        />
      )}
      <div className="w-7 h-7 border-[3px] border-brand-500 border-t-transparent rounded-full animate-spin" aria-hidden="true" />
    </div>
  );
}
