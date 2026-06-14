import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAuctions, activateAuction, closeAuction, fetchParticipants } from '../../features/auctions/auctionsSlice'
import Loader from '../../components/common/Loader'

const STATUS_STYLE = {
  PENDING: 'bg-taupe/20 text-taupe',
  ACTIVE:  'bg-emerald/20 text-emerald',
  CLOSED:  'bg-taupe/10 text-taupe border border-taupe/20',
  SOLD:    'bg-burgundy/20 text-burgundy',
}

function ParticipantsModal({ auctionId, onClose }) {
  const dispatch = useDispatch()
  const { participants, loading } = useSelector(s => s.auctions)

  useEffect(() => { dispatch(fetchParticipants(auctionId)) }, [auctionId])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-almost-black/80">
      <div className="bg-white border border-taupe/15 rounded-xl w-full max-w-md max-h-[80vh] flex flex-col p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-charcoal font-semibold">Participants</h3>
          <button onClick={onClose} className="text-taupe hover:text-charcoal text-xl">×</button>
        </div>
        {loading ? <Loader text="Loading…" /> : (
          <div className="overflow-y-auto space-y-2">
            {participants.map((p, i) => (
              <div key={p.userId || i} className="flex items-center justify-between py-2 border-b border-taupe/10">
                <div>
                  <p className="text-charcoal text-sm">{p.name}</p>
                  <p className="text-taupe text-xs">{p.email}</p>
                </div>
                <span className="text-taupe text-xs">
                  {p.ticketPurchasedAt ? new Date(p.ticketPurchasedAt).toLocaleDateString() : '—'}
                </span>
              </div>
            ))}
            {participants.length === 0 && <p className="text-taupe text-sm text-center py-4">No participants yet.</p>}
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

  const onActivate = id => {
    if (!window.confirm('Activate this auction? Bidding will begin immediately.')) return
    dispatch(activateAuction(id))
  }
  const onClose = id => {
    if (!window.confirm('Force-close this auction? The highest bidder (if any) will be selected as winner and credits will be distributed.')) return
    dispatch(closeAuction(id))
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
                        <button
                          onClick={() => onClose(a.id)}
                          className="text-xs text-burgundy hover:underline"
                        >
                          Close
                        </button>
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
