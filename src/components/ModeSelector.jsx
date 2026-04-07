export default function ModeSelector({ mode, onChange }) {
  const modes = [15, 30, 60]

  return (
    <div className="flex gap-5">
      {modes.map(m => (
        <button
          key={m}
          onClick={() => onChange(m)}
          className="transition-all duration-150 relative"
          style={{
            minHeight: '44px',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '15px',
            fontWeight: mode === m ? '600' : '400',
            color: mode === m ? '#e2b714' : '#3a3a4a',
            background: 'none',
            border: 'none',
            padding: '0',
          }}
        >
          {m}s
          {mode === m && (
            <span
              className="absolute left-0 right-0"
              style={{
                bottom: '-4px',
                height: '2px',
                backgroundColor: '#e2b714',
                borderRadius: '1px',
              }}
            />
          )}
        </button>
      ))}
    </div>
  )
}
