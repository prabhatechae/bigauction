import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchWallet } from '../features/wallet/walletSlice'
import api from '../services/api'
import Loader from '../components/common/Loader'

const REASON_MAP = {
  AUCTION_LOSS_CREDIT:  'Auction loss credit',
  BUY_NOW_PURCHASE:     'Buy Now purchase',
  AUCTION_WIN_PURCHASE: 'Auction checkout',
  ADMIN_ADJUSTMENT:     'Admin adjustment',
  WALLET_DEPOSIT:       'Wallet deposit',
}

const STATUS_STYLE = {
  PENDING:  'bg-gold/10 text-gold',
  APPROVED: 'bg-emerald/10 text-emerald',
  REJECTED: 'bg-burgundy/10 text-burgundy',
}

// ── Bank details shown to user ───────────────────────────────────────
const BANK_DETAILS = [
  { label: 'Bank Name',       value: 'Emirates NBD' },
  { label: 'Account Name',    value: 'BigAuction.ae FZ LLC' },
  { label: 'Account Number',  value: '1234567890' },
  { label: 'IBAN',            value: 'AE070331234567890123456' },
  { label: 'Swift / BIC',     value: 'EBILAEAD' },
  { label: 'Currency',        value: 'AED' },
]

// ── Add Funds Modal ──────────────────────────────────────────────────
function AddFundsModal({ onClose, onSubmitted }) {
  const [step, setStep] = useState('details') // 'details' | 'form'
  const [form, setForm] = useState({ amount: '', bankReference: '', userNote: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const onSubmit = async e => {
    e.preventDefault()
    if (!form.amount || !form.bankReference) { setError('Amount and bank reference are required.'); return }
    setLoading(true); setError(null)
    try {
      await api.post('/wallet/deposit-request', {
        amount: Number(form.amount),
        bankReference: form.bankReference,
        userNote: form.userNote || null,
      })
      onSubmitted()
    } catch (err) {
      setError(err.message || 'Submission failed')
      setLoading(false)
    }
  }

  const inputCls = 'w-full bg-white border border-taupe/30 text-charcoal placeholder-taupe/40 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-gold transition-colors'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-almost-black/80">
      <div className="bg-white border border-taupe/15 rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-charcoal font-semibold">Add Funds to Wallet</h3>
          <button onClick={onClose} className="text-taupe hover:text-charcoal text-xl leading-none">×</button>
        </div>

        {step === 'details' && (
          <div className="space-y-5">
            <p className="text-taupe text-sm">Transfer the desired amount to the bank account below, then click <span className="text-charcoal font-medium">I've Transferred</span> to submit your reference number for approval.</p>

            <div className="bg-taupe/10 rounded-lg divide-y divide-taupe/10">
              {BANK_DETAILS.map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center px-4 py-3 text-sm">
                  <span className="text-taupe">{label}</span>
                  <span className="text-charcoal font-mono">{value}</span>
                </div>
              ))}
            </div>

            <p className="text-taupe text-xs">Use your name or email as the payment reference. Once transferred, submit your bank reference number and we will credit your wallet within 1–2 business days.</p>

            <button
              onClick={() => setStep('form')}
              className="w-full bg-gold text-almost-black font-bold py-3 rounded-lg hover:bg-gold/90 transition-colors"
            >
              I've Transferred — Submit Reference
            </button>
          </div>
        )}

        {step === 'form' && (
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-taupe text-xs mb-1">Amount Transferred (AED) *</label>
              <input type="number" name="amount" value={form.amount} onChange={onChange} min="1" required className={inputCls} placeholder="e.g. 500" />
            </div>
            <div>
              <label className="block text-taupe text-xs mb-1">Bank Transfer Reference / Receipt No. *</label>
              <input type="text" name="bankReference" value={form.bankReference} onChange={onChange} required className={inputCls} placeholder="e.g. TXN123456789" />
            </div>
            <div>
              <label className="block text-taupe text-xs mb-1">Additional Note (optional)</label>
              <textarea name="userNote" value={form.userNote} onChange={onChange} rows={2} className={inputCls} placeholder="Transfer date, bank name, etc." />
            </div>

            {error && (
              <div className="bg-burgundy/10 border border-burgundy/30 text-burgundy text-sm rounded-lg px-4 py-3">{error}</div>
            )}

            <div className="flex gap-3">
              <button type="button" onClick={() => setStep('details')} className="flex-1 text-taupe text-sm border border-taupe/30 rounded-lg py-3 hover:text-charcoal transition-colors">
                Back
              </button>
              <button type="submit" disabled={loading} className="flex-1 bg-gold text-almost-black font-bold py-3 rounded-lg hover:bg-gold/90 disabled:opacity-50 transition-colors text-sm">
                {loading ? 'Submitting…' : 'Submit Request'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

// ── Transaction Row ──────────────────────────────────────────────────
function TransactionRow({ tx }) {
  const isCredit  = tx.type === 'CREDIT'
  const isExpired = tx.expired
  const expiring  = tx.expiresAt && !isExpired

  return (
    <div className="flex items-start justify-between py-4 border-b border-taupe/10 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-charcoal text-sm">{REASON_MAP[tx.reason] || tx.reason}</p>
        {tx.note && <p className="text-taupe text-xs mt-0.5 truncate">{tx.note}</p>}
        <div className="flex flex-wrap gap-2 mt-1">
          <span className="text-taupe text-xs">{new Date(tx.createdAt).toLocaleDateString()}</span>
          {expiring && (
            <span className="text-xs bg-gold/10 text-gold px-2 py-0.5 rounded-full">
              Expires {new Date(tx.expiresAt).toLocaleDateString()}
            </span>
          )}
          {isExpired && (
            <span className="text-xs bg-taupe/10 text-taupe px-2 py-0.5 rounded-full line-through">Expired</span>
          )}
        </div>
      </div>
      <p className={`ml-4 font-semibold text-sm flex-shrink-0 ${isCredit ? 'text-emerald' : 'text-burgundy'}`}>
        {isCredit ? '+' : '−'}AED {Number(tx.amount).toLocaleString()}
      </p>
    </div>
  )
}

// ── Main Page ────────────────────────────────────────────────────────
export default function WalletPage() {
  const dispatch = useDispatch()
  const { wallet, loading } = useSelector(s => s.wallet)

  const [showAddFunds, setShowAddFunds] = useState(false)
  const [deposits, setDeposits]         = useState([])
  const [depositSuccess, setDepositSuccess] = useState(false)

  useEffect(() => { dispatch(fetchWallet()) }, [])

  useEffect(() => {
    api.get('/wallet/deposit-requests')
      .then(res => setDeposits(res.data || []))
      .catch(() => {})
  }, [depositSuccess])

  const onDepositSubmitted = () => {
    setShowAddFunds(false)
    setDepositSuccess(s => !s)  // toggle to re-fetch deposits
  }

  if (loading && !wallet) return <Loader text="Loading wallet…" />

  const balance = wallet ? Number(wallet.balance) : 0
  const txs     = wallet?.transactions || []

  return (
    <div className="bg-ivory min-h-screen">

      {/* ── Emerald Hero ── */}
      <div className="relative bg-emerald overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <p className="text-ivory/60 text-xs uppercase tracking-widest mb-3">My Wallet</p>
          <p className="text-ivory text-5xl font-bold mt-1 font-display">AED {balance.toLocaleString()}</p>
          <p className="text-ivory/50 text-sm mt-3">Track your balance and transactions</p>
          <button
            onClick={() => setShowAddFunds(true)}
            className="mt-6 bg-ivory text-emerald font-bold px-5 py-2.5 rounded-lg hover:bg-ivory/90 transition-colors text-sm"
          >
            + Add Funds
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">

      {/* Deposit request history */}
      {deposits.length > 0 && (
        <div className="bg-white border border-taupe/15 rounded-xl p-6">
          <h2 className="text-charcoal font-semibold mb-4">Deposit Requests</h2>
          <div className="space-y-3">
            {deposits.map(d => (
              <div key={d.id} className="flex items-center justify-between py-3 border-b border-taupe/10 last:border-0">
                <div className="flex-1 min-w-0">
                  <p className="text-charcoal text-sm font-medium">AED {Number(d.amount).toLocaleString()}</p>
                  <p className="text-taupe text-xs mt-0.5">Ref: {d.bankReference}</p>
                  {d.adminNote && <p className="text-taupe text-xs mt-0.5 italic">{d.adminNote}</p>}
                  <p className="text-taupe text-xs mt-0.5">{new Date(d.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLE[d.status] || 'bg-taupe/10 text-taupe'}`}>
                  {d.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transaction history */}
      <div className="bg-white border border-taupe/15 rounded-xl p-6">
        <h2 className="text-charcoal font-semibold mb-4">Transaction History</h2>
        {txs.length === 0 ? (
          <p className="text-taupe text-sm text-center py-8">No transactions yet.</p>
        ) : (
          <div>
            {txs.map((tx, i) => <TransactionRow key={tx.id || i} tx={tx} />)}
          </div>
        )}
      </div>

      {showAddFunds && (
        <AddFundsModal onClose={() => setShowAddFunds(false)} onSubmitted={onDepositSubmitted} />
      )}

      </div>
    </div>
  )
}
