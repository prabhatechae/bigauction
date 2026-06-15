import { useState } from 'react'
import { Link } from 'react-router-dom'

const FAQS = [
  {
    category: 'General',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
      </svg>
    ),
    items: [
      {
        q: 'What is BigAuction.ae?',
        a: 'BigAuction.ae is the UAE\'s leading live auction platform for authentic luxury goods. We connect buyers with genuine products sourced directly from UAE Authorized Dealers and Distributors — including watches, handbags, jewellery, and more.',
      },
      {
        q: 'Is BigAuction.ae available across the UAE?',
        a: 'Yes. BigAuction.ae is fully online and accessible from anywhere in the UAE. Product delivery is available across the UAE, and in future we plan to expand to Saudi Arabia, Kuwait and the wider GCC.',
      },
      {
        q: 'Are the products genuine?',
        a: 'Absolutely. Every product listed on our platform is sourced exclusively from UAE-authorized dealers and distributors. All items are 100% genuine and come with full dealer certification. We are TDRA approved and take authenticity extremely seriously.',
      },
      {
        q: 'Do I need an account to browse?',
        a: 'You can browse upcoming and live auctions without an account. However, to purchase a ticket or place bids, you will need to create a free account.',
      },
    ],
  },
  {
    category: 'Tickets',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a3 3 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
      </svg>
    ),
    items: [
      {
        q: 'What is a ticket and why do I need one?',
        a: 'A ticket is your entry pass to an auction. Each auction has a fixed ticket price (e.g. AED 25). Purchasing a ticket gives you the right to participate and place bids in that specific auction. Only ticket holders can bid.',
      },
      {
        q: 'How much does a ticket cost?',
        a: 'Ticket prices vary by auction and are clearly displayed on each product listing. You can find the ticket price on the product card before purchase.',
      },
      {
        q: 'Can I buy more than one ticket per auction?',
        a: 'No. Each registered user can purchase one ticket per auction. This ensures fair competition for all participants.',
      },
      {
        q: 'What happens if the auction is cancelled?',
        a: 'In the unlikely event an auction is cancelled, your ticket payment will be refunded in full to your wallet or original payment method.',
      },
      {
        q: 'Can I get a refund on my ticket?',
        a: 'Tickets are generally non-refundable once an auction is live. If the auction has not yet started, please contact our support team and we will assess on a case-by-case basis.',
      },
    ],
  },
  {
    category: 'Bidding',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M8.25 21V9m0 0L4.5 5.25M8.25 9l3.75-3.75m3.75 15V9m0 0l3.75-3.75M15.75 9l-3.75-3.75" />
      </svg>
    ),
    items: [
      {
        q: 'What is the difference between Manual and Auto Bid?',
        a: 'Manual Bid lets you place each bid yourself in real-time during the live auction. Auto Bid allows you to set a Maximum Bid Limit and Bid Increment — the system will then bid automatically on your behalf up to that limit. You can switch between the two modes at any time during the auction.',
      },
      {
        q: 'What is a Bid Increment?',
        a: 'A Bid Increment is the minimum amount by which each new bid must exceed the previous one. For example, if the current bid is AED 1,000 and the increment is AED 50, the next valid bid would be AED 1,050.',
      },
      {
        q: 'Can I change my bid or strategy during a live auction?',
        a: 'Yes. You can switch between Manual and Auto Bid at any time, and adjust your Maximum Bid Limit and Bid Increment freely while the auction is live.',
      },
      {
        q: 'What happens if two people bid the same amount?',
        a: 'The bid that was placed first takes precedence. Our system uses precise timestamps to determine the order of identical bids.',
      },
      {
        q: 'Is there a minimum bid amount?',
        a: 'Yes. The minimum starting bid and any subsequent bids must meet or exceed the current highest bid plus the set Bid Increment for that auction.',
      },
    ],
  },
  {
    category: 'Payments',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
      </svg>
    ),
    items: [
      {
        q: 'What payment methods are accepted?',
        a: 'We accept Visa and Mastercard through our fully secured payment gateway. Wallet credits can also be applied to ticket purchases and auction wins.',
      },
      {
        q: 'Is my payment information safe?',
        a: 'Yes. All payments are processed through a PCI-DSS compliant, fully secured payment gateway. We do not store your card details on our servers. BigAuction.ae is TDRA approved and meets all UAE regulatory requirements.',
      },
      {
        q: 'What is the Wallet and how does it work?',
        a: 'Your BigAuction Wallet is a digital balance you can top up and use to pay for tickets and winning bids. It offers a faster, seamless checkout experience within the platform.',
      },
      {
        q: 'When is the winning bid charged?',
        a: 'The winning bid amount is charged at the end of the auction. You will receive a notification and will be prompted to complete payment through our secure gateway or your wallet balance.',
      },
      {
        q: 'Are there any hidden fees?',
        a: 'No. The price you bid is the price you pay. There are no hidden fees, buyer\'s premiums, or unexpected charges on BigAuction.ae.',
      },
    ],
  },
  {
    category: 'Delivery & Pickup',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
    items: [
      {
        q: 'How do I receive my item after winning?',
        a: 'After winning and completing payment, you can choose to either pick up your item from the Authorized Dealer or Distributor, or have it delivered directly to your address in the UAE.',
      },
      {
        q: 'How long does delivery take?',
        a: 'Delivery timelines depend on the product and dealer. Standard delivery within the UAE typically takes 3–7 business days. You will be notified by our team once your order is dispatched.',
      },
      {
        q: 'Is there a delivery charge?',
        a: 'Delivery charges, if applicable, will be displayed at checkout. Many of our products include free UAE-wide delivery.',
      },
      {
        q: 'Can I pick up my item in person?',
        a: 'Yes. You can choose to collect your item directly from the Authorized Dealer or Distributor at a time convenient for you. The pickup location and instructions will be shared after payment is confirmed.',
      },
    ],
  },
  {
    category: 'Account & Profile',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
    items: [
      {
        q: 'How do I create an account?',
        a: 'Click "Create Account" in the top-right corner of any page. Fill in your name, email address, and phone number, then set a password. Registration is completely free.',
      },
      {
        q: 'Can I update my profile details?',
        a: 'Yes. Visit your Profile page (accessible from the top-right menu when logged in) to update your name and phone number at any time.',
      },
      {
        q: 'I forgot my password. What should I do?',
        a: 'Click "Login" and then "Forgot Password". Enter your registered email address and we will send you a link to reset your password.',
      },
      {
        q: 'Where can I see my tickets and bids?',
        a: 'All your tickets, bids, and orders are visible under your Profile page. Navigate to the "My Tickets", "My Bids", or "My Orders" tabs to see a full history.',
      },
    ],
  },
]

function AccordionItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-taupe/10 last:border-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 py-4 text-left group"
      >
        <span className={`text-sm font-medium transition-colors ${open ? 'text-emerald' : 'text-charcoal group-hover:text-emerald'}`}>
          {q}
        </span>
        <span className={`flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
          open ? 'border-emerald bg-emerald text-ivory rotate-45' : 'border-taupe/30 text-taupe group-hover:border-emerald group-hover:text-emerald'
        }`}>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </span>
      </button>
      {open && (
        <div className="pb-4 pr-10">
          <p className="text-taupe text-sm leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  )
}

function CategorySection({ category, icon, items }) {
  return (
    <div id={category.toLowerCase().replace(/\s+/g, '-')} className="bg-white border border-taupe/15 rounded-2xl shadow-luxury overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-taupe/10 bg-ivory/60">
        <div className="w-7 h-7 rounded-lg bg-emerald/10 border border-emerald/20 flex items-center justify-center text-emerald">
          {icon}
        </div>
        <h2 className="text-charcoal font-semibold text-sm uppercase tracking-wide">{category}</h2>
        <span className="ml-auto text-taupe text-xs">{items.length} questions</span>
      </div>
      <div className="px-6">
        {items.map((item, i) => (
          <AccordionItem key={i} q={item.q} a={item.a} />
        ))}
      </div>
    </div>
  )
}

export default function HelpPage() {
  const [search, setSearch] = useState('')

  const filtered = FAQS.map(cat => ({
    ...cat,
    items: cat.items.filter(item =>
      !search.trim() ||
      item.q.toLowerCase().includes(search.toLowerCase()) ||
      item.a.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter(cat => cat.items.length > 0)

  const totalResults = filtered.reduce((n, c) => n + c.items.length, 0)

  return (
    <div className="bg-ivory min-h-screen">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="bg-emerald relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #F2E7D5 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gold/30" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 text-center">
          <p className="text-gold text-xs font-semibold tracking-[0.3em] uppercase mb-4">Help Centre</p>
          <h1 className="font-display text-ivory text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-5">
            How Can We Help?
          </h1>
          <p className="text-ivory/60 text-sm mb-8">Search our FAQs or browse by topic below.</p>

          {/* Search */}
          <div className="relative max-w-xl mx-auto">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-taupe" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search questions…"
              className="w-full bg-white text-charcoal placeholder-taupe/50 text-sm rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-gold/40 shadow-md"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-taupe hover:text-charcoal transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── QUICK NAV ────────────────────────────────────────── */}
      <div className="sticky top-16 z-40 bg-white/95 backdrop-blur-sm border-b border-taupe/10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto py-3" style={{ scrollbarWidth: 'none' }}>
            {FAQS.map(cat => (
              <a
                key={cat.category}
                href={`#${cat.category.toLowerCase().replace(/\s+/g, '-')}`}
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-taupe hover:text-emerald hover:bg-emerald/5 border border-taupe/20 hover:border-emerald/30 transition-all"
              >
                <span className="text-emerald">{cat.icon}</span>
                {cat.category}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── FAQ CONTENT ──────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">

        {search && (
          <p className="text-taupe text-sm">
            {totalResults > 0
              ? `${totalResults} result${totalResults !== 1 ? 's' : ''} for "${search}"`
              : `No results for "${search}"`
            }
          </p>
        )}

        {filtered.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <div className="w-16 h-16 rounded-full bg-taupe/10 flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-taupe/40" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803z" />
              </svg>
            </div>
            <p className="text-charcoal font-semibold">No results found</p>
            <p className="text-taupe text-sm">Try a different search term or browse the topics above.</p>
            <button onClick={() => setSearch('')} className="text-gold text-sm hover:underline">
              Clear search
            </button>
          </div>
        ) : (
          filtered.map(cat => (
            <CategorySection key={cat.category} category={cat.category} icon={cat.icon} items={cat.items} />
          ))
        )}
      </section>

      {/* ── STILL NEED HELP ──────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-charcoal rounded-2xl p-8 sm:p-10 flex flex-col sm:flex-row items-center gap-8">
          <div className="flex-1 text-center sm:text-left">
            <h3 className="font-display text-ivory text-2xl font-semibold mb-2">Still need help?</h3>
            <p className="text-ivory/50 text-sm leading-relaxed">
              Our team is here for you. Reach out and we'll get back to you as quickly as possible.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <a
              href="mailto:hello@bigauction.ae"
              className="flex items-center gap-2 bg-gold-gradient text-almost-black font-bold px-6 py-3 rounded text-sm hover:opacity-90 transition-opacity uppercase tracking-wide"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              Email Us
            </a>
            <a
              href="https://wa.me/97150123456"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 border border-ivory/20 text-ivory font-semibold px-6 py-3 rounded text-sm hover:border-ivory/40 hover:bg-white/5 transition-colors uppercase tracking-wide"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </a>
          </div>
        </div>
      </section>

    </div>
  )
}
