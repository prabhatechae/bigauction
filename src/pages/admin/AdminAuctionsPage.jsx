import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAuctions, activateAuction, closeAuction, closeAuctionWithWinner, fetchParticipants, fetchAutoBidConfigs } from '../../features/auctions/auctionsSlice'
import Loader from '../../components/common/Loader'

const STATUS_STYLE = {
  PENDING: 'bg-taupe/20 text-taupe',
  ACTIVE:  'bg-emerald/20 text-emerald',
  CLOSED:  'bg-taupe/10 text-taupe border border-taupe/20',
  SOLD:    'bg-burgundy/20 text-burgundy',
}

function ParticipantsModal({ auctionId, onClose }) {
  const dispatch = useDispatch()
  const { participants, autoBidConfigs, loading } = useSelector(s => s.auctions)

  useEffect(() => {
    dispatch(fetchParticipants(auctionId))
    dispatch(fetchAutoBidConfigs(auctionId))
  }, [auctionId])

  // Build a quick lookup: userId → autoBidConfig
  const autoBidMap = Object.fromEntries((autoBidConfigs || []).map(c => [c.userId, c]))
  const autoBidCount = (autoBidConfigs || []).length

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-almost-black/80">
      <div className="bg-white border border-taupe/15 rounded-xl w-full max-w-lg max-h-[85vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-taupe/10">
          <div>
            <h3 className="text-charcoal font-semibold">Participants</h3>
            {!loading && autoBidCount > 0 && (
              <p className="text-taupe text-xs mt-0.5">
                <span className="text-gold font-semibold">{autoBidCount}</span> of {participants.length} have auto bid active
              </p>
            )}
          </div>
          <button onClick={onClose} className="text-taupe hover:text-charcoal text-xl leading-none">×</button>
        </div>

        {loading ? <div className="p-6"><Loader text="Loading…" /></div> : (
          <div className="overflow-y-auto flex-1">
            {participants.length === 0 && (
              <p className="text-taupe text-sm text-center py-8">No participants yet.</p>
            )}
            {participants.map((p, i) => {
              const ab = autoBidMap[p.userId]
              return (
                <div key={p.userId || i} className="flex items-center justify-between px-5 py-3 border-b border-taupe/8 last:border-0">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-charcoal text-sm font-medium truncate">{p.name}</p>
                      {ab && (
                        <span className="inline-flex items-center gap-1 text-[9px] bg-gold/10 text-gold border border-gold/25 px-1.5 py-0.5 rounded font-bold uppercase tracking-wide flex-shrink-0">
                          🤖 Auto
                        </span>
                      )}
                    </div>
                    <p className="text-taupe text-xs">{p.email}</p>
                    {ab && (
                      <p className="text-taupe/70 text-[10px] mt-0.5">
                        +AED {Number(ab.increment).toLocaleString()} · max AED {Number(ab.maxLimit).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <span className="text-taupe text-xs flex-shrink-0 ml-3">
                    {p.ticketPurchasedAt ? new Date(p.ticketPurchasedAt).toLocaleDateString() : '—'}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default function AdminAuctionsPage() {
  const dispatch = useDispatch()
  const { items: auctions, loading } = useSelector(s => s.auctions)

  const [viewParticipants, setViewParticipants] = useState(null)

  useEffect(() => { dispatch(fetchAuctions()) }, [])

  const onActivate = async id => {
    if (!window.confirm('Activate this auction? Bidding will begin immediately.')) return
    const result = await dispatch(activateAuction(id))
    if (activateAuction.rejected.match(result)) window.alert('Error: ' + result.payload)
  }
  const onClose = async id => {
    if (!window.confirm('Close without winner? Ticket holders will receive credits back. No winner will be declared.')) return
    const result = await dispatch(closeAuction(id))
    if (closeAuction.rejected.match(result)) window.alert('Error: ' + result.payload)
  }
  const onCloseWithWinner = async id => {
    if (!window.confirm('Declare winner now? The current highest bidder will be marked as winner and credits distributed to losers.')) return
    const result = await dispatch(closeAuctionWithWinner(id))
    if (closeAuctionWithWinner.rejected.match(result)) window.alert('Error: ' + result.payload)
  }

  if (loading) return <Loader text="Loading auctions…" />

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="h-6 w-1 bg-emerald rounded-full" />
        <h2 className="font-display text-charcoal text-2xl font-semibold">Auctions <span className="text-taupe text-lg font-normal">({auctions.length})</span></h2>
      </div>

      <div className="bg-white border border-taupe/15 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-taupe/5 border-b border-taupe/15 text-left">
                <th className="px-4 py-3 text-taupe font-medium">Product</th>
                <th className="px-4 py-3 text-taupe font-medium">Status</th>
                <th className="px-4 py-3 text-taupe font-medium hidden sm:table-cell">Tickets</th>
                <th className="px-4 py-3 text-taupe font-medium hidden md:table-cell">Highest Bid</th>
                <th className="px-4 py-3 text-taupe font-medium hidden lg:table-cell">End Time</th>
                <th className="px-4 py-3 text-taupe font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {auctions.map(a => (
                <tr key={a.id} className="border-b border-taupe/10 last:border-0 hover:bg-taupe/10 transition-colors">
                  <td className="px-4 py-3 text-charcoal">{a.product?.name || `Auction #${a.id}`}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLE[a.status] || ''}`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-taupe text-xs hidden sm:table-cell">
                    {a.ticketsSold ?? 0} / {a.ticketTarget ?? 0}
                  </td>
                  <td className="px-4 py-3 text-taupe hidden md:table-cell">
                    {a.currentHighestBid ? `AED ${Number(a.currentHighestBid).toLocaleString()}` : '—'}
                  </td>
                  <td className="px-4 py-3 text-taupe hidden lg:table-cell text-xs">
                    {a.scheduledEndTime ? new Date(a.scheduledEndTime).toLocaleString() : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setViewParticipants(a.id)}
                        className="text-xs text-taupe hover:text-charcoal"
                      >
                        Participants
                      </button>
                      {a.status === 'PENDING' && (
                        <button
                          onClick={() => onActivate(a.id)}
                          className="text-xs text-emerald hover:underline"
                        >
                          Activate
                        </button>
                      )}
                      {a.status === 'ACTIVE' && (
                        <>
                          <button
                            onClick={() => onCloseWithWinner(a.id)}
                            className="text-xs text-gold hover:underline"
                          >
                            Declare Winner
                          </button>
                          <button
                            onClick={() => onClose(a.id)}
                            className="text-xs text-burgundy hover:underline"
                          >
                            Close
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {auctions.length === 0 && (
            <p className="text-taupe text-sm text-center py-10">No auctions yet.</p>
          )}
        </div>
      </div>

      {viewParticipants && (
        <ParticipantsModal auctionId={viewParticipants} onClose={() => setViewParticipants(null)} />
      )}
    </div>
  )
}
