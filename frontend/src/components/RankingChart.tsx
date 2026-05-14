interface RankingEntry {
  id: number;
  name: string;
  points: number;
  level: string;
}

interface Props {
  top3: RankingEntry[];
  currentUserId?: number;
}

const MEDALS = ['🥇', '🥈', '🥉'];
const BAR_COLORS = ['#f59e0b', '#94a3b8', '#cd7f32'];
const MAX_H = 140;

export default function RankingChart({ top3, currentUserId }: Props) {
  if (top3.length === 0) {
    return <p style={{ color: 'var(--text-muted)' }}>Nenhum funcionário cadastrado.</p>;
  }

  const maxPoints = top3[0].points || 1;

  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        boxShadow: 'var(--shadow)',
        padding: '20px 24px 16px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: '12px',
          height: `${MAX_H + 36}px`,
        }}
      >
        {top3.map((u, i) => {
          const h = Math.max(28, Math.round((u.points / maxPoints) * MAX_H));
          return (
            <div
              key={u.id}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-end',
                height: '100%',
              }}
            >
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: BAR_COLORS[i],
                  marginBottom: '4px',
                }}
              >
                {u.points} pts
              </div>
              <div
                style={{
                  width: '100%',
                  height: `${h}px`,
                  background: BAR_COLORS[i],
                  borderRadius: '6px 6px 0 0',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  paddingTop: '6px',
                  fontSize: '20px',
                  lineHeight: 1,
                }}
              >
                {MEDALS[i]}
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          display: 'flex',
          gap: '12px',
          borderTop: '2px solid var(--border)',
          paddingTop: '10px',
        }}
      >
        {top3.map((u, i) => {
          const isMe = currentUserId !== undefined && u.id === currentUserId;
          const firstName = u.name.split(' ')[0];
          return (
            <div key={u.id} style={{ flex: 1, textAlign: 'center' }}>
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: isMe ? 700 : 500,
                  color: isMe ? 'var(--primary)' : 'var(--text)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {firstName}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                {u.level}
                {isMe && (
                  <span style={{ color: 'var(--primary)', fontWeight: 600 }}> · você</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
