export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="px-3 py-1.5 rounded border border-gold text-charcoal disabled:opacity-30 hover:bg-gold hover:text-almost-black transition-colors text-sm"
      >
        ← Prev
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`w-8 h-8 rounded text-sm font-medium transition-colors
            ${p === page
              ? 'bg-emerald text-ivory'
              : 'border border-taupe text-charcoal hover:border-emerald hover:text-emerald'
            }`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="px-3 py-1.5 rounded border border-gold text-charcoal disabled:opacity-30 hover:bg-gold hover:text-almost-black transition-colors text-sm"
      >
        Next →
      </button>
    </div>
  )
}
