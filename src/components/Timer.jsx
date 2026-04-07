export default function Timer({ timeLeft }) {
  const isDanger = timeLeft <= 5 && timeLeft > 0

  return (
    <span
      className={`text-4xl font-bold tabular-nums transition-colors duration-300 ${
        isDanger ? 'timer-danger' : 'text-accent'
      }`}
      style={{ fontFamily: 'JetBrains Mono, monospace' }}
    >
      {timeLeft}
    </span>
  )
}
