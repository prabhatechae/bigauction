import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { buyNow, fetchWallet } from '../features/wallet/walletSlice'
import { checkoutAuctionWin, purchaseTicketByCard } from '../features/auctions/auctionsSlice'

const GCC_COUNTRIES = ['UAE', 'Saudi Arabia', 'Kuwait', 'Bahrain', 'Oman', 'Qatar']

const EMPTY_ADDRESS = {
  shippingName: '',
  shippingPhone: '',
  shippingAddress: '',
  shippingCity: '',
  shippingCountry: 'UAE',
}

const GRADE_LABEL = {
  LIKE_NEW:   'Like New',
  EXCELLENT:  'Excellent',
  VERY_GOOD:  'Very Good',
  GOOD:       'Good',
  FAIR:       'Fair',
}

function InputField({ label, name, value, onChange, type = 'text', required, placeholder }) {
  return (
    <div>
      <label className="block text-taupe text-xs font-medium mb-1.5">
        {label}{required && <span className="text-gold ml-0.5">*</span>}
      </label>
      <input
        type={type} name={name} value={value} onChange={onChange}
        required={required} placeholder={placeholder}
        className="w-full bg-white border border-taupe/25 text-charcoal placeholder-taupe/30 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 transition-all"
      />
    </div>
  )
}

function StepIndicator({ step, current }) {
  const done = current > step
  const active = current === step
  return (
    <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-all ${
      done    ? 'bg-emerald text-ivory' :
      active  ? 'bg-gold text-almost-black' :
                'bg-taupe/20 text-taupe'
    }`}>
      {done ? '✓' : step}
    </div>
  )
}

function SuccessScreen({ title = 'Order Confirmed!', subtitle = 'Your order has been placed successfully.', note, redirectLabel = 'Redirecting to your orders…' }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="relative mx-auto w-24 h-24 mb-8">
          <div className="absolute inset-0 bg-emerald/20 rounded-full animate-ping opacity-30" />
          <div className="relative w-24 h-24 bg-emerald/15 border-2 border-emerald/40 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-emerald" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <h2 className="text-charcoal text-3xl font-bold mb-3">{title}</h2>
        <p className="text-taupe text-base mb-2">{subtitle}</p>
        {note && <p className="text-taupe/70 text-sm mb-8">{note}</p>}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <div className="bg-white border border-taupe/15 rounded-lg px-5 py-3 text-sm text-taupe">
            {redirectLabel}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Ticket Success Screen (navigates back to product page) ───────────
function TicketSuccessScreen({ productId, navigate }) {
  useEffect(() => {
    const timer = setTimeout(() => navigate(`/products/${productId}`), 2500)
    return () => clearTimeout(timer)
  }, [productId, navigate])

  return (
    <SuccessScreen
      title="Ticket Purchased!"
      subtitle="Your auction entry ticket has been confirmed."
      note="You can now place bids once the auction goes live."
      redirectLabel="Returning to auction…"
    />
  )
}

// ── Ticket Card Payment Screen ────────────────────────────────────────
function TicketCheckout({ product, auction, onSuccess }) {
  const dispatch = useDispatch()
  const { loading } = useSelector(s => s.auctions)
  const ticketPrice = Number(auction.ticketPrice)

  const [card, setCard] = useState({ name: '', number: '', expiry: '', cvv: '' })
  const [error, setError] = useState(null)

  const onChange = e => setCard(c => ({ ...c, [e.target.name]: e.target.value }))

  // Format card number with spaces
  const onNumberChange = e => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 16)
    const formatted = digits.replace(/(.{4})/g, '$1 ').trim()
    setCard(c => ({ ...c, number: formatted }))
  }

  // Format expiry MM/YY
  const onExpiryChange = e => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 4)
    const formatted = digits.length > 2 ? digits.slice(0, 2) + '/' + digits.slice(2) : digits
    setCard(c => ({ ...c, expiry: formatted }))
  }

  const onSubmit = async e => {
    e.preventDefault()
    setError(null)
    try {
      await dispatch(purchaseTicketByCard(auction.id)).unwrap()
      onSuccess()
    } catch (err) {
      setError(typeof err === 'string' ? err : err?.message || 'Payment failed. Please try again.')
    }
  }

  const image = product.imageUrls?.[0]

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">

        {/* Left: card form */}
        <form onSubmit={onSubmit} className="lg:col-span-3 space-y-6">
          <div>
            <h1 className="text-charcoal text-2xl font-bold">Card Payment</h1>
            <p className="text-taupe text-sm mt-1">Enter your card details to purchase your auction ticket.</p>
          </div>

          <div className="bg-white border border-taupe/15 rounded-xl p-6 space-y-4">
            <div>
              <label className="block text-taupe text-xs font-medium mb-1.5">Name on Card<span className="text-gold ml-0.5">*</span></label>
              <input
                name="name" value={card.name} onChange={onChange} required
                placeholder="As it appears on your card"
                className="w-full bg-white border border-taupe/25 text-charcoal placeholder-taupe/30 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-taupe text-xs font-medium mb-1.5">Card Number<span className="text-gold ml-0.5">*</span></label>
              <input
                name="number" value={card.number} onChange={onNumberChange} required
                placeholder="0000 0000 0000 0000" maxLength={19}
                className="w-full bg-white border border-taupe/25 text-charcoal placeholder-taupe/30 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-taupe text-xs font-medium mb-1.5">Expiry Date<span className="text-gold ml-0.5">*</span></label>
                <input
                  name="expiry" value={card.expiry} onChange={onExpiryChange} required
                  placeholder="MM/YY" maxLength={5}
                  className="w-full bg-white border border-taupe/25 text-charcoal placeholder-taupe/30 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-taupe text-xs font-medium mb-1.5">CVV<span className="text-gold ml-0.5">*</span></label>
                <input
                  name="cvv" value={card.cvv}
                  onChange={e => setCard(c => ({ ...c, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                  required placeholder="•••" maxLength={4}
                  className="w-full bg-white border border-taupe/25 text-charcoal placeholder-taupe/30 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 transition-all"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-3 bg-burgundy/10 border border-burgundy/30 text-burgundy text-sm rounded-lg px-4 py-3">
              <span className="mt-0.5 flex-shrink-0">⚠</span>
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit" disabled={loading}
            className="w-full bg-gold text-almost-black font-bold py-4 rounded-xl text-base hover:bg-gold/90 disabled:opacity-50 transition-colors shadow-lg shadow-gold/10"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-almost-black/30 border-t-almost-black rounded-full animate-spin" />
                Processing…
              </span>
            ) : (
              `Pay AED ${ticketPrice.toLocaleString()}`
            )}
          </button>

          <p className="text-taupe text-xs text-center">Your card details are processed securely. Ticket is non-refundable.</p>
        </form>

        {/* Right: ticket summary */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-taupe/15 rounded-xl overflow-hidden sticky top-6">
            {image && (
              <div className="aspect-[16/9] bg-taupe/10 overflow-hidden">
                <img src={image} alt={product.name} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-5 space-y-4">
              <div>
                <p className="text-gold text-xs font-semibold uppercase tracking-widest">{product.brand}</p>
                <h3 className="text-charcoal font-semibold mt-1 leading-snug">{product.name}</h3>
              </div>
              <div className="border-t border-taupe/10 pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-taupe">Auction Entry Ticket</span>
                  <span className="text-charcoal font-medium">AED {ticketPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-taupe">Tickets remaining</span>
                  <span className="text-charcoal">{auction.ticketTarget - auction.ticketsSold}</span>
                </div>
                <div className="border-t border-taupe/10 pt-2 flex justify-between font-bold">
                  <span className="text-charcoal">Total</span>
                  <span className="text-gold text-lg">AED {ticketPrice.toLocaleString()}</span>
                </div>
              </div>
              <div className="border-t border-taupe/10 pt-4 space-y-2">
                {['Secure card payment', 'Instant ticket confirmation', 'Participate in live bidding'].map(note => (
                  <div key={note} className="flex items-center gap-2 text-xs text-taupe">
                    <span className="text-gold flex-shrink-0">◆</span>
                    <span>{note}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default function CheckoutPage() {
  const location = useLocation()
  const navigate  = useNavigate()
  const dispatch  = useDispatch()

  const { wallet, loading: walletLoading } = useSelector(s => s.wallet)
  const { loading: auctionLoading }         = useSelector(s => s.auctions)
  const submitting = walletLoading || auctionLoading

  const state = location.state || {}
  const { type, product, auction } = state

  const [step, setStep]           = useState(1)
  const [address, setAddress]     = useState(EMPTY_ADDRESS)
  const [creditInput, setCreditInput] = useState('0')
  const [error, setError]         = useState(null)
  const [success, setSuccess]     = useState(false)

  useEffect(() => { dispatch(fetchWallet()) }, [dispatch])

  if (!type || !product) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <div className="text-5xl text-taupe/20 mb-6">◆</div>
        <h2 className="text-charcoal text-xl font-semibold mb-3">Nothing to check out</h2>
        <p className="text-taupe text-sm mb-6">Please return to the product page and try again.</p>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 bg-gold text-almost-black font-semibold px-6 py-3 rounded-xl text-sm hover:bg-gold/90 transition-colors"
        >
          Back to Home
        </button>
      </div>
    )
  }

  // ── Ticket card payment — no address needed, separate layout ──
  if (type === 'ticket') {
    if (success) {
      return (
        <TicketSuccessScreen productId={product.id} navigate={navigate} />
      )
    }
    return (
      <div className="min-h-screen bg-ivory">
        <div className="border-b border-taupe/10 bg-white/70">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="text-taupe text-sm hover:text-charcoal flex items-center gap-1.5 transition-colors"
            >
              ‹ Back
            </button>
          </div>
        </div>
        <TicketCheckout
          product={product}
          auction={auction}
          onSuccess={() => setSuccess(true)}
        />
      </div>
    )
  }

  if (success) return <SuccessScreen />

  const walletBal = wallet ? Number(wallet.balance) : 0
  const basePrice = type === 'buynow'
    ? Number(product.buyNowPrice)
    : Number(auction?.currentHighestBid || 0)
  const credit    = Math.min(Math.max(Number(creditInput) || 0, 0), walletBal, basePrice)
  const totalDue  = Math.max(basePrice - credit, 0)

  const onAddressChange = e => setAddress(a => ({ ...a, [e.target.name]: e.target.value }))

  const addressComplete =
    address.shippingName.trim() &&
    address.shippingPhone.trim() &&
    address.shippingAddress.trim() &&
    address.shippingCity.trim()

  const onContinue = e => {
    e.preventDefault()
    if (!addressComplete) {
      setError('Please fill in all required address fields.')
      return
    }
    setError(null)
    setStep(2)
  }

  const onSubmit = async e => {
    e.preventDefault()
    setError(null)
    try {
      if (type === 'buynow') {
        await dispatch(buyNow({
          productId: product.id,
          creditToApply: credit,
          address,
        })).unwrap()
      } else {
        await dispatch(checkoutAuctionWin({
          auctionId: auction.id,
          creditToApply: credit,
          address,
        })).unwrap()
      }
      setSuccess(true)
      setTimeout(() => navigate('/orders'), 3000)
    } catch (err) {
      setError(typeof err === 'string' ? err : err?.message || 'Checkout failed. Please try again.')
    }
  }

  const image = product.imageUrls?.[0]

  return (
    <div className="min-h-screen bg-ivory">
      {/* Top bar */}
      <div className="border-b border-taupe/10 bg-white/70">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => step === 2 ? setStep(1) : navigate(-1)}
            className="text-taupe text-sm hover:text-charcoal flex items-center gap-1.5 transition-colors"
          >
            ‹ {step === 2 ? 'Back to address' : 'Back'}
          </button>

          {/* Step indicator */}
          <div className="flex items-center gap-3">
            <StepIndicator step={1} current={step} />
            <div className={`h-px w-10 transition-colors ${step >= 2 ? 'bg-gold' : 'bg-taupe/20'}`} />
            <StepIndicator step={2} current={step} />
            <div className="h-px w-10 bg-taupe/20" />
            <StepIndicator step={3} current={step} />
          </div>

          <p className="text-taupe text-xs hidden sm:block">
            {step === 1 ? 'Delivery Details' : step === 2 ? 'Review & Pay' : 'Done'}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">

          {/* ─── Left column ─── */}
          <div className="lg:col-span-3">

            {/* Step 1: Address */}
            {step === 1 && (
              <form onSubmit={onContinue} className="space-y-6">
                <div>
                  <h1 className="text-charcoal text-2xl font-bold">Delivery Address</h1>
                  <p className="text-taupe text-sm mt-1">Where should we deliver your order?</p>
                </div>

                <div className="bg-white border border-taupe/15 rounded-xl p-6 space-y-4">
                  <InputField
                    label="Full Name" name="shippingName"
                    value={address.shippingName} onChange={onAddressChange}
                    required placeholder="As it appears on your ID"
                  />
                  <InputField
                    label="Phone Number" name="shippingPhone"
                    value={address.shippingPhone} onChange={onAddressChange}
                    type="tel" required placeholder="+971 50 000 0000"
                  />
                  <InputField
                    label="Street / Building / Apartment" name="shippingAddress"
                    value={address.shippingAddress} onChange={onAddressChange}
                    required placeholder="e.g. Villa 12, Al Wasl Road"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <InputField
                      label="City" name="shippingCity"
                      value={address.shippingCity} onChange={onAddressChange}
                      required placeholder="e.g. Dubai"
                    />
                    <div>
                      <label className="block text-taupe text-xs font-medium mb-1.5">
                        Country<span className="text-gold ml-0.5">*</span>
                      </label>
                      <select
                        name="shippingCountry" value={address.shippingCountry}
                        onChange={onAddressChange}
                        className="w-full bg-white border border-taupe/25 text-charcoal rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 transition-all"
                      >
                        {GCC_COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="flex items-start gap-3 bg-burgundy/10 border border-burgundy/30 text-burgundy text-sm rounded-lg px-4 py-3">
                    <span className="mt-0.5 flex-shrink-0">⚠</span>
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-gold text-almost-black font-bold py-4 rounded-xl text-base hover:bg-gold/90 transition-colors shadow-lg shadow-gold/10"
                >
                  Continue to Review →
                </button>
              </form>
            )}

            {/* Step 2: Review & Pay */}
            {step === 2 && (
              <form onSubmit={onSubmit} className="space-y-6">
                <div>
                  <h1 className="text-charcoal text-2xl font-bold">Review & Pay</h1>
                  <p className="text-taupe text-sm mt-1">Confirm your delivery details and complete your order.</p>
                </div>

                {/* Address summary */}
                <div className="bg-white border border-taupe/15 rounded-xl p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-charcoal font-semibold text-sm">{address.shippingName}</p>
                      <p className="text-taupe text-sm mt-0.5">{address.shippingPhone}</p>
                      <p className="text-taupe text-sm">{address.shippingAddress}</p>
                      <p className="text-taupe text-sm">{address.shippingCity}, {address.shippingCountry}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-gold text-xs hover:underline flex-shrink-0 ml-4"
                    >
                      Edit
                    </button>
                  </div>
                </div>

                {/* Wallet credit */}
                {walletBal > 0 && (
                  <div className="bg-white border border-taupe/15 rounded-xl p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-charcoal font-semibold">Wallet Credit</h3>
                      <div className="bg-gold/10 border border-gold/20 rounded-full px-3 py-1">
                        <span className="text-gold text-xs font-semibold">AED {walletBal.toLocaleString()} available</span>
                      </div>
                    </div>

                    <p className="text-taupe text-sm">Apply your wallet balance to reduce the amount due.</p>

                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <label className="block text-taupe text-xs mb-1.5">Amount to apply (AED)</label>
                        <input
                          type="number"
                          value={creditInput}
                          onChange={e => setCreditInput(e.target.value)}
                          min="0"
                          max={Math.min(walletBal, basePrice)}
                          step="0.01"
                          className="w-full bg-white border border-taupe/25 text-charcoal rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setCreditInput(String(Math.min(walletBal, basePrice)))}
                        className="mt-5 text-xs text-gold border border-gold/30 px-3 py-2.5 rounded-lg hover:bg-gold/10 transition-colors"
                      >
                        Use Max
                      </button>
                    </div>

                    {credit > 0 && (
                      <div className="flex items-center gap-2 text-emerald text-sm">
                        <span>✓</span>
                        <span>AED {credit.toLocaleString()} wallet credit will be applied</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Payment note */}
                <div className="bg-white border border-taupe/15 rounded-xl p-5">
                  <h3 className="text-charcoal font-semibold mb-3">Payment</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-taupe">{type === 'buynow' ? 'Buy Now Price' : 'Winning Bid'}</span>
                      <span className="text-charcoal font-medium">AED {basePrice.toLocaleString()}</span>
                    </div>
                    {credit > 0 && (
                      <div className="flex justify-between text-emerald">
                        <span>Wallet Credit</span>
                        <span>− AED {credit.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="border-t border-taupe/15 pt-3 flex justify-between font-bold">
                      <span className="text-charcoal text-base">Total Due</span>
                      <span className="text-gold text-xl">AED {totalDue.toLocaleString()}</span>
                    </div>
                  </div>

                  {totalDue > 0 && (
                    <p className="text-taupe text-xs mt-4 bg-taupe/10 rounded-lg px-4 py-3">
                      Remaining balance of AED {totalDue.toLocaleString()} will be invoiced and collected via bank transfer before dispatch.
                    </p>
                  )}
                  {totalDue === 0 && (
                    <p className="text-emerald text-xs mt-4 bg-emerald/5 border border-emerald/20 rounded-lg px-4 py-3">
                      ✓ Fully covered by your wallet credit. No additional payment required.
                    </p>
                  )}
                </div>

                {error && (
                  <div className="flex items-start gap-3 bg-burgundy/10 border border-burgundy/30 text-burgundy text-sm rounded-lg px-4 py-3">
                    <span className="mt-0.5 flex-shrink-0">⚠</span>
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gold text-almost-black font-bold py-4 rounded-xl text-base hover:bg-gold/90 disabled:opacity-50 transition-colors shadow-lg shadow-gold/10"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-almost-black/30 border-t-almost-black rounded-full animate-spin" />
                      Processing…
                    </span>
                  ) : (
                    `Confirm Order — AED ${totalDue.toLocaleString()}`
                  )}
                </button>

                <p className="text-taupe text-xs text-center">
                  By placing this order you agree to our terms of service. All sales are final once confirmed.
                </p>
              </form>
            )}
          </div>

          {/* ─── Right column: Order Summary ─── */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-taupe/15 rounded-xl overflow-hidden sticky top-6">
              {/* Product image */}
              {image && (
                <div className="aspect-[16/9] bg-taupe/10 overflow-hidden">
                  <img src={image} alt={product.name} className="w-full h-full object-cover" />
                </div>
              )}

              <div className="p-5 space-y-4">
                <div>
                  <p className="text-gold text-xs font-semibold uppercase tracking-widest">{product.brand}</p>
                  <h3 className="text-charcoal font-semibold mt-1 leading-snug">{product.name}</h3>
                  {product.conditionGrade && (
                    <p className="text-taupe text-xs mt-1">{GRADE_LABEL[product.conditionGrade] || product.conditionGrade}</p>
                  )}
                  {product.sourceCountry && (
                    <p className="text-taupe text-xs">From {product.sourceCountry}</p>
                  )}
                </div>

                <div className="border-t border-taupe/10 pt-4">
                  <div className="inline-flex items-center gap-2 bg-taupe/10 rounded-full px-3 py-1.5 text-xs">
                    <span className={`font-semibold ${type === 'buynow' ? 'text-gold' : 'text-emerald'}`}>
                      {type === 'buynow' ? 'Buy Now' : 'Auction Win'}
                    </span>
                    <span className="text-taupe/40">·</span>
                    <span className="text-charcoal font-bold">AED {basePrice.toLocaleString()}</span>
                  </div>
                </div>

                {/* Trust notes */}
                <div className="border-t border-taupe/10 pt-4 space-y-2.5">
                  {[
                    'Japan-sourced & authenticated',
                    'GCC delivery in 5–10 business days',
                    'Secure transaction',
                  ].map(note => (
                    <div key={note} className="flex items-center gap-2 text-xs text-taupe">
                      <span className="text-gold flex-shrink-0">◆</span>
                      <span>{note}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
