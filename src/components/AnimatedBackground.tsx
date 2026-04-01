import { useApp } from '../context/AppContext';

export default function AnimatedBackground() {
  const { theme } = useApp();
  const isLight = theme === 'light';

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 transition-opacity duration-1000">
      <div
        className={`absolute w-[500px] h-[500px] rounded-full animate-blob transition-opacity duration-1000
          ${isLight ? 'opacity-[0.04]' : 'opacity-[0.07]'}`}
        style={{
          background: 'radial-gradient(circle, #7C3AED, transparent 70%)',
          top: '-10%', left: '-5%',
        }}
      />
      <div
        className={`absolute w-[400px] h-[400px] rounded-full animate-blob transition-opacity duration-1000
          ${isLight ? 'opacity-[0.03]' : 'opacity-[0.05]'}`}
        style={{
          background: 'radial-gradient(circle, #C026D3, transparent 70%)',
          bottom: '-10%', right: '-5%',
          animationDelay: '4s',
          animationDirection: 'alternate-reverse',
        }}
      />
      <div
        className={`absolute w-[350px] h-[350px] rounded-full animate-blob transition-opacity duration-1000
          ${isLight ? 'opacity-[0.02]' : 'opacity-[0.04]'}`}
        style={{
          background: 'radial-gradient(circle, #1E3A5F, transparent 70%)',
          top: '40%', right: '20%',
          animationDelay: '8s',
        }}
      />
    </div>
  );
}
