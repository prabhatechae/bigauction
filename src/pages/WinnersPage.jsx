import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchAuctions } from '../features/auctions/auctionsSlice'
import Loader from '../components/common/Loader'

function anonymize(name) {
  if (!name) return 'Anonymous'
  const parts = name.trim().split(' ')
  if (parts.length === 1) return parts[0]
  return parts[0] + ' ' + parts[1][0] + '.'
}

function WinnerCard({ auction, rank }) {
  const product = auction.product
  const image   = product?.imageUrls?.[0] || null
  const date    = auction.endTime
    ? new Date(auction.endTime).toLocaleDateString('en-AE', { day: 'numeric', month: 'long', year: 'numeric' })
    : '—'
  const amount  = Number(auction.currentHighestBid || 0)
  const isBuyNow = auction.status === 'SOLD'

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-luxury hover:shadow-luxury-hover transition-all duration-300 group flex flex-col">

      {/* Image */}
      <div className="relative h-52 bg-ivory overflow-hidden flex-shrink-0">
        {image
          ? <img src={image} alt={product?.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          : <div className="w-full h-full flex items-center justify-center text-taupe/20 text-5xl">◆</div>
        }

        {/* Sold badge */}
        <div className="absolute top-3 left-3 bg-emerald text-ivory text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider">
          {isBuyNow ? 'Buy Now' : 'Auction Won'}
        </div>

        {/* Rank badge */}
        {rank <= 3 && (
          <div className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-md ${
            rank === 1 ? 'bg-gold text-almost-black' :
            rank === 2 ? 'bg-taupe/60 text-ivory' :
            'bg-amber-600/80 text-ivory'
          }`}>
            {rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'}
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-almost-black/40 via-transparent to-transparent" />

        {/* Brand on image */}
        {product?.brand && (
          <p className="absolute bottom-3 left-4 font-display text-ivory text-lg italic drop-shadow-sm">
            {product.brand}
          </p>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        <Link to={`/products/${product?.id}`}>
          <h3 className="text-charcoal font-semibold text-sm leading-snug line-clamp-2 group-hover:text-emerald transition-colors">
            {product?.name || `Auction #${auction.id}`}
          </h3>
        </Link>

        {/* Winner row */}
        <div className="flex items-center gap-2.5 bg-gold/5 border border-gold/15 rounded-xl px-3 py-2.5">
          <div className="w-7 h-7 rounded-full bg-gold-gradient flex items-center justify-center flex-shrink-0">
            <svg className="w-3.5 h-3.5 text-almost-black" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
          <div>
            <p className="text-taupe text-[10px] uppercase tracking-wide font-semibold">Winner</p>
            <p className="text-charcoal text-sm font-semibold">{anonymize(auction.winnerName)}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-taupe text-[10px] uppercase tracking-wide font-semibold">Won For</p>
            <p className="text-emerald font-bold text-sm">AED {amount.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto text-xs text-taupe border-t border-taupe/10 pt-2.5">
          <div className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
            {date}
          </div>
          <Link to={`/products/${product?.id}`} className="text-gold hover:underline font-medium">
            View item →
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function WinnersPage() {
  const dispatch = useDispatch()
  const { items: auctions, loading } = useSelector(s => s.auctions)

  useEffect(() => { dispatch(fetchAuctions()) }, [dispatch])

  const winners = auctions
    .filter(a => (a.status === 'SOLD' || a.status === 'CLOSED') && a.winnerName)
    .sort((a, b) => new Date(b.endTime || 0) - new Date(a.endTime || 0))

  const totalSaved = winners.reduce((sum, a) => {
    const won  = Number(a.currentHighestBid || 0)
    const bnp  = Number(a.product?.buyNowPrice || 0)
    return sum + (bnp > won ? bnp - won : 0)
  }, 0)

  return (
    <div className="bg-ivory min-h-screen">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="bg-emerald relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #F2E7D5 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gold/30" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <p className="text-gold text-xs font-semibold tracking-[0.3em] uppercase mb-4">Hall of Fame</p>
          <h1 className="font-display text-ivory text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-4">
            Our Winners
          </h1>
          <p className="text-ivory/60 text-base max-w-lg mx-auto leading-relaxed">
            Real bidders. Real savings. Every name here walked away with an authenticated luxury piece at an unbeatable price.
          </p>

          {/* Stats */}
          {winners.length > 0 && (
            <div className="flex flex-wrap justify-center gap-8 mt-10">
              <div className="text-center">
                <p className="font-display text-gold text-4xl font-bold">{winners.length}</p>
                <p className="text-ivory/50 text-xs uppercase tracking-widest mt-1">Auctions Won</p>
              </div>
              {totalSaved > 0 && (
                <div className="w-px h-10 bg-white/10 self-center" />
              )}
              {totalSaved > 0 && (
                <div className="text-center">
                  <p className="font-display text-gold text-4xl font-bold">AED {totalSaved.toLocaleString()}</p>
                  <p className="text-ivory/50 text-xs uppercase tracking-widest mt-1">Total Saved</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── WINNERS GRID ─────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {loading ? (
          <div className="py-20"><Loader text="Loading winners…" /></div>
        ) : winners.length === 0 ? (
          <div className="text-center py-28 space-y-4">
            <div className="w-20 h-20 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto">
              <svg className="w-10 h-10 text-gold/40" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <p className="font-display text-charcoal text-2xl font-semibold">No winners yet</p>
            <p className="text-taupe text-sm">Be the first to win a luxury auction.</p>
            <Link to="/auctions" className="inline-block mt-3 bg-emerald text-ivory text-sm font-bold px-6 py-2.5 rounded hover:bg-emerald/90 transition-colors uppercase tracking-wide">
              Browse Auctions
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-charcoal text-2xl font-semibold">
                {winners.length} Auction{winners.length !== 1 ? 's' : ''} Won
              </h2>
              <Link to="/auctions" className="text-gold text-sm hover:underline font-medium">
                Join an auction →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {winners.map((a, i) => (
                <div key={a.id} className="animate-card-enter" style={{ animationDelay: `${(i % 8) * 0.05}s` }}>
                  <WinnerCard auction={a} rank={i + 1} />
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="bg-white border-t border-taupe/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <p className="text-gold text-xs font-semibold tracking-[0.3em] uppercase mb-3">Your Name Could Be Here</p>
          <h2 className="font-display text-charcoal text-2xl sm:text-4xl font-semibold mb-4">Ready to Become a Winner?</h2>
          <p className="text-taupe text-sm max-w-md mx-auto leading-relaxed mb-8">
            Buy a ticket, join the live auction, and walk away with an authenticated luxury piece at a fraction of its value.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/register" className="btn-shimmer bg-gold-gradient text-almost-black font-bold px-8 py-3 rounded text-sm hover:opacity-90 transition-opacity uppercase tracking-wide">
              Create Account
            </Link>
            <Link to="/how-it-works" className="border border-taupe/40 text-charcoal px-8 py-3 rounded text-sm font-medium hover:border-emerald hover:text-emerald transition-colors uppercase tracking-wide">
              How It Works
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
