import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchReports, saveCreditConfig } from '../../features/admin/adminSlice'
import Loader from '../../components/common/Loader'

function StatCard({ label, value, sub, accent }) {
  return (
    <div className={`rounded-xl p-5 border ${accent ? 'bg-emerald border-emerald' : 'bg-white border-taupe/15'}`}>
      <p className={`text-xs font-medium uppercase tracking-wide ${accent ? 'text-ivory/60' : 'text-taupe'}`}>{label}</p>
      <p className={`text-2xl font-bold font-display mt-1 ${accent ? 'text-gold' : 'text-charcoal'}`}>{value}</p>
      {sub && <p className={`text-xs mt-1 ${accent ? 'text-ivory/60' : 'text-taupe'}`}>{sub}</p>}
    </div>
  )
}

export default function AdminReportsPage() {
  const dispatch = useDispatch()
  const { reports, loading } = useSelector(s => s.admin)

  const [config, setConfig]   = useState({ creditPercentage: 10, maxCreditPerPurchase: 500, expiryEnabled: true, expiryDays: 90 })
  const [configSaved, setSaved] = useState(false)

  useEffect(() => { dispatch(fetchReports()) }, [])

  const onConfigChange = e => {
    const { name, value, type, checked } = e.target
    setSaved(false)
    setConfig(c => ({ ...c, [name]: type === 'checkbox' ? checked : value }))
  }

  const onSaveConfig = async e => {
    e.preventDefault()
    await dispatch(saveCreditConfig(config)).unwrap()
    setSaved(true)
  }

  if (loading) return <Loader text="Loading reports…" />

  const r   = reports || {}
  const fmt = n => n !== undefined ? `AED ${Number(n).toLocaleString()}` : '—'
  const num = n => n !== undefined ? Number(n).toLocaleString() : '—'

  return (
    <div className="space-y-10">
      {/* Revenue overview */}
      <div>
        <div className="flex items-center gap-3 mb-5">
          <div className="h-6 w-1 bg-emerald rounded-full" />
          <h2 className="font-display text-charcoal text-2xl font-semibold">Revenue Overview</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
          <StatCard label="Total Revenue"      value={fmt(r.totalRevenue)}     accent />
          <StatCard label="Buy Now Revenue"    value={fmt(r.buyNowRevenue)}    sub={`${num(r.buyNowCount)} sales`} />
          <StatCard label="Auction Revenue"    value={fmt(r.auctionWinRevenue)} sub={`${num(r.auctionWinCount)} wins`} />
          <StatCard label="Ticket Revenue"     value={fmt(r.ticketRevenue)}    sub={`${num(r.ticketsSold)} tickets sold`} />
          <StatCard label="Credits Issued"     value={fmt(r.creditsIssued)} />
          <StatCard label="Credits Redeemed"   value={fmt(r.creditsRedeemed)} />
        </div>
      </div>

      {/* Credit config */}
      <div>
        <div className="flex items-center gap-3 mb-5">
          <div className="h-6 w-1 bg-emerald rounded-full" />
          <h2 className="font-display text-charcoal text-2xl font-semibold">Credit Configuration</h2>
        </div>
        <form onSubmit={onSaveConfig} className="bg-white border border-taupe/15 rounded-xl p-6 space-y-5">
          {configSaved && (
            <div className="bg-emerald/10 border border-emerald/30 text-emerald text-sm rounded-lg px-4 py-3">
              Configuration saved.
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-taupe text-xs mb-1">Credit Percentage (%)</label>
              <input
                type="number"
                name="creditPercentage"
                value={config.creditPercentage}
                onChange={onConfigChange}
                min="0" max="100"
                className="w-full bg-white border border-taupe/30 text-charcoal rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold"
              />
              <p className="text-taupe text-xs mt-1">% of ticket revenue credited to losers</p>
            </div>

            <div>
              <label className="block text-taupe text-xs mb-1">Max Credit Per Purchase (AED)</label>
              <input
                type="number"
                name="maxCreditPerPurchase"
                value={config.maxCreditPerPurchase}
                onChange={onConfigChange}
                min="0"
                className="w-full bg-white border border-taupe/30 text-charcoal rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-taupe text-xs mb-1">Expiry Days</label>
              <input
                type="number"
                name="expiryDays"
                value={config.expiryDays}
                onChange={onConfigChange}
                min="0"
                disabled={!config.expiryEnabled}
                className="w-full bg-white border border-taupe/30 text-charcoal rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold disabled:opacity-40"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="expiryEnabled"
                name="expiryEnabled"
                checked={config.expiryEnabled}
                onChange={onConfigChange}
                className="w-4 h-4 accent-gold"
              />
              <label htmlFor="expiryEnabled" className="text-charcoal text-sm cursor-pointer">Enable credit expiry</label>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-gold text-almost-black font-semibold px-6 py-2.5 rounded-lg hover:bg-gold/90 text-sm transition-colors"
            >
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
