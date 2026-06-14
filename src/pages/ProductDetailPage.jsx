import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProductById, clearSelected } from '../features/products/productsSlice'
import {
  fetchBids, fetchAuctionById, placeBid, purchaseTicket,
  clearSelected as clearAuction, checkMyTicket,
} from '../features/auctions/auctionsSlice'
import { fetchWallet } from '../features/wallet/walletSlice'
import useWebSocket from '../hooks/useWebSocket'
import Loader from '../components/common/Loader'

// ── Constants ────────────────────────────────────────────────────────
const GRADE_LABEL = { LIKE_NEW: 'Like New', EXCELLENT: 'Excellent', VERY_GOOD: 'Very Good', GOOD: 'Good', FAIR: 'Fair' }
const AUTH_COLOR  = {
  AUTHENTICATED: 'text-emerald border-emerald/30 bg-emerald/10',
  PENDING:       'text-gold border-gold/30 bg-gold/10',
  NOT_REQUIRED:  'text-taupe border-taupe/30 bg-taupe/10',
}

// ── Icons ────────────────────────────────────────────────────────────
function IconCalendar({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  )
}
function IconGavel({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M8.25 21V9m0 0L4.5 5.25M8.25 9l3.75-3.75m3.75 15V9m0 0l3.75-3.75M15.75 9l-3.75-3.75M12 5.25L9.75 3 8.25 4.5 10.5 6.75M12 5.25l2.25-2.25 1.5 1.5L13.5 6.75" />
    </svg>
  )
}
function IconBag({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
    </svg>
  )
}
function IconTicket({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a3 3 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
    </svg>
  )
}
function IconShield({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  )
}
function IconZoom({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
    </svg>
  )
}

// ── Countdown hook — returns {dd, hh, mm, ss} ────────────────────────
function useCountdown(targetDate) {
  const calc = () => {
    const diff = targetDate ? new Date(targetDate) - new Date() : 0
    if (diff <= 0) return { dd: 0, hh: 0, mm: 0, ss: 0 }
    return {
      dd: Math.floor(diff / 86400000),
      hh: Math.floor((diff % 86400000) / 3600000),
      mm: Math.floor((diff % 3600000) / 60000),
      ss: Math.floor((diff % 60000) / 1000),
    }
  }
  const [time, setTime] = useState(calc)
  useEffect(() => {
    if (!targetDate) return
    setTime(calc())
    const id = setInterval(() => setTime(calc()), 1000)
    return () => clearInterval(id)
  }, [targetDate])
  return time
}

// ── Gold divider ─────────────────────────────────────────────────────
function GoldDivider() {
  return (
    <div className="flex items-center gap-3 my-4">
      <div className="flex-1 h-px bg-gold/25" />
      <span className="text-gold text-xs leading-none">◆</span>
      <div className="flex-1 h-px bg-gold/25" />
    </div>
  )
}

// ── Ticket Payment Modal ─────────────────────────────────────────────
function TicketPaymentModal({ auction, product, walletBal, onClose, onWallet, onCard }) {
  const ticketPrice  = Number(auction.ticketPrice)
  const canPayWallet = walletBal >= ticketPrice

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-almost-black/80 backdrop-blur-sm">
      <div className="bg-white border border-taupe/15 rounded-xl w-full max-w-sm p-6 space-y-5 shadow-luxury">

        <div className="flex items-center justify-between">
          <h3 className="font-display text-charcoal text-xl font-semibold">Purchase Ticket</h3>
          <button onClick={onClose} className="text-taupe hover:text-charcoal text-2xl leading-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-taupe/10 transition-colors">×</button>
        </div>

        <div className="bg-emerald rounded-xl p-4 text-center space-y-1">
          <p className="text-gold/80 text-xs font-semibold uppercase tracking-widest">Auction Entry Fee</p>
          <p className="text-ivory font-bold text-3xl font-display">AED {ticketPrice.toLocaleString()}</p>
          <p className="text-ivory/60 text-xs">{product.brand} — {product.name}</p>
        </div>

        <p className="text-taupe text-xs font-semibold uppercase tracking-wide">Choose payment method</p>

        <div className="space-y-3">
          <button
            onClick={onWallet}
            disabled={!canPayWallet}
            className="w-full flex items-center justify-between bg-taupe/5 border border-taupe/15 hover:border-gold/40 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl px-4 py-4 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gold/10 rounded-xl flex items-center justify-center text-gold text-base">◈</div>
              <div className="text-left">
                <p className="text-charcoal text-sm font-medium group-hover:text-gold transition-colors">Pay from Wallet</p>
                <p className={`text-xs mt-0.5 ${canPayWallet ? 'text-emerald' : 'text-burgundy'}`}>
                  Balance: AED {walletBal.toLocaleString()} — {canPayWallet ? 'sufficient' : 'insufficient'}
                </p>
              </div>
            </div>
            <span className="text-taupe/50 text-sm">›</span>
          </button>

          <button
            onClick={onCard}
            className="w-full flex items-center justify-between bg-taupe/5 border border-taupe/15 hover:border-gold/40 rounded-xl px-4 py-4 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gold/10 rounded-xl flex items-center justify-center text-gold text-base">▭</div>
              <div className="text-left">
                <p className="text-charcoal text-sm font-medium group-hover:text-gold transition-colors">Pay by Card</p>
                <p className="text-taupe text-xs mt-0.5">Visa, Mastercard, Amex</p>
              </div>
            </div>
            <span className="text-taupe/50 text-sm">›</span>
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Image Zoom Lightbox ──────────────────────────────────────────────
function ImageZoom({ imageUrl, alt, onClose }) {
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 bg-almost-black/95 flex items-center justify-center p-4" onClick={onClose}>
      <button onClick={onClose} className="absolute top-4 right-4 text-taupe hover:text-ivory text-3xl font-light leading-none z-10">×</button>
      <img src={imageUrl} alt={alt} onClick={e => e.stopPropagation()} className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl" />
    </div>
  )
}

// ── Right Column Auction + Buy Now Panel ─────────────────────────────
function AuctionBuyNowPanel({ auction, bids, product }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { user }   = useSelector(s => s.auth)
  const { wallet } = useSelector(s => s.wallet)
  const { loading, userHasTicket } = useSelector(s => s.auctions)

  const [bidAmount, setBidAmount]       = useState('')
  const [msg, setMsg]                   = useState(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  // Auto-open ticket modal when navigated from "Buy a Ticket" on a card
  useEffect(() => {
    if (location.state?.autoTicket) {
      if (!user) { navigate('/login'); return }
      setShowPaymentModal(true)
      // Clear the state so a page refresh doesn't re-trigger it
      window.history.replaceState({}, '')
    }
  }, [location.state?.autoTicket, user])

  const isActive  = auction.status === 'ACTIVE'
  const isPending = auction.status === 'PENDING'
  const isSold    = auction.status === 'SOLD'
  const isClosed  = auction.status === 'CLOSED'
  const isEnded   = isSold || isClosed
  const isWinner  = user && auction.winnerId === user.id
  const walletBal = wallet ? Number(wallet.balance) : 0

  const countdown = useCountdown(
    isActive  ? auction.scheduledEndTime :
    isPending ? auction.scheduledStartTime : null
  )
  const pad = n => String(n).padStart(2, '0')
  const countdownLabel = isActive ? 'Auction Ends In' : 'Auction Starts In'

  useWebSocket(auction?.id)
  useEffect(() => { if (user) dispatch(fetchWallet()) }, [user])

  const currentBid     = bids.length > 0 ? Number(bids[0].amount) : Number(auction.currentHighestBid || 0)
  const liveBidderName = bids.length > 0 ? bids[0].bidderName : auction.highestBidderName
  const reservePrice   = auction.reservePrice ? Number(auction.reservePrice) : null
  const reserveMet     = reservePrice === null || currentBid >= reservePrice
  const bidIncrement   = auction.bidIncrement ? Number(auction.bidIncrement) : null
  const minNextBid     = bidIncrement ? currentBid + bidIncrement : null
  const bidCount       = (bids.length > 0 ? bids.length : auction.bidCount) || 0
  const ticketsSold    = auction.ticketsSold  || 0
  const ticketTarget   = auction.ticketTarget || 0
  const ticketPct      = ticketTarget > 0 ? Math.min((ticketsSold / ticketTarget) * 100, 100) : 0
  const buyNowPrice    = product.buyNowPrice ? Number(product.buyNowPrice) : null
  const buyNowAvail    = !!(buyNowPrice && ticketPct < 50 && (isActive || isPending))

  const almostAtReserve = reservePrice && !reserveMet && (currentBid / reservePrice) >= 0.8
  const amountToReserve = reservePrice && !reserveMet ? reservePrice - currentBid : 0
  const quickBids = minNextBid && bidIncrement
    ? [minNextBid, minNextBid + bidIncrement, minNextBid + bidIncrement * 2]
    : null

  const doAction = async (fn, ...args) => {
    setMsg(null)
    try {
      await dispatch(fn(...args)).unwrap()
      setMsg({ type: 'success', text: 'Done!' })
    } catch (e) {
      setMsg({ type: 'error', text: typeof e === 'string' ? e : e?.message || 'Something went wrong' })
    }
  }

  const onBid = e => {
    e.preventDefault()
    if (!user) { navigate('/login'); return }
    doAction(placeBid, { auctionId: auction.id, amount: Number(bidAmount) })
    setBidAmount('')
  }

  const onTicket = () => {
    if (!user) { navigate('/login'); return }
    setShowPaymentModal(true)
  }

  const onPayByWallet = () => { setShowPaymentModal(false); doAction(purchaseTicket, auction.id) }
  const onPayByCard   = () => { setShowPaymentModal(false); navigate('/checkout', { state: { type: 'ticket', product, auction } }) }
  const onCheckout    = () => {
    if (!user) { navigate('/login'); return }
    navigate('/checkout', { state: { type: 'auction', product, auction } })
  }
  const onBuyNow = () => {
    if (!user) { navigate('/login'); return }
    navigate('/checkout', { state: { type: 'buynow', product, auction } })
  }

  // ── Status badge ────────────────────────────────────────────────
  const badgeLabel = isActive ? 'Live Auction' : isPending ? 'Upcoming Auction' : isClosed ? 'Auction Ended' : 'Sold'
  const badgeCls   = isActive || isPending ? 'bg-emerald text-ivory' : isClosed ? 'bg-taupe text-ivory' : 'bg-burgundy/70 text-ivory'

  return (
    <div className="space-y-4">

      {/* Status badge */}
      <div>
        <span className={`inline-flex items-center gap-2 pl-3 pr-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase shadow-sm ${badgeCls}`}>
          {isActive && (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ivory opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-ivory" />
            </span>
          )}
          {!isActive && <IconCalendar className="w-3.5 h-3.5 flex-shrink-0" />}
          {badgeLabel}
        </span>
      </div>

      {/* ── Pricing boxes (same as card) ── */}
      <div className="grid grid-cols-2 gap-3">

        {/* Max Bid */}
        <div className="bg-emerald rounded-xl px-5 py-4 flex flex-col items-center gap-2">
          <div className="flex items-center gap-1.5 text-gold/90 text-[10px] font-bold tracking-[0.12em] uppercase text-center leading-tight">
            <IconGavel className="w-3.5 h-3.5 flex-shrink-0" />
            Max Bid Amount
          </div>
          <p className="text-ivory text-2xl font-bold leading-none mt-0.5 font-display animate-bid-pop">
            {currentBid > 0 ? `AED ${currentBid.toLocaleString()}` : '—'}
          </p>
          {currentBid === 0 && <p className="text-ivory/40 text-xs">No bids yet</p>}
          {liveBidderName && currentBid > 0 && (
            <p className="text-ivory/50 text-[10px]">by {liveBidderName}</p>
          )}
          <span className="text-gold/50 text-[10px] leading-none">◆</span>
        </div>

        {/* Buy Now */}
        <div className={`border rounded-xl px-5 py-4 flex flex-col items-center gap-2 transition-opacity ${
          !buyNowPrice ? 'invisible' :
          !buyNowAvail ? 'border-taupe/15 opacity-40' :
          'border-gold/35'
        }`}>
          <div className="flex items-center gap-1.5 text-taupe text-[10px] font-bold tracking-[0.12em] uppercase text-center leading-tight">
            <IconBag className="w-3.5 h-3.5 flex-shrink-0" />
            Buy Now Price
          </div>
          <p className={`text-2xl font-bold leading-none mt-0.5 font-display ${buyNowAvail ? 'text-gold' : 'text-taupe'}`}>
            {buyNowPrice ? `AED ${buyNowPrice.toLocaleString()}` : '—'}
          </p>
          <span className="text-gold/40 text-[10px] leading-none">◆</span>
        </div>

      </div>

      {/* ── Stats row (same as card) ── */}
      {(isActive || isPending) && (
        <div className="border border-taupe/15 rounded-xl overflow-hidden">
          <div className="grid grid-cols-3 divide-x divide-taupe/15">

            {/* Ticket price */}
            <div className="px-4 py-3.5 flex flex-col items-center gap-1.5">
              <IconTicket className="w-4 h-4 text-gold/70" />
              <p className="text-taupe text-[9px] font-semibold tracking-wider uppercase text-center leading-tight">Auction Ticket Price</p>
              <div className="text-center">
                <span className="text-gold font-bold text-sm leading-none">AED {Number(auction.ticketPrice || 0).toLocaleString()}</span>
                <span className="text-taupe text-[10px] block leading-none mt-0.5">per ticket</span>
              </div>
            </div>

            {/* Tickets sold */}
            <div className="px-4 py-3.5 flex flex-col items-center gap-1.5">
              <p className="text-taupe text-[9px] font-semibold tracking-wider uppercase">Tickets Sold</p>
              <p className="text-charcoal font-bold text-sm leading-none">{ticketsSold.toLocaleString()} / {ticketTarget.toLocaleString()}</p>
              <div className="w-full h-1 bg-taupe/20 rounded-full overflow-hidden">
                <div className="h-full bg-gold rounded-full transition-all duration-700" style={{ width: `${ticketPct}%` }} />
              </div>
              <p className="text-gold text-[10px] font-semibold leading-none">{ticketPct.toFixed(1)}% sold</p>
            </div>

            {/* Countdown */}
            <div className="px-4 py-3.5 flex flex-col items-center gap-1.5">
              <p className="text-taupe text-[9px] font-semibold tracking-wider uppercase text-center leading-tight">{countdownLabel}</p>
              <div className="flex items-center gap-0.5">
                {[[pad(countdown.dd),'DD'],[pad(countdown.hh),'HH'],[pad(countdown.mm),'MM'],[pad(countdown.ss),'SS']].map(([val, unit], i) => (
                  <div key={unit} className="flex items-center">
                    {i > 0 && <span className="text-gold text-xs mx-0.5">:</span>}
                    <div className="flex flex-col items-center">
                      <span className="text-charcoal font-bold text-sm leading-none">{val}</span>
                      <span className="text-taupe text-[8px] leading-none mt-0.5">{unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ── Bid details (active only) ── */}
      {isActive && (
        <div className="bg-white border border-taupe/15 rounded-xl p-5 space-y-4">

          {/* Bid count + reserve */}
          <div className="flex items-center gap-3">
            {bidCount > 0 && (
              <span className="text-taupe text-xs bg-taupe/10 rounded-full px-3 py-1">
                {bidCount} bid{bidCount !== 1 ? 's' : ''}
              </span>
            )}
            {reservePrice && (
              <span className={`text-xs rounded-full px-3 py-1 font-medium ${reserveMet ? 'bg-emerald/10 text-emerald' : 'bg-taupe/10 text-taupe'}`}>
                Reserve {reserveMet ? 'Met' : 'Not Met'}
              </span>
            )}
            {minNextBid && (
              <span className="text-taupe text-xs ml-auto">
                Min next bid: <span className="text-charcoal font-semibold">AED {minNextBid.toLocaleString()}</span>
              </span>
            )}
          </div>

          {/* Reserve nudge */}
          {almostAtReserve && (
            <div className="bg-gold/10 border border-gold/25 rounded-lg px-4 py-3">
              <p className="text-gold text-sm font-semibold mb-0.5">Almost at reserve</p>
              <p className="text-charcoal text-xs">Bid AED {(currentBid + amountToReserve).toLocaleString()} to reach the reserve.</p>
            </div>
          )}

          {/* Not signed in */}
          {!user && (
            <p className="text-center text-taupe text-sm">
              <button onClick={() => navigate('/login')} className="text-gold hover:underline font-medium">Sign in</button> to participate
            </p>
          )}

          {/* Has ticket — bid form */}
          {user && userHasTicket && (
            <div className="space-y-3">
              <p className="text-emerald text-xs font-semibold flex items-center gap-1.5">
                <IconTicket className="w-3.5 h-3.5" />
                You have a ticket — place your bid
              </p>

              {quickBids && (
                <div className="grid grid-cols-3 gap-2">
                  {quickBids.map(amount => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => setBidAmount(String(amount))}
                      disabled={loading}
                      className={`py-2.5 rounded-lg text-xs font-semibold border transition-all disabled:opacity-50 ${
                        Number(bidAmount) === amount
                          ? 'bg-gold text-almost-black border-gold'
                          : 'bg-taupe/10 border-taupe/15 text-charcoal hover:border-gold/50 hover:bg-gold/10'
                      }`}
                    >
                      AED {amount.toLocaleString()}
                    </button>
                  ))}
                </div>
              )}

              <form onSubmit={onBid} className="flex gap-2">
                <input
                  type="number"
                  value={bidAmount}
                  onChange={e => setBidAmount(e.target.value)}
                  placeholder={minNextBid ? `Min AED ${minNextBid.toLocaleString()}` : 'Custom amount (AED)'}
                  min={minNextBid || (currentBid + 1)}
                  required
                  className="flex-1 bg-white border border-taupe/25 text-charcoal placeholder-taupe/40 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-emerald text-ivory font-bold px-6 py-3 rounded-xl hover:bg-emerald/90 disabled:opacity-50 transition-colors"
                >
                  {loading ? '…' : 'Bid'}
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* ── Messages ── */}
      {msg && (
        <div className={`text-sm rounded-lg px-4 py-3 ${msg.type === 'success' ? 'bg-emerald/10 text-emerald border border-emerald/20' : 'bg-burgundy/10 text-burgundy border border-burgundy/20'}`}>
          {msg.text}
        </div>
      )}

      {/* ── Winner checkout ── */}
      {isEnded && isWinner && (
        <div className="bg-emerald/10 border border-emerald/25 rounded-xl p-5 space-y-3">
          <p className="text-emerald font-semibold text-lg font-display">You won this auction!</p>
          <p className="text-taupe text-sm">Winning bid: <span className="text-charcoal font-semibold">AED {currentBid.toLocaleString()}</span></p>
          {walletBal > 0 && (
            <p className="text-taupe text-xs">AED {walletBal.toLocaleString()} wallet credit available at checkout.</p>
          )}
          <button onClick={onCheckout} className="w-full bg-emerald text-ivory font-bold py-3.5 rounded-xl hover:bg-emerald/90 transition-colors btn-shimmer">
            Proceed to Checkout
          </button>
        </div>
      )}

      {/* ── Ended — not winner ── */}
      {isEnded && !isWinner && (
        <div className="bg-taupe/5 border border-taupe/15 rounded-xl px-5 py-4">
          <p className="text-taupe text-sm">
            {isSold ? 'This auction has ended.' : 'This auction closed without a winner.'}
          </p>
        </div>
      )}

      {/* ── CTA Buttons (same layout as card) ── */}
      {(isActive || isPending) && !product.sold && (
        <div className="flex items-center gap-2">

          {/* Buy a Ticket */}
          {user && !userHasTicket ? (
            <button
              onClick={onTicket}
              disabled={loading}
              className="flex-1 bg-emerald text-ivory rounded-xl py-3.5 px-4 flex flex-col items-center btn-shimmer hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              <div className="flex items-center gap-2">
                <IconTicket className="w-4 h-4 flex-shrink-0" />
                <span className="font-bold text-sm tracking-wider uppercase">
                  {loading ? 'Processing…' : 'Buy a Ticket'}
                </span>
              </div>
              <span className="text-ivory/60 text-xs mt-0.5">
                AED {Number(auction.ticketPrice || 0).toLocaleString()} entry
              </span>
            </button>
          ) : user && userHasTicket ? (
            <div className="flex-1 bg-emerald/20 border border-emerald/30 text-emerald rounded-xl py-3.5 px-4 flex flex-col items-center">
              <div className="flex items-center gap-2">
                <IconTicket className="w-4 h-4 flex-shrink-0" />
                <span className="font-bold text-sm tracking-wider uppercase">Ticket Purchased</span>
              </div>
              <span className="text-emerald/60 text-xs mt-0.5">You're in the auction</span>
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="flex-1 bg-emerald text-ivory rounded-xl py-3.5 px-4 flex flex-col items-center btn-shimmer hover:opacity-90 transition-opacity"
            >
              <div className="flex items-center gap-2">
                <IconTicket className="w-4 h-4 flex-shrink-0" />
                <span className="font-bold text-sm tracking-wider uppercase">Buy a Ticket</span>
              </div>
              <span className="text-ivory/60 text-xs mt-0.5">Sign in to join</span>
            </button>
          )}

          {/* OR */}
          <div className="w-9 h-9 rounded-full border border-taupe/25 bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
            <span className="text-taupe text-[9px] font-semibold">OR</span>
          </div>

          {/* Buy Now */}
          {buyNowAvail ? (
            <button
              onClick={onBuyNow}
              className="flex-1 bg-gold-gradient text-charcoal rounded-xl py-3.5 px-4 flex flex-col items-center btn-shimmer hover:opacity-90 transition-opacity"
            >
              <div className="flex items-center gap-2">
                <IconBag className="w-4 h-4 flex-shrink-0" />
                <span className="font-bold text-sm tracking-wider uppercase">Buy Now</span>
              </div>
              <span className="text-charcoal/55 text-xs mt-0.5">Get it instantly</span>
            </button>
          ) : (
            <div className="flex-1 bg-taupe/10 rounded-xl py-3.5 px-4 flex flex-col items-center opacity-40 cursor-not-allowed">
              <div className="flex items-center gap-2">
                <IconBag className="w-4 h-4 flex-shrink-0 text-taupe" />
                <span className="font-bold text-sm tracking-wider uppercase text-taupe">Buy Now</span>
              </div>
              <span className="text-taupe/60 text-xs mt-0.5">Unavailable</span>
            </div>
          )}

        </div>
      )}

      {/* ── Trust footer ── */}
      <div className="flex items-center justify-center gap-1.5 text-taupe/40 text-xs pt-1">
        <IconShield className="w-3.5 h-3.5 flex-shrink-0" />
        Secure. Transparent. Trusted.
      </div>

      {/* ── Bid History ── */}
      {bids.length > 0 && (
        <div className="border border-taupe/15 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-taupe/10 bg-taupe/5">
            <p className="text-taupe text-xs font-semibold uppercase tracking-wider">Bid History</p>
          </div>
          <div className="divide-y divide-taupe/10 max-h-52 overflow-y-auto">
            {bids.slice(0, 20).map((b, i) => (
              <div key={b.id || i} className={`flex justify-between items-center px-5 py-3 ${i === 0 ? 'bg-gold/5' : ''}`}>
                <span className="text-charcoal text-sm">{b.bidderName || 'Anonymous'}</span>
                <span className={`font-semibold text-sm ${i === 0 ? 'text-gold' : 'text-taupe'}`}>
                  AED {Number(b.amount).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ticket Payment Modal — rendered via portal so fixed overlay covers full viewport */}
      {showPaymentModal && createPortal(
        <TicketPaymentModal
          auction={auction} product={product} walletBal={walletBal}
          onClose={() => setShowPaymentModal(false)}
          onWallet={onPayByWallet} onCard={onPayByCard}
        />,
        document.body
      )}
    </div>
  )
}

// ── Product Meta ─────────────────────────────────────────────────────
function ProductMeta({ product, inclusions }) {
  return (
    <div className="space-y-5">
      {product.description && (
        <div>
          <p className="text-taupe text-xs font-semibold uppercase tracking-widest mb-2">Description</p>
          <p className="text-charcoal text-sm leading-relaxed">{product.description}</p>
        </div>
      )}

      {(product.serialNumber || product.yearOfManufacture || product.certificateNumber) && (
        <div className="bg-taupe/5 border border-taupe/10 rounded-xl p-4 space-y-2.5">
          {product.serialNumber && (
            <div className="flex justify-between text-sm">
              <span className="text-taupe">Serial Number</span>
              <span className="text-charcoal font-mono">{product.serialNumber}</span>
            </div>
          )}
          {product.yearOfManufacture && (
            <div className="flex justify-between text-sm">
              <span className="text-taupe">Year</span>
              <span className="text-charcoal">{product.yearOfManufacture}</span>
            </div>
          )}
          {product.certificateNumber && (
            <div className="flex justify-between text-sm">
              <span className="text-taupe">Certificate No.</span>
              <span className="text-charcoal font-mono">{product.certificateNumber}</span>
            </div>
          )}
        </div>
      )}

      {product.authenticationNote && (
        <div className="bg-emerald/8 border border-emerald/20 rounded-xl px-4 py-3">
          <p className="text-emerald text-xs font-semibold uppercase tracking-wide mb-1">Authentication</p>
          <p className="text-charcoal text-sm">{product.authenticationNote}</p>
        </div>
      )}

      {inclusions.length > 0 && (
        <div>
          <p className="text-taupe text-xs font-semibold uppercase tracking-widest mb-2">Inclusions</p>
          <div className="flex flex-wrap gap-2">
            {inclusions.map(inc => (
              <span key={inc} className="text-xs bg-gold/10 border border-gold/20 text-gold px-3 py-1 rounded-full">{inc}</span>
            ))}
          </div>
        </div>
      )}

      {product.wearNotes && (
        <div>
          <p className="text-taupe text-xs font-semibold uppercase tracking-widest mb-1">Wear Notes</p>
          <p className="text-charcoal text-sm">{product.wearNotes}</p>
        </div>
      )}

      {product.provenance && (
        <div>
          <p className="text-taupe text-xs font-semibold uppercase tracking-widest mb-1">Provenance</p>
          <p className="text-charcoal text-sm leading-relaxed">{product.provenance}</p>
        </div>
      )}
    </div>
  )
}

// ── Product Detail Page ──────────────────────────────────────────────
export default function ProductDetailPage() {
  const { id }       = useParams()
  const dispatch     = useDispatch()
  const { selected: product, loading } = useSelector(s => s.products)
  const { bids, selected: liveAuction } = useSelector(s => s.auctions)
  const { user }     = useSelector(s => s.auth)

  const [activeImg, setActiveImg] = useState(0)
  const [zoomOpen, setZoomOpen]   = useState(false)

  const auctionId = product?.auction?.id
  const auction   = (liveAuction?.id === auctionId ? liveAuction : null) ?? product?.auction ?? null

  useEffect(() => {
    if (id && id !== 'undefined') dispatch(fetchProductById(id))
    return () => { dispatch(clearSelected()); dispatch(clearAuction()) }
  }, [id])

  useEffect(() => {
    if (auctionId) {
      dispatch(fetchAuctionById(auctionId))
      dispatch(fetchBids(auctionId))
      if (user) dispatch(checkMyTicket(auctionId))
    }
  }, [auctionId, user])

  if (loading || !product) return <Loader text="Loading product…" />

  const images     = (product.imageUrls || []).map(url => ({ imageUrl: url }))
  const hasAuction = !!auction
  const inclusions = [
    product.includesBox             && 'Original Box',
    product.includesDustBag         && 'Dust Bag',
    product.includesAuthCard        && 'Auth Card',
    product.includesWarrantyCard    && 'Warranty Card',
    product.includesOriginalReceipt && 'Original Receipt',
  ].filter(Boolean)

  return (
    <div className="min-h-screen">

      {/* Image zoom lightbox */}
      {zoomOpen && images[activeImg] && (
        <ImageZoom imageUrl={images[activeImg].imageUrl} alt={product.name} onClose={() => setZoomOpen(false)} />
      )}

      {/* Breadcrumb */}
      <div className="border-b border-taupe/10 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 text-xs text-taupe">
          <a href="/" className="hover:text-gold transition-colors">Home</a>
          <span className="text-taupe/30">›</span>
          <a href="/auctions" className="hover:text-gold transition-colors">Auctions</a>
          <span className="text-taupe/30">›</span>
          <span className="text-charcoal truncate max-w-[200px]">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16">

          {/* ── Left: image gallery ── */}
          <div className="space-y-3 animate-fade-up">
            <div
              className="aspect-square bg-taupe/5 rounded-xl overflow-hidden border border-taupe/10 cursor-zoom-in relative group shadow-luxury"
              onClick={() => images[activeImg] && setZoomOpen(true)}
            >
              {images[activeImg] ? (
                <>
                  <img
                    src={images[activeImg].imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                  />
                  <div className="absolute inset-0 flex items-end justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="bg-almost-black/60 backdrop-blur-sm text-ivory text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5">
                      <IconZoom className="w-3.5 h-3.5" />
                      Zoom
                    </span>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-taupe/20 text-7xl font-display">◆</span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                      i === activeImg
                        ? 'border-gold shadow-md shadow-gold/20 scale-105'
                        : 'border-taupe/15 hover:border-taupe/40 opacity-70 hover:opacity-100'
                    }`}>
                    <img src={img.imageUrl} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Meta — desktop */}
            <div className="hidden lg:block pt-2">
              <ProductMeta product={product} inclusions={inclusions} />
            </div>
          </div>

          {/* ── Right: product info + auction panel ── */}
          <div className="space-y-6 animate-fade-up-delay-1">

            {/* Brand + title */}
            <div>
              <p className="text-gold text-xs font-bold uppercase tracking-[0.2em] mb-2">{product.brand}</p>
              <h1 className="font-display text-charcoal text-3xl sm:text-4xl font-semibold leading-tight">{product.name}</h1>
              {product.modelName && (
                <p className="text-taupe text-sm mt-1.5 italic font-display">{product.modelName}</p>
              )}

              <GoldDivider />

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                {product.authenticationStatus && (
                  <span className={`text-xs border px-3 py-1.5 rounded-full font-medium ${AUTH_COLOR[product.authenticationStatus] || 'text-taupe border-taupe/15'}`}>
                    {product.authenticationStatus === 'AUTHENTICATED' ? '✓ ' : ''}{product.authenticationStatus.replace('_', ' ')}
                  </span>
                )}
                {product.conditionGrade && (
                  <span className="text-xs bg-taupe/10 border border-taupe/15 text-taupe px-3 py-1.5 rounded-full">
                    {GRADE_LABEL[product.conditionGrade] || product.conditionGrade}
                  </span>
                )}
                {product.sourceCountry && (
                  <span className="text-xs bg-taupe/10 border border-taupe/15 text-taupe px-3 py-1.5 rounded-full">
                    From {product.sourceCountry}
                  </span>
                )}
                {product.sold && (
                  <span className="text-xs bg-burgundy/10 text-burgundy border border-burgundy/20 px-3 py-1.5 rounded-full font-medium">Sold</span>
                )}
              </div>
            </div>

            {/* Auction + Buy Now panel */}
            {hasAuction && !product.sold && (
              <AuctionBuyNowPanel auction={auction} bids={bids} product={product} />
            )}

            {/* Buy Now only (no auction) */}
            {!hasAuction && product.buyNowPrice && !product.sold && (
              <BuyNowOnlyPanel product={product} />
            )}

            {/* Mobile meta */}
            <div className="lg:hidden pt-2">
              <ProductMeta product={product} inclusions={inclusions} />
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

// ── Buy Now Only (no auction) ────────────────────────────────────────
function BuyNowOnlyPanel({ product }) {
  const navigate = useNavigate()
  const { user } = useSelector(s => s.auth)

  const onBuyNow = () => {
    if (!user) { navigate('/login'); return }
    navigate('/checkout', { state: { type: 'buynow', product } })
  }

  return (
    <div className="space-y-4">
      <div className="border border-gold/35 rounded-xl px-5 py-5 flex flex-col items-center gap-2">
        <div className="flex items-center gap-1.5 text-taupe text-[10px] font-bold tracking-[0.12em] uppercase">
          <IconBag className="w-3.5 h-3.5" />
          Buy Now Price
        </div>
        <p className="text-gold text-3xl font-bold font-display">AED {Number(product.buyNowPrice).toLocaleString()}</p>
        <span className="text-gold/40 text-[10px]">◆</span>
      </div>

      <button
        onClick={onBuyNow}
        className="w-full bg-gold-gradient text-charcoal font-bold py-4 rounded-xl btn-shimmer hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
      >
        <IconBag className="w-4 h-4" />
        Buy Now — AED {Number(product.buyNowPrice).toLocaleString()}
      </button>

      <div className="flex items-center justify-center gap-1.5 text-taupe/40 text-xs">
        <IconShield className="w-3.5 h-3.5 flex-shrink-0" />
        Secure. Transparent. Trusted.
      </div>
    </div>
  )
}
