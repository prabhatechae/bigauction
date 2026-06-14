import { Link } from 'react-router-dom'

const VALUES = [
  {
    icon: (
      <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: 'Authenticity First',
    text: 'Every product on our platform is sourced directly from UAE Authorized Dealers and Distributors. No fakes, no grey market — only verified luxury.',
  },
  {
    icon: (
      <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
      </svg>
    ),
    title: 'Full Transparency',
    text: 'Open bidding, real-time leaderboards, and clear auction rules. You always know exactly where you stand — no hidden fees, no surprises.',
  },
  {
    icon: (
      <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
      </svg>
    ),
    title: 'Secure & Trusted',
    text: 'Payments are processed through a fully secured gateway. We are TDRA approved and compliant with UAE regulations — your data and money are always protected.',
  },
  {
    icon: (
      <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
    title: 'For Everyone',
    text: 'No bidding experience required. Our Manual and Auto Bid system makes it easy for anyone to compete and win — from first-timers to seasoned auction enthusiasts.',
  },
]

const DIFFERENTIATORS = [
  {
    num: '01',
    title: 'UAE Authorized Sources',
    text: 'Unlike other platforms, every item we list is procured directly from UAE-authorized dealers and distributors — guaranteeing genuine, dealer-certified luxury goods.',
    icon: (
      <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" strokeWidth="1.3" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Live Competitive Bidding',
    text: 'Our real-time auction engine puts the excitement back into buying luxury. Watch the leaderboard move, adjust your strategy on the fly, and feel the thrill of the win.',
    icon: (
      <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" strokeWidth="1.3" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Guaranteed Savings',
    text: 'Bidders consistently save up to 30% or more on the retail price of luxury items. Smart bidding means owning a Rolex or Hermès bag without paying full price.',
    icon: (
      <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" strokeWidth="1.3" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185z" />
      </svg>
    ),
  },
]

const STATS = [
  { value: '500+', label: 'Auctions Held' },
  { value: 'AED 2M+', label: 'Saved by Bidders' },
  { value: '10,000+', label: 'Registered Members' },
  { value: 'TDRA', label: 'Approved & Regulated' },
]

export default function AboutPage() {
  return (
    <div className="bg-ivory min-h-screen">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="bg-emerald relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #F2E7D5 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gold/30" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <p className="text-gold text-xs font-semibold tracking-[0.3em] uppercase mb-4">Who We Are</p>
          <h1 className="font-display text-ivory text-5xl sm:text-6xl font-bold leading-tight mb-5">
            About BigAuction.ae
          </h1>
          <p className="text-ivory/60 text-base max-w-xl mx-auto leading-relaxed">
            The UAE's most transparent and exciting platform for winning authentic luxury items through live, competitive bidding.
          </p>
        </div>
      </section>

      {/* ── OUR STORY ────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <p className="text-gold text-xs font-semibold tracking-[0.25em] uppercase mb-3">Our Story</p>
            <h2 className="font-display text-charcoal text-4xl font-semibold leading-tight mb-6">
              Making Luxury Accessible to Everyone
            </h2>
            <div className="space-y-4 text-taupe text-sm leading-relaxed">
              <p>
                BigAuction.ae was founded on a simple belief: owning a piece of genuine luxury should not be reserved for a privileged few. We set out to create a platform where anyone can compete fairly for authenticated high-end products — and actually win them at prices that make sense.
              </p>
              <p>
                Based in Dubai, we partner exclusively with UAE Authorized Dealers and Distributors to bring you products you can trust. Every item listed on our platform comes with full certification, making BigAuction.ae the most reliable luxury auction destination in the region.
              </p>
              <p>
                Our live bidding system is built for transparency and excitement. Whether you are a first-time bidder or a seasoned auction veteran, our platform is designed to give everyone a fair shot at winning.
              </p>
            </div>
          </div>

          {/* Visual block */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-emerald rounded-2xl p-6 flex flex-col justify-between min-h-[180px]">
              <svg className="w-8 h-8 text-gold/60" fill="none" stroke="currentColor" strokeWidth="1.3" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              <div>
                <p className="font-display text-ivory text-2xl font-bold">100%</p>
                <p className="text-ivory/50 text-xs mt-1">Authentic products from UAE Authorized Dealers</p>
              </div>
            </div>
            <div className="bg-gold/10 border border-gold/20 rounded-2xl p-6 flex flex-col justify-between min-h-[180px]">
              <svg className="w-8 h-8 text-gold/60" fill="none" stroke="currentColor" strokeWidth="1.3" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M8.25 21V9m0 0L4.5 5.25M8.25 9l3.75-3.75m3.75 15V9m0 0l3.75-3.75M15.75 9l-3.75-3.75" />
              </svg>
              <div>
                <p className="font-display text-charcoal text-2xl font-bold">Live</p>
                <p className="text-taupe text-xs mt-1">Real-time competitive bidding with open leaderboards</p>
              </div>
            </div>
            <div className="bg-charcoal rounded-2xl p-6 flex flex-col justify-between min-h-[180px]">
              <svg className="w-8 h-8 text-gold/60" fill="none" stroke="currentColor" strokeWidth="1.3" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185z" />
              </svg>
              <div>
                <p className="font-display text-ivory text-2xl font-bold">Up to 30%</p>
                <p className="text-ivory/50 text-xs mt-1">Savings guaranteed through smart bidding</p>
              </div>
            </div>
            <div className="bg-white border border-taupe/15 rounded-2xl p-6 flex flex-col justify-between min-h-[180px] shadow-luxury">
              <svg className="w-8 h-8 text-emerald/60" fill="none" stroke="currentColor" strokeWidth="1.3" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              <div>
                <p className="font-display text-charcoal text-2xl font-bold">TDRA</p>
                <p className="text-taupe text-xs mt-1">Approved & regulated — secure payments always</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────── */}
      <section className="bg-charcoal">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {STATS.map(s => (
              <div key={s.label}>
                <p className="font-display text-gold text-4xl font-bold">{s.value}</p>
                <p className="text-ivory/50 text-xs uppercase tracking-widest mt-2">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT MAKES US DIFFERENT ──────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <p className="text-gold text-xs font-semibold tracking-[0.25em] uppercase mb-3">Why BigAuction</p>
          <h2 className="font-display text-charcoal text-4xl font-semibold">What Makes Us Different</h2>
          <div className="mt-4 flex items-center justify-center gap-3">
            <div className="h-px w-12 bg-gold/30" />
            <span className="text-gold text-xs">◆</span>
            <div className="h-px w-12 bg-gold/30" />
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {DIFFERENTIATORS.map(d => (
            <div key={d.num} className="bg-white border border-taupe/15 rounded-2xl p-8 shadow-luxury hover:shadow-luxury-hover hover:border-gold/30 transition-all group">
              <div className="flex items-start justify-between mb-5">
                <div className="w-14 h-14 rounded-xl bg-emerald/5 border border-emerald/15 flex items-center justify-center group-hover:bg-emerald/10 transition-colors">
                  {d.icon}
                </div>
                <span className="font-display text-gold/15 text-5xl font-bold leading-none select-none">{d.num}</span>
              </div>
              <h3 className="font-display text-charcoal text-xl font-semibold mb-3">{d.title}</h3>
              <p className="text-taupe text-sm leading-relaxed">{d.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── OUR VALUES ───────────────────────────────────────── */}
      <section className="bg-white border-y border-taupe/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-14">
            <p className="text-gold text-xs font-semibold tracking-[0.25em] uppercase mb-3">What We Stand For</p>
            <h2 className="font-display text-charcoal text-4xl font-semibold">Our Values</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {VALUES.map(v => (
              <div key={v.title} className="flex gap-5 items-start p-6 rounded-2xl border border-taupe/10 hover:border-gold/25 hover:shadow-luxury transition-all">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gold/8 border border-gold/15 flex items-center justify-center">
                  {v.icon}
                </div>
                <div>
                  <h3 className="text-charcoal font-semibold text-base mb-2">{v.title}</h3>
                  <p className="text-taupe text-sm leading-relaxed">{v.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="bg-emerald">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <p className="text-gold text-xs font-semibold tracking-[0.3em] uppercase mb-4">Join the Community</p>
          <h2 className="font-display text-ivory text-4xl sm:text-5xl font-bold leading-tight mb-4">
            Ready to Experience<br />Luxury Differently?
          </h2>
          <p className="text-ivory/60 text-sm max-w-md mx-auto leading-relaxed mb-10">
            Register for free, explore our upcoming auctions, and place your first bid today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register" className="btn-shimmer bg-gold-gradient text-almost-black font-bold px-8 py-3.5 rounded text-sm hover:opacity-90 transition-opacity uppercase tracking-wide">
              Create Free Account
            </Link>
            <Link to="/how-it-works" className="border border-ivory/30 text-ivory font-semibold px-8 py-3.5 rounded text-sm hover:border-ivory/60 hover:bg-white/5 transition-colors uppercase tracking-wide">
              How It Works
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
