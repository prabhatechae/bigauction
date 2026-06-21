import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { updateProfile, clearError, logout } from '../features/auth/authSlice'
import { fetchWallet } from '../features/wallet/walletSlice'
import api from '../services/api'

// ── SVG Icons ─────────────────────────────────────────────────────────────────

const IconGavel = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l5.654-4.654m5.14-8.498a2.25 2.25 0 0 0-3.182 0L6.375 8.04a2.25 2.25 0 0 0 0 3.182l.95.949m5.659-5.66 4.242 4.242" />
  </svg>
)

const IconClipboard = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m-6 9 2 2 4-4" />
  </svg>
)

const IconHeart = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
  </svg>
)

const IconDocument = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
  </svg>
)

const IconArrowRight = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
  </svg>
)

const IconChevronRight = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
  </svg>
)

const IconPlus = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
)

const IconBag = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
  </svg>
)

const IconWallet = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3" />
  </svg>
)

const IconShield = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
  </svg>
)

// ── Tiny label above field ─────────────────────────────────────────────────────

const FieldLabel = ({ children }) => (
  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] leading-none mb-1.5"
     style={{ color: 'rgba(242,231,213,0.45)' }}>
    {children}
  </p>
)

// ── Constants ──────────────────────────────────────────────────────────────────

const AUCTION_TABS    = ['Coming Soon Auction', 'Live Auction', 'Auction Completed']
const REQUEST_TABS    = ['Delivery', 'Refunds', 'Support', 'Invoices', 'Future Item Wishlist']

const AUCTION_STATUS_MAP = {
  'Coming Soon Auction': ['PENDING', 'SCHEDULED', 'COMING_SOON'],
  'Live Auction':        ['ACTIVE', 'LIVE'],
  'Auction Completed':   ['SOLD', 'COMPLETED', 'ENDED', 'CLOSED'],
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const { user, loading, error } = useSelector(s => s.auth)
  const { wallet }               = useSelector(s => s.wallet)

  const [editMode,   setEditMode]   = useState(false)
  const [form,       setForm]       = useState({ name: '', email: '', phone: '' })
  const [saveOk,     setSaveOk]     = useState(false)
  const [tickets,    setTickets]    = useState([])
  const [tLoading,   setTLoading]   = useState(false)
  const [auctionTab, setAuctionTab] = useState('Coming Soon Auction')
  const [requestTab, setRequestTab] = useState('Future Item Wishlist')
  const [wishlist,   setWishlist]   = useState([])

  useEffect(() => {
    if (user) setForm({ name: user.name || '', email: user.email || '', phone: user.phone || '' })
    return () => dispatch(clearError())
  }, [user])

  useEffect(() => {
    dispatch(fetchWallet())
    setTLoading(true)
    api.get('/users/me/tickets')
       .then(r => setTickets(Array.isArray(r?.data) ? r.data : []))
       .catch(() => {})
       .finally(() => setTLoading(false))
  }, [])

  const onChange = e => {
    setSaveOk(false)
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const onSubmit = async e => {
    e.preventDefault()
    setSaveOk(false)
    try {
      await dispatch(updateProfile(form)).unwrap()
      setSaveOk(true)
      setEditMode(false)
    } catch {}
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const balance       = wallet ? Number(wallet.balance       || 0) : 0
  const rewardCredits = wallet ? Number(wallet.rewardCredits || 0) : 0
  const initials      = (user?.name || 'U').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const firstName     = user?.name?.split(' ')[0] || 'Member'

  const filteredTickets = tickets.filter(t =>
    (AUCTION_STATUS_MAP[auctionTab] || []).includes(t.auctionStatus)
  )

  const inputCls = 'w-full rounded-lg px-3.5 py-2.5 text-sm text-ivory placeholder-ivory/30 focus:outline-none transition-colors'

  return (
    <div className="bg-ivory min-h-screen py-5 sm:py-8 lg:py-10">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 space-y-4 sm:space-y-5 lg:space-y-6">

        {/* ══════════════════════════════════════════════════════════════
            HERO CARD — deep emerald, always rounded
        ══════════════════════════════════════════════════════════════ */}
        <div className="relative rounded-2xl overflow-hidden" style={{ backgroundColor: '#064C3B' }}>

          {/* Dot pattern */}
          <div className="absolute inset-0 pointer-events-none"
               style={{
                 backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.065) 1px, transparent 1px)',
                 backgroundSize: '22px 22px',
               }} />

          {/* ── Profile section ── */}
          <div className="relative px-4 pt-5 pb-4 sm:px-8 sm:pt-8 sm:pb-6 lg:px-10 lg:pt-10 lg:pb-8 xl:px-14 flex gap-3 sm:gap-6 lg:gap-10 items-start">

            {/* Avatar — smaller on mobile so text has room */}
            <div className="flex-shrink-0 mt-0.5">
              <div className="w-[72px] h-[72px] sm:w-[116px] sm:h-[116px] lg:w-[148px] lg:h-[148px] xl:w-[160px] xl:h-[160px] rounded-full flex items-center justify-center shadow-xl"
                   style={{ background: 'linear-gradient(135deg, #D4B87A 0%, #C6A972 50%, #B8955A 100%)' }}>
                <span className="font-display text-almost-black font-bold select-none leading-none"
                      style={{ fontSize: 'clamp(18px, 4vw, 46px)' }}>
                  {initials}
                </span>
              </div>
            </div>

            {/* Text block */}
            <div className="flex-1 min-w-0 pt-0.5">

              {/* Name */}
              <FieldLabel>Name</FieldLabel>
              <h1 className="font-display text-ivory font-semibold leading-tight mb-2.5 sm:mb-3 lg:mb-4 pr-14 sm:pr-28 lg:pr-36"
                  style={{ fontSize: 'clamp(1.25rem, 3.5vw, 2.6rem)' }}>
                {user?.name || 'Member'}
              </h1>

              {/* Nickname + Account Status */}
              <div className="grid grid-cols-2 gap-x-3 sm:gap-x-10 lg:gap-x-20 mb-2.5 sm:mb-3 lg:mb-4">
                <div>
                  <FieldLabel>Nickname</FieldLabel>
                  <p className="text-ivory text-[12px] sm:text-[14px] lg:text-[15px] font-semibold">{firstName}</p>
                </div>
                <div>
                  <FieldLabel>Account Status</FieldLabel>
                  <span className="inline-flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-[11px] lg:text-[12px] font-semibold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full leading-none"
                        style={{
                          background: 'rgba(34,197,94,0.15)',
                          border: '1px solid rgba(74,222,128,0.28)',
                          color: '#86efac',
                        }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                    Active
                  </span>
                </div>
              </div>

              {/* Email */}
              <div className="mb-2 sm:mb-3 lg:mb-3.5">
                <FieldLabel>Email Address</FieldLabel>
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  <p className="text-ivory text-[12px] sm:text-[14px] lg:text-[15px]">{user?.email || '—'}</p>
                  <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-medium px-2 sm:px-2.5 py-0.5 rounded-full leading-none flex-shrink-0"
                        style={{ border: '1px solid rgba(255,255,255,0.28)', color: 'rgba(242,231,213,0.7)' }}>
                    <span className="hidden sm:inline-flex"><IconShield /></span>
                    Verified
                  </span>
                </div>
              </div>

              {/* Mobile number */}
              <div>
                <FieldLabel>Mobile Number</FieldLabel>
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  <p className="text-ivory text-[12px] sm:text-[14px] lg:text-[15px]">{user?.phone || '+971 XX XXX XXXX'}</p>
                  {user?.phone && (
                    <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-medium px-2 sm:px-2.5 py-0.5 rounded-full leading-none flex-shrink-0"
                          style={{ border: '1px solid rgba(255,255,255,0.28)', color: 'rgba(242,231,213,0.7)' }}>
                      <span className="hidden sm:inline-flex"><IconShield /></span>
                      Verified
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Edit button */}
            <button
              onClick={() => setEditMode(v => !v)}
              className="absolute top-4 right-4 sm:top-7 sm:right-7 lg:top-9 lg:right-9 xl:top-10 xl:right-12 text-[11px] sm:text-[13px] lg:text-[14px] text-ivory font-medium px-3 sm:px-4 lg:px-5 py-1 sm:py-1.5 lg:py-2 rounded-lg transition-colors hover:bg-white/10 leading-none"
              style={{ border: '1px solid rgba(255,255,255,0.4)' }}>
              {editMode ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {/* ── Inline edit form ── */}
          {editMode && (
            <div className="relative mx-5 sm:mx-8 lg:mx-10 xl:mx-14 mb-5 lg:mb-7 rounded-xl p-5 lg:p-6"
                 style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.12)' }}>
              <form onSubmit={onSubmit} className="space-y-3.5">
                {error  && <p className="text-red-300   text-sm bg-red-900/30   rounded-lg px-3 py-2">{error}</p>}
                {saveOk && <p className="text-green-300 text-sm bg-green-900/20 rounded-lg px-3 py-2">Profile updated.</p>}
                <div className="grid sm:grid-cols-3 gap-3">
                  {[
                    { name: 'name',  label: 'Full Name',     type: 'text'  },
                    { name: 'email', label: 'Email Address',  type: 'email' },
                    { name: 'phone', label: 'Mobile Number',  type: 'tel'   },
                  ].map(f => (
                    <div key={f.name}>
                      <label className="block text-[10px] uppercase tracking-widest mb-1.5"
                             style={{ color: 'rgba(242,231,213,0.45)' }}>
                        {f.label}
                      </label>
                      <input type={f.type} name={f.name} value={form[f.name]} onChange={onChange}
                             className={inputCls}
                             style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)' }} />
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 pt-0.5">
                  <button type="submit" disabled={loading}
                    className="btn-shimmer text-almost-black text-sm font-bold px-5 py-2.5 rounded-lg disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg, #D4B87A 0%, #C6A972 50%, #B8955A 100%)' }}>
                    {loading ? 'Saving…' : 'Save Changes'}
                  </button>
                  <button type="button" onClick={() => setEditMode(false)}
                    className="text-ivory/60 hover:text-ivory text-sm px-4 py-2.5 rounded-lg transition-colors"
                    style={{ border: '1px solid rgba(255,255,255,0.15)' }}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ── Wallet inner card ── */}
          <div className="relative mx-3 sm:mx-8 lg:mx-10 xl:mx-14 mb-4 sm:mb-7 lg:mb-9 rounded-xl overflow-hidden"
               style={{
                 border: '1px solid rgba(255,255,255,0.16)',
                 background: 'rgba(0,0,0,0.14)',
               }}>
            <div className="grid grid-cols-2">

              {/* Wallet Balance */}
              <div className="px-3.5 py-4 sm:px-7 sm:py-6 lg:px-10 lg:py-7 xl:px-12 xl:py-8">
                {/* Label: icon hidden on mobile to save space */}
                <div className="flex items-center gap-1.5 mb-2 sm:mb-3 lg:mb-4">
                  <span className="hidden sm:inline-flex" style={{ color: 'rgba(242,231,213,0.4)' }}><IconWallet /></span>
                  <p className="text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.14em] sm:tracking-[0.18em]"
                     style={{ color: 'rgba(242,231,213,0.4)' }}>
                    Wallet Balance
                  </p>
                </div>
                {/* AED — fluid: small on mobile, large on desktop */}
                <p className="font-display text-ivory font-semibold leading-none"
                   style={{ fontSize: 'clamp(1.15rem, 6vw, 3.4rem)' }}>
                  AED {balance.toLocaleString('en-AE', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-[10px] sm:text-[11px] lg:text-[12px] mt-1.5 sm:mt-2 lg:mt-3"
                   style={{ color: 'rgba(242,231,213,0.38)' }}>
                  Available balance
                </p>
              </div>

              {/* Reward Credits */}
              <div className="px-3.5 py-4 sm:px-7 sm:py-6 lg:px-10 lg:py-7 xl:px-12 xl:py-8"
                   style={{ borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="flex items-center gap-1.5 mb-2 sm:mb-3 lg:mb-4">
                  <span className="hidden sm:inline-flex" style={{ color: 'rgba(198,169,114,0.55)' }}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" />
                    </svg>
                  </span>
                  <p className="text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.14em] sm:tracking-[0.18em]"
                     style={{ color: 'rgba(198,169,114,0.55)' }}>
                    Reward Credits
                  </p>
                </div>
                <p className="font-display font-semibold leading-none"
                   style={{ fontSize: 'clamp(1.15rem, 6vw, 3.4rem)', color: '#C6A972' }}>
                  AED {rewardCredits.toLocaleString('en-AE', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-[10px] sm:text-[11px] lg:text-[12px] mt-1.5 sm:mt-2 lg:mt-3"
                   style={{ color: 'rgba(242,231,213,0.38)' }}>
                  <span className="hidden sm:inline">For future </span>auction tickets only
                </p>
              </div>

            </div>
          </div>

        </div>
        {/* END HERO */}

        {/* ══════════════════════════════════════════════════════════════
            QUICK NAV — 2×2 on mobile/tablet, 4-col on laptop+
        ══════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
          {[
            { icon: <IconGavel />,    label: 'My Auctions',  sub: 'Ticketed auctions',            href: '#my-auctions' },
            { icon: <IconClipboard />,label: 'My Requests',  sub: 'Delivery, refunds & wishlist',  href: '#my-requests' },
            { icon: <IconBag />,      label: 'My Orders',    sub: 'Buy Now purchases',             to: '/orders'        },
            { icon: <IconHeart />,    label: 'Favourites',   sub: 'Saved auctions',                to: '/favourites'   },
            { icon: <IconDocument />, label: 'Statements',   sub: 'Wallet & credits',              to: '/wallet'       },
          ].map(({ icon, label, sub, to, href }) => {
            const inner = (
              <div className="bg-white rounded-xl px-3 py-3.5 sm:px-5 sm:py-4 lg:px-5 lg:py-5 xl:px-6 xl:py-6 flex items-center gap-2.5 sm:gap-4 lg:gap-5 hover:shadow-luxury transition-all group h-full cursor-pointer"
                   style={{ border: '1px solid rgba(138,129,118,0.16)' }}>
                {/* Icon square */}
                <div className="w-9 h-9 sm:w-11 sm:h-11 lg:w-12 lg:h-12 xl:w-14 xl:h-14 rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center flex-shrink-0 text-taupe/70 group-hover:text-taupe transition-colors"
                     style={{ background: '#F2E7D5', border: '1px solid rgba(138,129,118,0.18)' }}>
                  <span className="scale-75 sm:scale-100">{icon}</span>
                </div>
                {/* Labels */}
                <div className="flex-1 min-w-0">
                  <p className="text-charcoal text-[13px] sm:text-[15px] font-semibold leading-snug truncate">{label}</p>
                  {/* Subtitle hidden on mobile — not enough horizontal room */}
                  <p className="text-taupe text-[11px] sm:text-[12px] mt-0.5 leading-snug hidden sm:block">{sub}</p>
                </div>
                {/* Arrow */}
                <span className="text-taupe/35 flex-shrink-0 group-hover:translate-x-0.5 transition-transform">
                  <IconArrowRight />
                </span>
              </div>
            )
            if (href) return <a key={label} href={href} className="block">{inner}</a>
            return <Link key={label} to={to} className="block">{inner}</Link>
          })}
        </div>

        {/* ══════════════════════════════════════════════════════════════
            MY AUCTIONS
        ══════════════════════════════════════════════════════════════ */}
        <div id="my-auctions" className="bg-white rounded-2xl overflow-hidden"
             style={{ border: '1px solid rgba(138,129,118,0.12)' }}>

          {/* Header */}
          <div className="px-4 sm:px-7 lg:px-9 xl:px-10 pt-5 sm:pt-7 lg:pt-8 pb-3 sm:pb-4 flex items-center justify-between">
            <h2 className="font-display text-charcoal font-semibold"
                style={{ fontSize: 'clamp(1.3rem, 2.5vw, 2rem)' }}>
              My Auctions
            </h2>
            <Link to="/auctions"
                  className="flex items-center gap-1.5 text-[12px] lg:text-[13px] font-semibold hover:underline transition-opacity hover:opacity-80"
                  style={{ color: '#C6A972' }}>
              View all <IconArrowRight />
            </Link>
          </div>

          {/* Tab pills — scrollable on mobile */}
          <div className="px-4 sm:px-7 lg:px-9 xl:px-10 pb-3 sm:pb-4 flex gap-1.5 sm:gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
            {AUCTION_TABS.map(t => (
              <button key={t} onClick={() => setAuctionTab(t)}
                className="flex-shrink-0 text-[11px] sm:text-[13px] px-3 sm:px-5 py-1.5 rounded-full font-medium transition-colors whitespace-nowrap"
                style={auctionTab === t
                  ? { background: '#064C3B', color: '#F2E7D5', border: '1px solid #064C3B' }
                  : { background: 'transparent', color: '#1A1A1A', border: '1px solid rgba(138,129,118,0.3)' }}>
                {t}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div style={{ borderTop: '1px solid rgba(138,129,118,0.1)' }} />

          {/* Content */}
          <div className="px-4 sm:px-7 lg:px-9 xl:px-10 py-3 sm:py-5 lg:py-6">
            {tLoading ? (
              <div className="py-12 text-center">
                <div className="w-7 h-7 rounded-full border-2 border-taupe/20 border-t-gold animate-spin mx-auto" />
              </div>
            ) : filteredTickets.length === 0 ? (
              <div className="py-12 text-center">
                <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center"
                     style={{ background: 'rgba(198,169,114,0.1)', border: '1px solid rgba(198,169,114,0.2)' }}>
                  <IconGavel />
                </div>
                <p className="text-charcoal text-[14px] font-semibold mb-1">No auctions yet</p>
                <p className="text-taupe text-[12px] mb-4">Your ticketed auctions will appear here</p>
                <Link to="/auctions"
                      className="inline-flex items-center gap-2 text-[13px] font-semibold px-5 py-2.5 rounded-xl transition-opacity hover:opacity-80"
                      style={{ background: 'linear-gradient(135deg, #D4B87A 0%, #C6A972 50%, #B8955A 100%)', color: '#0D0D0D' }}>
                  Browse Auctions <IconArrowRight />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-4">
                {filteredTickets.map(ticket => (
                  <Link key={ticket.ticketId}
                    to={ticket.productId ? `/products/${ticket.productId}` : '#'}
                    className="flex items-center gap-4 rounded-xl p-4 transition-all group hover:shadow-luxury"
                    style={{ background: '#F9F6F1', border: '1px solid rgba(138,129,118,0.12)' }}>
                    {/* Thumbnail */}
                    {ticket.imageUrls?.[0] ? (
                      <img src={ticket.imageUrls[0]} alt={ticket.productName}
                           className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0 text-[10px] font-medium"
                           style={{ background: 'rgba(198,169,114,0.12)', color: 'rgba(138,129,118,0.6)' }}>
                        IMG
                      </div>
                    )}
                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <p className="text-charcoal text-[14px] font-semibold line-clamp-1 mb-1">
                        {ticket.productName || `Auction #${ticket.auctionId}`}
                      </p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full leading-none"
                              style={
                                ticket.auctionStatus === 'ACTIVE'
                                  ? { background: 'rgba(198,169,114,0.15)', color: '#C6A972', border: '1px solid rgba(198,169,114,0.35)' }
                                  : ticket.auctionStatus === 'PENDING'
                                  ? { background: 'rgba(6,76,59,0.1)', color: '#064C3B', border: '1px solid rgba(6,76,59,0.25)' }
                                  : { background: 'rgba(138,129,118,0.12)', color: '#8A8176', border: '1px solid rgba(138,129,118,0.25)' }
                              }>
                          {ticket.auctionStatus === 'ACTIVE'  ? 'Live'        :
                           ticket.auctionStatus === 'PENDING' ? 'Coming Soon' : 'Completed'}
                        </span>
                        <span className="text-taupe text-[12px]">
                          Ticket: {ticket.currency || 'AED'} {Number(ticket.ticketPrice || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <span className="text-taupe/30 flex-shrink-0 group-hover:text-gold group-hover:translate-x-0.5 transition-all">
                      <IconChevronRight />
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            MY REQUESTS
        ══════════════════════════════════════════════════════════════ */}
        <div id="my-requests" className="bg-white rounded-2xl overflow-hidden"
             style={{ border: '1px solid rgba(138,129,118,0.12)' }}>

          {/* Header */}
          <div className="px-4 sm:px-7 lg:px-9 xl:px-10 pt-5 sm:pt-7 lg:pt-8 pb-1 flex items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-charcoal font-semibold"
                  style={{ fontSize: 'clamp(1.3rem, 2.5vw, 2rem)' }}>
                My Requests
              </h2>
              <p className="text-taupe text-[11px] sm:text-[12px] lg:text-[13px] mt-0.5">Financial movements appear in Statements</p>
            </div>
          </div>

          {/* Tab pills — scrollable */}
          <div className="px-4 sm:px-7 lg:px-9 xl:px-10 py-3 sm:py-4 flex gap-1.5 sm:gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
            {REQUEST_TABS.map(t => (
              <button key={t} onClick={() => setRequestTab(t)}
                className="flex-shrink-0 text-[11px] sm:text-[13px] px-3 sm:px-5 py-1.5 rounded-full font-medium transition-colors whitespace-nowrap"
                style={requestTab === t
                  ? { background: '#064C3B', color: '#F2E7D5', border: '1px solid #064C3B' }
                  : { background: 'transparent', color: '#1A1A1A', border: '1px solid rgba(138,129,118,0.3)' }}>
                {t}
              </button>
            ))}
          </div>

          <div style={{ borderTop: '1px solid rgba(138,129,118,0.1)' }} />

          {/* Wishlist table */}
          {requestTab === 'Future Item Wishlist' ? (
            <div className="px-4 sm:px-7 lg:px-9 xl:px-10 py-3 sm:py-5 lg:py-6">

              {/* Column header row */}
              <div className="grid items-center pb-2.5 mb-1"
                   style={{
                     gridTemplateColumns: '1fr minmax(80px,160px) minmax(60px,110px)',
                     borderBottom: '1px solid rgba(138,129,118,0.18)',
                   }}>
                <p className="text-taupe text-[11px] font-semibold uppercase tracking-[0.1em]">Future Item</p>
                <p className="text-taupe text-[11px] font-semibold uppercase tracking-[0.1em]">Budget</p>
                <p className="text-taupe text-[11px] font-semibold uppercase tracking-[0.1em]">Status</p>
              </div>

              {wishlist.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-taupe text-[13px] mb-1">No wishlist items yet.</p>
                  <p className="text-taupe/60 text-[11px]">Add items you'd like us to source for you.</p>
                </div>
              ) : (
                wishlist.map((item, i) => (
                  <div key={i} className="grid items-center py-3.5"
                       style={{
                         gridTemplateColumns: '1fr minmax(80px,160px) minmax(60px,110px)',
                         borderBottom: '1px solid rgba(138,129,118,0.08)',
                       }}>
                    <p className="text-charcoal text-[13px] font-medium pr-3">{item.name}</p>
                    <p className="text-charcoal text-[13px]">{item.budget}</p>
                    <StatusPill status={item.status} />
                  </div>
                ))
              )}

              <button className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold transition-opacity hover:opacity-70"
                      style={{ color: '#064C3B' }}>
                <IconPlus />
                Add Future Item
              </button>
            </div>
          ) : (
            <div className="px-5 sm:px-7 lg:px-9 xl:px-10 py-10 lg:py-14 text-center">
              <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
                   style={{ background: 'rgba(138,129,118,0.08)' }}>
                <IconClipboard />
              </div>
              <p className="text-charcoal text-[14px] font-semibold mb-1">
                No {requestTab.toLowerCase()} requests
              </p>
              <p className="text-taupe text-[12px]">Your {requestTab.toLowerCase()} requests will appear here.</p>
            </div>
          )}
        </div>

        {/* ══════════════════════════════════════════════════════════════
            FAVOURITES + STATEMENTS — side by side
        ══════════════════════════════════════════════════════════════ */}
        {/* On mobile: stacked; sm+: side by side */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-5">

          {/* Favourites */}
          <div className="bg-white rounded-2xl"
               style={{ border: '1px solid rgba(138,129,118,0.12)' }}>
            <div className="px-4 sm:px-6 lg:px-8 xl:px-10 pt-5 sm:pt-7 lg:pt-8 pb-5 sm:pb-6 lg:pb-8">
              <h2 className="font-display text-charcoal font-semibold leading-tight mb-1"
                  style={{ fontSize: 'clamp(1.35rem, 2.5vw, 2.2rem)' }}>
                Favourites
              </h2>
              <p className="text-taupe text-[12px] lg:text-[13px] mb-4 sm:mb-5 lg:mb-7">
                Saved listed auctions/items
              </p>
              <Link to="/favourites"
                className="btn-shimmer inline-flex items-center text-almost-black text-[12px] sm:text-[13px] font-bold px-4 lg:px-5 py-2 sm:py-2.5 rounded-lg"
                style={{ background: 'linear-gradient(135deg, #D4B87A 0%, #C6A972 50%, #B8955A 100%)' }}>
                View Favourites
              </Link>
            </div>
          </div>

          {/* Statements */}
          <div className="bg-white rounded-2xl"
               style={{ border: '1px solid rgba(138,129,118,0.12)' }}>
            <div className="px-4 sm:px-6 lg:px-8 xl:px-10 pt-5 sm:pt-7 lg:pt-8 pb-5 sm:pb-6 lg:pb-8">
              <h2 className="font-display text-charcoal font-semibold leading-tight mb-1"
                  style={{ fontSize: 'clamp(1.35rem, 2.5vw, 2.2rem)' }}>
                Statements
              </h2>
              <p className="text-taupe text-[12px] lg:text-[13px] mb-4 sm:mb-5 lg:mb-7">
                Wallet + Reward Credits
              </p>
              <Link to="/wallet"
                className="btn-shimmer inline-flex items-center text-almost-black text-[12px] sm:text-[13px] font-bold px-4 lg:px-5 py-2 sm:py-2.5 rounded-lg"
                style={{ background: 'linear-gradient(135deg, #D4B87A 0%, #C6A972 50%, #B8955A 100%)' }}>
                View Statement
              </Link>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            BOTTOM NAVIGATION — single row, matches reference
        ══════════════════════════════════════════════════════════════ */}
        <div className="bg-white rounded-xl"
             style={{ border: '1px solid rgba(138,129,118,0.12)' }}>
          <div className="px-4 sm:px-6 lg:px-9 xl:px-10 py-3.5 lg:py-4 flex flex-wrap items-center justify-between gap-y-2 gap-x-0">
            <button
              onClick={() => { setEditMode(true); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
              className="text-[12px] sm:text-[13px] text-taupe hover:text-charcoal transition-colors px-1 py-1">
              Edit Profile
            </button>
            <Link to="/profile" className="text-[12px] sm:text-[13px] text-taupe hover:text-charcoal transition-colors px-1 py-1">
              Verification
            </Link>
            <Link to="/profile" className="text-[12px] sm:text-[13px] text-taupe hover:text-charcoal transition-colors px-1 py-1">
              Addresses
            </Link>
            <Link to="/profile" className="text-[12px] sm:text-[13px] text-taupe hover:text-charcoal transition-colors px-1 py-1">
              Notifications
            </Link>
            <Link to="/profile" className="text-[12px] sm:text-[13px] text-taupe hover:text-charcoal transition-colors px-1 py-1">
              Language
            </Link>
            <button onClick={handleLogout}
              className="text-[12px] sm:text-[13px] font-medium hover:opacity-70 transition-opacity px-1 py-1"
              style={{ color: '#6E1F28' }}>
              Logout
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

// ── Status pill for wishlist ────────────────────────────────────────────────

function StatusPill({ status }) {
  const s = (status || '').toUpperCase()
  const styles = {
    SUBMITTED: { background: 'rgba(59,130,246,0.1)',  color: '#3B82F6', border: '1px solid rgba(59,130,246,0.3)' },
    MATCHED:   { background: 'rgba(6,76,59,0.12)',    color: '#064C3B', border: '1px solid rgba(6,76,59,0.3)'   },
    LISTED:    { background: 'rgba(198,169,114,0.12)', color: '#C6A972', border: '1px solid rgba(198,169,114,0.35)' },
  }
  return (
    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap leading-none"
          style={styles[s] || { background: 'rgba(138,129,118,0.1)', color: '#8A8176', border: '1px solid rgba(138,129,118,0.25)' }}>
      {status || '—'}
    </span>
  )
}
