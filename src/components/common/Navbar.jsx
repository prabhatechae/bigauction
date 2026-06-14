import { Fragment, useEffect } from 'react'
import logo from '../../assets/bid-auction.png'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { logout } from '../../features/auth/authSlice'
import { fetchWallet } from '../../features/wallet/walletSlice'

const NAV_LINKS = [
  { label: 'Auctions',     to: '/auctions' },
  { label: 'How It Works', to: '/how-it-works' },
  { label: 'Winners',      to: '/winners' },
  { label: 'About Us',     to: '/about' },
  { label: 'Help',         to: '/help' },
]

const USER_MENU = [
  { label: 'My Profile', to: '/profile' },
  { label: 'My Wallet',  to: '/wallet' },
  { label: 'My Orders',  to: '/orders' },
]

function HamburgerIcon({ open }) {
  return (
    <span className="flex flex-col justify-center items-center w-6 h-6 gap-1.5">
      <span className={`block h-0.5 w-6 bg-charcoal transition-all duration-300 ${open ? 'rotate-45 translate-y-2' : ''}`} />
      <span className={`block h-0.5 w-6 bg-charcoal transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
      <span className={`block h-0.5 w-6 bg-charcoal transition-all duration-300 ${open ? '-rotate-45 -translate-y-2' : ''}`} />
    </span>
  )
}

export default function Navbar() {
  const dispatch   = useDispatch()
  const navigate   = useNavigate()
  const { user }   = useSelector(s => s.auth)
  const { wallet } = useSelector(s => s.wallet)

  useEffect(() => { if (user) dispatch(fetchWallet()) }, [user])

  const handleLogout = () => { dispatch(logout()); navigate('/') }

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  return (
    <Disclosure as="nav" className="bg-white border-b border-taupe/15 sticky top-0 z-50">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">

              {/* Logo */}
              <Link to="/" className="flex-shrink-0">
                <img src={logo} alt="Big Auction" className="h-9 w-auto" />
              </Link>

              {/* Desktop nav */}
              <div className="hidden lg:flex items-center gap-1">
                {NAV_LINKS.map(l => (
                  <NavLink
                    key={l.label}
                    to={l.to}
                    className={({ isActive }) =>
                      `relative text-sm font-medium px-3 py-2 rounded-lg transition-colors ${
                        isActive
                          ? 'text-emerald bg-emerald/6'
                          : 'text-charcoal hover:text-emerald hover:bg-emerald/5'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {l.label}
                        {isActive && (
                          <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-emerald rounded-full" />
                        )}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>

              {/* Right side */}
              <div className="flex items-center gap-3">

                {/* Language */}
                <div className="hidden sm:flex items-center gap-1 text-charcoal text-sm font-medium select-none">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253M3 12c0 .778.099 1.533.284 2.253" />
                  </svg>
                  <span>EN</span>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {user ? (
                  <>
                    <Link to="/wallet" className="hidden sm:block text-sm text-charcoal font-medium hover:text-emerald transition-colors">
                      AED {wallet ? Number(wallet.balance).toLocaleString() : '0'}
                    </Link>

                    <Menu as="div" className="relative">
                      <Menu.Button className="w-9 h-9 rounded-full bg-emerald text-ivory text-sm font-semibold flex items-center justify-center hover:ring-2 hover:ring-gold transition-all">
                        {initials}
                      </Menu.Button>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
                        leave="transition ease-in duration-75"  leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 mt-2 w-48 bg-white border border-taupe/20 rounded-lg shadow-xl focus:outline-none overflow-hidden">
                          <div className="px-4 py-3 border-b border-taupe/20">
                            <p className="text-charcoal text-sm font-medium truncate">{user.name}</p>
                            <p className="text-taupe text-xs truncate">{user.email}</p>
                          </div>
                          {USER_MENU.map(item => (
                            <Menu.Item key={item.to}>
                              {({ active }) => (
                                <Link to={item.to} className={`block px-4 py-2.5 text-sm transition-colors ${active ? 'bg-taupe/10 text-gold' : 'text-charcoal'}`}>
                                  {item.label}
                                </Link>
                              )}
                            </Menu.Item>
                          ))}
                          {user.role === 'ADMIN' && (
                            <Menu.Item>
                              {({ active }) => (
                                <Link to="/admin" className={`block px-4 py-2.5 text-sm border-t border-taupe/20 transition-colors ${active ? 'bg-taupe/10 text-gold' : 'text-gold/80'}`}>
                                  Admin Panel
                                </Link>
                              )}
                            </Menu.Item>
                          )}
                          <Menu.Item>
                            {({ active }) => (
                              <button onClick={handleLogout} className={`w-full text-left px-4 py-2.5 text-sm border-t border-taupe/20 transition-colors ${active ? 'bg-taupe/10 text-burgundy' : 'text-taupe'}`}>
                                Sign Out
                              </button>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </>
                ) : (
                  <div className="hidden sm:flex items-center gap-2">
                    <Link to="/login" className="text-sm font-semibold text-charcoal hover:text-emerald transition-colors px-3 py-1.5 uppercase tracking-wide">
                      Login
                    </Link>
                    <Link to="/register" className="text-sm font-bold bg-emerald text-ivory px-5 py-2 rounded hover:bg-emerald/90 transition-colors uppercase tracking-wide">
                      Create Account
                    </Link>
                  </div>
                )}

                {/* Hamburger */}
                <Disclosure.Button className="lg:hidden p-1 rounded">
                  <HamburgerIcon open={open} />
                </Disclosure.Button>
              </div>
            </div>
          </div>

          {/* Mobile panel */}
          <Disclosure.Panel className="lg:hidden border-t border-taupe/20 bg-white">
            <div className="px-4 py-3 space-y-1">
              {NAV_LINKS.map(l => (
                <NavLink key={l.label} to={l.to}>
                  {({ isActive }) => (
                    <Disclosure.Button
                      as="span"
                      className={`block px-3 py-2 rounded text-sm transition-colors cursor-pointer ${
                        isActive ? 'text-emerald bg-emerald/6 font-medium' : 'text-charcoal hover:bg-taupe/10'
                      }`}
                    >
                      {l.label}
                    </Disclosure.Button>
                  )}
                </NavLink>
              ))}
              {!user ? (
                <div className="border-t border-taupe/20 pt-3 mt-2 space-y-2">
                  <Disclosure.Button as={Link} to="/login" className="block px-3 py-2 text-sm text-center font-semibold text-charcoal border border-taupe/30 rounded">
                    Login
                  </Disclosure.Button>
                  <Disclosure.Button as={Link} to="/register" className="block px-3 py-2 text-sm text-center font-bold bg-emerald text-ivory rounded">
                    Create Account
                  </Disclosure.Button>
                </div>
              ) : (
                <>
                  <div className="border-t border-taupe/20 pt-2 mt-2 space-y-1">
                    {USER_MENU.map(item => (
                      <Disclosure.Button key={item.to} as={Link} to={item.to}
                        className="block px-3 py-2 rounded text-sm text-charcoal hover:bg-taupe/10 transition-colors"
                      >
                        {item.label}
                      </Disclosure.Button>
                    ))}
                    {user.role === 'ADMIN' && (
                      <Disclosure.Button as={Link} to="/admin" className="block px-3 py-2 rounded text-sm text-gold hover:bg-taupe/10 transition-colors">
                        Admin Panel
                      </Disclosure.Button>
                    )}
                  </div>
                  <div className="border-t border-taupe/20 pt-2 mt-2">
                    <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded text-sm text-taupe hover:bg-taupe/10 transition-colors">
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}
