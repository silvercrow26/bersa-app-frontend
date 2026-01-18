interface PosLockProps {
  open: boolean
  children: React.ReactNode
}

export default function PosLock({ open, children }: PosLockProps) {
  if (!open) return null

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      {children}
    </div>
  )
}