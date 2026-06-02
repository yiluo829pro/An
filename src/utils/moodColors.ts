export function getMoodGradient(value: number): string {
  if (value <= 15) return 'from-[#0d0d1a] to-[#1a1a2e]'
  if (value <= 30) return 'from-[#1a1a2e] to-[#2d3561]'
  if (value <= 45) return 'from-[#2d3561] to-[#3d4a6b]'
  if (value <= 55) return 'from-[#3a4a3a] to-[#4a5a4a]'
  if (value <= 70) return 'from-[#4a3a20] to-[#6b5535]'
  if (value <= 82) return 'from-[#5a4520] to-[#8b6b30]'
  if (value <= 92) return 'from-[#6b5020] to-[#c4922a]'
  return 'from-[#7a5515] to-[#e8c547]'
}

export function getMoodBarColor(value: number): string {
  if (value <= 15) return '#1a1a2e'
  if (value <= 30) return '#2d3561'
  if (value <= 45) return '#6b7c8d'
  if (value <= 55) return '#6b8c6b'
  if (value <= 70) return '#c4a862'
  if (value <= 82) return '#e8c547'
  if (value <= 92) return '#f0b840'
  return '#f5e642'
}

export function getMoodWord(value: number): string {
  if (value <= 15) return 'Heavy'
  if (value <= 30) return 'Low'
  if (value <= 45) return 'Quiet'
  if (value <= 55) return 'Okay'
  if (value <= 70) return 'Steady'
  if (value <= 82) return 'Good'
  if (value <= 92) return 'Light'
  return 'Bright'
}
