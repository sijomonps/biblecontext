interface BookProgressRingProps {
  progress: number
  size?: number
  strokeWidth?: number
  seed?: string
}

const patterns = ['dots', 'slashes', 'arcs', 'ticks'] as const

const getPattern = (seed?: string) => {
  if (!seed) return patterns[0]
  let hash = 0
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(i)
    hash |= 0
  }
  const idx = Math.abs(hash) % patterns.length
  return patterns[idx]
}

export default function BookProgressRing({
  progress,
  size = 48,
  strokeWidth = 3,
  seed,
}: BookProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference
  const pattern = getPattern(seed)

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/40"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={progress > 0 ? 'text-primary transition-all duration-500' : 'text-muted/30'}
        />
        <g
          className="text-white/55"
          transform={`translate(${size / 2} ${size / 2})`}
          opacity={0.6}
        >
          {pattern === 'dots' && (
            <>
              <circle cx={-8} cy={-4} r={1.2} fill="currentColor" />
              <circle cx={6} cy={-6} r={0.9} fill="currentColor" />
              <circle cx={2} cy={7} r={1.1} fill="currentColor" />
              <circle cx={-5} cy={8} r={0.8} fill="currentColor" />
            </>
          )}
          {pattern === 'slashes' && (
            <>
              <path d="M -8 4 L -2 -2" stroke="currentColor" strokeWidth={1} />
              <path d="M -1 8 L 5 2" stroke="currentColor" strokeWidth={1} />
              <path d="M 4 -1 L 9 -6" stroke="currentColor" strokeWidth={1} />
            </>
          )}
          {pattern === 'arcs' && (
            <>
              <path d="M -7 2 A 4 4 0 0 1 -1 -3" stroke="currentColor" strokeWidth={1} fill="none" />
              <path d="M 2 8 A 4 4 0 0 0 8 2" stroke="currentColor" strokeWidth={1} fill="none" />
            </>
          )}
          {pattern === 'ticks' && (
            <>
              <path d="M -8 -6 L -8 -2" stroke="currentColor" strokeWidth={1} />
              <path d="M 0 -8 L 0 -4" stroke="currentColor" strokeWidth={1} />
              <path d="M 7 -1 L 7 3" stroke="currentColor" strokeWidth={1} />
              <path d="M -3 6 L -3 9" stroke="currentColor" strokeWidth={1} />
            </>
          )}
        </g>
      </svg>
      {progress > 0 && (
        <span className="absolute inset-0 flex items-center justify-center text-[9px] font-semibold text-primary">
          {progress}%
        </span>
      )}
    </div>
  )
}