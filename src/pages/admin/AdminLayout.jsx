import { NavLink, Outlet, Link } from 'react-router-dom'

const LINKS = [
  { to: '/admin',            label: 'Dashboard',  end: true },
  { to: '/admin/products',   label: 'Products' },
  { to: '/admin/auctions',   label: 'Auctions' },
  { to: '/admin/orders',     label: 'Orders' },
  { to: '/admin/deposits',   label: 'Deposits' },
  { to: '/admin/users',      label: 'Users' },
  { to: '/admin/reports',    label: 'Reports' },
  { to: '/admin/categories', label: 'Categories' },
]

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-ivory">

      {/* ── Emerald admin header ── */}
      <div className="bg-emerald">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Brand row */}
          <div className="flex items-center gap-3 pt-5 pb-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-ivory font-semibold text-sm leading-tight">Admin Panel</p>
              <p className="text-ivory/50 text-[10px] uppercase tracking-[0.2em]">BigAuction.ae</p>
            </div>
            <Link
              to="/"
              className="ml-auto text-ivory/50 hover:text-ivory text-xs transition-colors flex items-center gap-1"
            >
              ← Back to site
            </Link>
          </div>

          {/* Nav tabs */}
          <div className="flex overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {LINKS.map(l => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `flex-shrink-0 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                    isActive
                      ? 'text-gold border-gold'
                      : 'text-ivory/55 border-transparent hover:text-ivory hover:border-ivory/30'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>

      {/* ── Page content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </div>

    </div>
  )
}
