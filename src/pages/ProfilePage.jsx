import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { updateProfile, clearError } from '../features/auth/authSlice'
import { fetchWallet } from '../features/wallet/walletSlice'
import useFavourites from '../hooks/useFavourites'
import api from '../services/api'

const TABS = ['Profile', 'My Orders', 'My Bids', 'My Tickets']

const ORDER_STATUS_STYLE = {
  PENDING:   'bg-gold/10 text-gold',
  CONFIRMED: 'bg-emerald/10 text-emerald',
  SHIPPED:   'bg-blue-50 text-blue-600',
  DELIVERED: 'bg-emerald/10 text-emerald',
  CANCELLED: 'bg-burgundy/10 text-burgundy',
}

function Avatar({ name }) {
  const initials = (name || 'U').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  return (
    <div className="w-20 h-20 rounded-full bg-gold-gradient flex items-center justify-center flex-shrink-0 shadow-lg shadow-gold/20">
      <span className="font-display text-almost-black text-2xl font-semibold">{initials}</span>
    </div>
  )
}

function StatCard({ label, value, sub, to }) {
  const inner = (
    <div className="bg-white border border-taupe/15 rounded-xl p-5 text-center hover:border-gold/40 hover:shadow-luxury transition-all">
      <p className="font-display text-charcoal text-2xl font-semibold">{value}</p>
      <p className="text-gold text-xs font-semibold uppercase tracking-[0.15em] mt-1">{label}</p>
      {sub && <p className="text-taupe text-xs mt-0.5">{sub}</p>}
    </div>
  )
  return to ? <Link to={to}>{inner}</Link> : <div>{inner}</div>
}

export default function ProfilePage() {
  const dispatch = useDispatch()
  const { user, loading, error } = useSelector(s => s.auth)
  const { wallet } = useSelector(s => s.wallet)
  const { favourites } = useFavourites()

  const [tab, setTab]       = useState('Profile')
  const [form, setForm]     = useState({ name: '', email: '', phone: '' })
  const [success, setSuccess] = useState(false)
  const [orders,  setOrders]  = useState([])
  const [bids,    setBids]    = useState([])
  const [tickets, setTickets] = useState([])
  const [ordersLoading,  setOrdersLoading]  = useState(false)
  const [bidsLoading,    setBidsLoading]    = useState(false)
  const [ticketsLoading, setTicketsLoading] = useState(false)

  useEffect(() => {
    if (user) setForm({ name: user.name || '', email: user.email || '', phone: user.phone || '' })
    return () => dispatch(clearError())
  }, [user])

  useEffect(() => {
    dispatch(fetchWallet())
    api.get('/users/me/tickets').then(r => setTickets(r.data || [])).catch(() => {})
  }, [])

  useEffect(() => {
    if (tab === 'My Orders' && orders.length === 0) {
      setOrdersLoading(true)
      api.get('/orders').then(r => setOrders(r.data || [])).catch(() => {}).finally(() => setOrdersLoading(false))
    }
    if (tab === 'My Bids' && bids.length === 0) {
      setBidsLoading(true)
      api.get('/auctions/my-bids').then(r => setBids(r.data || [])).catch(() => {}).finally(() => setBidsLoading(false))
    }
    if (tab === 'My Tickets' && tickets.length === 0) {
      setTicketsLoading(true)
      api.get('/users/me/tickets').then(r => setTickets(r.data || [])).catch(() => {}).finally(() => setTicketsLoading(false))
    }
  }, [tab])

  const onChange = e => {
    setSuccess(false)
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const onSubmit = async e => {
    e.preventDefault()
    setSuccess(false)
    try {
      await dispatch(updateProfile(form)).unwrap()
      setSuccess(true)
    } catch {}
  }

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-AE', { month: 'long', year: 'numeric' })
    : null

  const balance = wallet ? Number(wallet.balance) : 0

  const inputCls = 'w-full bg-white border border-taupe/25 text-charcoal placeholder-taupe/40 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gold transition-colors'

  return (
    <div className="bg-ivory min-h-screen">

      {/* ── Emerald Hero ── */}
      <div className="relative bg-emerald overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-14">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <Avatar name={user?.name} />
            <div className="flex-1 min-w-0">
              <h1 className="font-display text-ivory text-xl sm:text-3xl font-semibold mb-1">{user?.name || 'Member'}</h1>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                  user?.role === 'ADMIN' ? 'bg-burgundy/20 text-ivory' : 'bg-gold/20 text-ivory'
                }`}>
                  {user?.role === 'ADMIN' ? 'Admin' : 'Member'}
                </span>
                <span className="flex items-center gap-1 text-xs text-ivory/70">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                  Active
                </span>
              </div>
              <p className="text-ivory/70 text-sm truncate">{user?.email}</p>
              {user?.phone && <p className="text-ivory/60 text-xs mt-0.5">{user.phone}</p>}
              {memberSince && <p className="text-ivory/50 text-xs mt-1">Member since {memberSince}</p>}
              <p className="text-ivory/60 text-sm mt-2">Manage your account, bids, and orders</p>
            </div>
            <div className="sm:text-right">
              <p className="text-ivory/60 text-xs uppercase tracking-widest mb-0.5">Wallet Balance</p>
              <p className="font-display text-ivory text-2xl font-semibold">AED {balance.toLocaleString()}</p>
              <Link to="/wallet" className="text-xs text-ivory/70 hover:text-ivory transition-colors mt-0.5 inline-block">
                Manage wallet →
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

      {/* ── Stats row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
        <StatCard label="Wallet" value={`AED ${balance.toLocaleString()}`} sub="Available balance" to="/wallet" />
        <StatCard label="Orders" value={orders.length > 0 ? orders.length : '—'} sub="Total purchases" />
        <StatCard label="Tickets" value={tickets.length > 0 ? tickets.length : '—'} sub="Auction entries" />
        <StatCard label="Favourites" value={favourites.length || '0'} sub="Saved auctions" to="/favourites" />
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 border-b border-taupe/15 mb-6 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-shrink-0 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              tab === t
                ? 'border-gold text-charcoal'
                : 'border-transparent text-taupe hover:text-charcoal'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ── Profile Tab ── */}
      {tab === 'Profile' && (
        <div className="grid sm:grid-cols-2 gap-6">

          {/* Edit profile */}
          <div className="bg-white border border-taupe/15 rounded-xl p-6">
            <h2 className="font-display text-charcoal text-lg font-semibold mb-5">Edit Profile</h2>
            <form onSubmit={onSubmit} className="space-y-4">
              {error && (
                <div className="bg-burgundy/10 border border-burgundy/30 text-burgundy text-sm rounded-lg px-4 py-3">{error}</div>
              )}
              {success && (
                <div className="bg-emerald/10 border border-emerald/30 text-emerald text-sm rounded-lg px-4 py-3">Profile updated successfully.</div>
              )}
              {[
                { name: 'name',  label: 'Full Name',    type: 'text' },
                { name: 'email', label: 'Email Address', type: 'email' },
                { name: 'phone', label: 'Phone Number',  type: 'tel' },
              ].map(f => (
                <div key={f.name}>
                  <label className="block text-taupe text-xs uppercase tracking-wide mb-1.5">{f.label}</label>
                  <input
                    type={f.type}
                    name={f.name}
                    value={form[f.name]}
                    onChange={onChange}
                    required
                    className={inputCls}
                  />
                </div>
              ))}
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-shimmer bg-gold-gradient text-almost-black font-bold py-2.5 rounded-lg disabled:opacity-50 text-sm transition-opacity hover:opacity-90 mt-2"
              >
                {loading ? 'Saving…' : 'Save Changes'}
              </button>
            </form>
          </div>

          {/* Account info */}
          <div className="space-y-4">
            <div className="bg-white border border-taupe/15 rounded-xl p-6">
              <h2 className="font-display text-charcoal text-lg font-semibold mb-4">Account Details</h2>
              <div className="space-y-3">
                {[
                  { label: 'Account ID',    value: `#${user?.id || '—'}` },
                  { label: 'Role',          value: user?.role || '—' },
                  { label: 'Member Since',  value: memberSince || '—' },
                  { label: 'Email Verified', value: user?.emailVerified ? 'Yes' : 'Not verified' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center py-2 border-b border-taupe/10 last:border-0">
                    <span className="text-taupe text-xs uppercase tracking-wide">{label}</span>
                    <span className="text-charcoal text-sm font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gold/5 border border-gold/20 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18-3a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6" />
                </svg>
                <h3 className="text-charcoal text-sm font-semibold">Wallet</h3>
              </div>
              <p className="font-display text-gold text-3xl font-semibold">AED {balance.toLocaleString()}</p>
              <p className="text-taupe text-xs mt-1">Available for bidding and purchases</p>
              <Link
                to="/wallet"
                className="mt-4 inline-block btn-shimmer bg-gold-gradient text-almost-black text-xs font-bold px-4 py-2 rounded-lg"
              >
                Add Funds
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ── My Orders Tab ── */}
      {tab === 'My Orders' && (
        <div className="bg-white border border-taupe/15 rounded-xl p-6">
          <h2 className="font-display text-charcoal text-lg font-semibold mb-5">My Orders</h2>
          {ordersLoading ? (
            <div className="text-center py-12 text-taupe text-sm">Loading orders…</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl text-taupe/20 mb-4">◆</div>
              <p className="text-charcoal font-medium mb-1">No orders yet</p>
              <p className="text-taupe text-sm mb-5">Your purchases will appear here.</p>
              <Link to="/auctions" className="text-gold text-sm hover:underline">Browse auctions →</Link>
            </div>
          ) : (
            <div className="divide-y divide-taupe/10">
              {orders.map(order => (
                <div key={order.id} className="py-4 flex items-start gap-4">
                  {order.product?.imageUrls?.[0] ? (
                    <img src={order.product.imageUrls[0]} alt={order.product?.name} className="w-14 h-14 object-cover rounded-lg flex-shrink-0 bg-taupe/10" />
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-taupe/10 flex items-center justify-center text-taupe/30 text-xl flex-shrink-0">◆</div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-taupe text-xs font-semibold uppercase tracking-wide">{order.product?.brand}</p>
                    <p className="text-charcoal text-sm font-medium line-clamp-1">{order.product?.name || `Order #${order.id}`}</p>
                    <p className="text-taupe text-xs mt-0.5">{new Date(order.createdAt).toLocaleDateString('en-AE', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-charcoal font-semibold text-sm">AED {Number(order.totalAmount || order.amount || 0).toLocaleString()}</p>
                    <span className={`mt-1 inline-block text-xs px-2 py-0.5 rounded-full font-medium ${ORDER_STATUS_STYLE[order.status] || 'bg-taupe/10 text-taupe'}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── My Tickets Tab ── */}
      {tab === 'My Tickets' && (
        <div className="bg-white border border-taupe/15 rounded-xl p-6">
          <h2 className="font-display text-charcoal text-lg font-semibold mb-5">My Tickets</h2>
          {ticketsLoading ? (
            <div className="text-center py-12 text-taupe text-sm">Loading tickets…</div>
          ) : tickets.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl text-taupe/20 mb-4">◆</div>
              <p className="text-charcoal font-medium mb-1">No tickets yet</p>
              <p className="text-taupe text-sm mb-5">Purchase a ticket to enter an upcoming auction.</p>
              <Link to="/auctions" className="text-gold text-sm hover:underline">Browse auctions →</Link>
            </div>
          ) : (
            <div className="divide-y divide-taupe/10">
              {tickets.map(ticket => (
                <div key={ticket.ticketId} className="py-4 flex items-start gap-4">
                  {ticket.imageUrls?.[0] ? (
                    <img src={ticket.imageUrls[0]} alt={ticket.productName} className="w-14 h-14 object-cover rounded-lg flex-shrink-0 bg-taupe/10" />
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-taupe/10 flex items-center justify-center text-taupe/30 text-xl flex-shrink-0">◆</div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-taupe text-xs font-semibold uppercase tracking-wide">{ticket.brand}</p>
                    <p className="text-charcoal text-sm font-medium line-clamp-1">{ticket.productName || `Auction #${ticket.auctionId}`}</p>
                    <p className="text-taupe text-xs mt-0.5">
                      Purchased {new Date(ticket.purchasedAt).toLocaleDateString('en-AE', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                    <p className="text-taupe text-xs mt-0.5">
                      Tickets sold: {ticket.ticketsSold} / {ticket.ticketTarget}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-charcoal font-semibold text-sm">{ticket.currency} {Number(ticket.ticketPrice || 0).toLocaleString()}</p>
                    <span className={`mt-1 inline-block text-xs px-2 py-0.5 rounded-full font-medium ${
                      ticket.auctionStatus === 'ACTIVE'  ? 'bg-emerald/10 text-emerald' :
                      ticket.auctionStatus === 'PENDING' ? 'bg-gold/10 text-gold' :
                      ticket.auctionStatus === 'SOLD'    ? 'bg-blue-50 text-blue-600' :
                      'bg-taupe/10 text-taupe'
                    }`}>
                      {ticket.auctionStatus}
                    </span>
                    {ticket.productId && (
                      <Link to={`/products/${ticket.productId}`} className="block text-gold text-xs hover:underline mt-1">
                        View →
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── My Bids Tab ── */}
      {tab === 'My Bids' && (
        <div className="bg-white border border-taupe/15 rounded-xl p-6">
          <h2 className="font-display text-charcoal text-lg font-semibold mb-5">My Bids</h2>
          {bidsLoading ? (
            <div className="text-center py-12 text-taupe text-sm">Loading bids…</div>
          ) : bids.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl text-taupe/20 mb-4">◆</div>
              <p className="text-charcoal font-medium mb-1">No bids placed yet</p>
              <p className="text-taupe text-sm mb-5">Join a live auction to start bidding.</p>
              <Link to="/auctions" className="text-gold text-sm hover:underline">View live auctions →</Link>
            </div>
          ) : (
            <div className="divide-y divide-taupe/10">
              {bids.map((bid, i) => (
                <div key={bid.id || i} className="py-4 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-charcoal text-sm font-medium line-clamp-1">{bid.auction?.product?.name || `Auction #${bid.auctionId}`}</p>
                    <p className="text-taupe text-xs mt-0.5">{bid.auction?.product?.brand}</p>
                    <p className="text-taupe text-xs mt-0.5">{new Date(bid.createdAt).toLocaleDateString('en-AE', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-gold font-bold text-sm">AED {Number(bid.amount).toLocaleString()}</p>
                    <span className={`mt-1 text-xs px-2 py-0.5 rounded-full inline-block ${
                      bid.isWinning ? 'bg-emerald/10 text-emerald' : 'bg-taupe/10 text-taupe'
                    }`}>
                      {bid.isWinning ? 'Highest' : 'Outbid'}
                    </span>
                  </div>
                  {bid.auctionId && (
                    <Link to={`/products/${bid.auction?.product?.id}`} className="text-gold text-xs hover:underline flex-shrink-0">
                      View →
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      </div>
    </div>
  )
}
