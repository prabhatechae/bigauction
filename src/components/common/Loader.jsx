export default function Loader({ text = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-5">
      {/* Animated diamond logo mark */}
      <div className="relative flex items-center justify-center w-14 h-14">
        <div className="absolute inset-0 rounded-full border border-gold/20 animate-ping" style={{ animationDuration: '1.6s' }} />
        <div className="absolute inset-2 rounded-full border border-gold/30 animate-ping" style={{ animationDuration: '1.6s', animationDelay: '0.3s' }} />
        <span className="relative text-gold text-2xl" style={{ fontFamily: 'serif' }}>◆</span>
      </div>
      <div className="text-center space-y-1">
        <p className="font-display text-charcoal text-sm font-medium tracking-widest uppercase">{text}</p>
        <div className="flex items-center justify-center gap-1.5">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-1 h-1 rounded-full bg-gold/50"
              style={{ animation: 'fadeInUp 0.8s ease infinite alternate', animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
