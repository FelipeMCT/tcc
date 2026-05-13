import { useEffect, useRef } from 'react';

interface Props {
  show: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

const COLORS = ['#4f46e5', '#f59e0b', '#16a34a', '#ec4899', '#06b6d4', '#f97316', '#8b5cf6'];

const pieces = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  color: COLORS[i % COLORS.length],
  left: `${4 + Math.round((i * 5.2) % 88)}%`,
  delay: `${((i * 0.17) % 1.4).toFixed(2)}s`,
  duration: `${(1.4 + (i * 0.09) % 0.8).toFixed(2)}s`,
  size: i % 3 === 0 ? '10px' : '7px',
  borderRadius: i % 2 === 0 ? '50%' : '2px',
}));

export default function CongratulationsEffect({ show, title, message, onClose }: Props) {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(() => onCloseRef.current(), 3000);
    return () => clearTimeout(timer);
  }, [show]);

  if (!show) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.55)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      {pieces.map((p) => (
        <span
          key={p.id}
          style={{
            position: 'fixed',
            top: '-12px',
            left: p.left,
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: p.borderRadius,
            animation: `cgConfettiFall ${p.duration} ${p.delay} ease-in forwards`,
            zIndex: 10000,
            pointerEvents: 'none',
          }}
        />
      ))}

      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#ffffff',
          borderRadius: '20px',
          padding: '44px 36px 36px',
          maxWidth: '440px',
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
          animation: 'cgPopIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
          position: 'relative',
          zIndex: 10001,
        }}
      >
        <div
          style={{
            fontSize: '64px',
            lineHeight: 1,
            marginBottom: '20px',
            display: 'block',
            animation: 'cgBounce 0.5s ease-out 0.1s both',
          }}
        >
          🎉
        </div>
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#1e293b', marginBottom: '12px' }}>
          {title}
        </h2>
        <p
          style={{
            fontSize: '15px',
            color: '#475569',
            lineHeight: 1.65,
            marginBottom: '28px',
            whiteSpace: 'pre-line',
          }}
        >
          {message}
        </p>
        <button
          onClick={onClose}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#4338ca')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#4f46e5')}
          style={{
            background: '#4f46e5',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            padding: '12px 40px',
            fontSize: '15px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background 0.15s',
          }}
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
