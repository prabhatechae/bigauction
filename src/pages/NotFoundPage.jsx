import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-gold text-8xl font-bold mb-4">404</p>
        <h1 className="text-ivory text-2xl font-semibold mb-3">Page Not Found</h1>
        <p className="text-taupe mb-8">The page you're looking for doesn't exist.</p>
        <Link
          to="/"
          className="bg-gold text-almost-black font-semibold px-6 py-2.5 rounded-lg hover:bg-gold/90 transition-colors"
        >
          Back to Marketplace
        </Link>
      </div>
    </div>
  )
}
