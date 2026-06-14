import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchReports } from '../../features/admin/adminSlice'
import Loader from '../../components/common/Loader'

function StatCard({ label, value, sub, accent, icon }) {
  return (
    <div className={`rounded-xl p-5 border flex flex-col gap-2 ${
      accent
        ? 'bg-emerald text-ivory border-emerald'
        : 'bg-white border-taupe/15'
    }`}>
      <div className="flex items-center justify-between">
        <p className={`text-xs font-semibold uppercase tracking-wide ${accent ? 'text-ivory/60' : 'text-taupe'}`}>{label}</p>
        {icon && <span className={`text-lg ${accent ? 'text-gold' : 'text-taupe/30'}`}>{icon}</span>}
      </div>
      <p className={`text-2xl font-bold font-display leading-tight ${accent ? 'text-gold' : 'text-charcoal'}`}>{value}</p>
      {sub && <p className={`text-xs ${accent ? 'text-ivory/50' : 'text-taupe'}`}>{sub}</p>}
    </div>
  )
}

export default function AdminDashboardPage() {
  const dispatch = useDispatch()
  const { reports, loading } = useSelector(s => s.admin)

  useEffect(() => { dispatch(fetchReports()) }, [])

  if (loading) return <Loader text="Loading reports…" />

  const r   = reports || {}
  const fmt = n => n !== undefined && n !== null ? `AED ${Number(n).toLocaleString()}` : '—'
  const num = n => n !== undefined && n !== null ? Number(n).toLocaleString() : '—'

  return (
    <div className="space-y-8">

      {/* Page header */}
      <div className="flex items-center gap-3">
        <div className="h-6 w-1 bg-emerald rounded-full" />
        <div>
          <h2 className="font-display text-charcoal text-2xl font-semibold">Overview</h2>
          <p className="text-taupe text-xs mt-0.5">Platform performance at a glance</p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <StatCard label="Total Revenue"    value={fmt(r.totalRevenue)}      accent icon="◆" />
        <StatCard label="Buy Now Sales"    value={num(r.buyNowCount)}        sub={fmt(r.buyNowRevenue)} icon="🛍" />
        <StatCard label="Auction Wins"     value={num(r.auctionWinCount)}    sub={fmt(r.auctionWinRevenue)} icon="🔨" />
        <StatCard label="Tickets Sold"     value={num(r.ticketsSold)}        sub={fmt(r.ticketRevenue)} icon="🎫" />
        <StatCard label="Credits Issued"   value={fmt(r.creditsIssued)}      icon="＋" />
        <StatCard label="Credits Redeemed" value={fmt(r.creditsRedeemed)}    icon="✓" />
      </div>

    </div>
  )
}
