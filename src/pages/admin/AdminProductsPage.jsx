import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../../features/products/productsSlice'
import { fetchAuctions, createAuction } from '../../features/auctions/auctionsSlice'
import { fetchCategories } from '../../features/categories/categoriesSlice'
import { uploadImage } from '../../services/api'
import Loader from '../../components/common/Loader'

const EMPTY_PRODUCT = {
  brand: '', name: '', categoryId: '', description: '', conditionGrade: 'EXCELLENT',
  buyNowPrice: '', wearNotes: '', sourceCountry: '', authenticationNote: '',
  modelName: '', serialNumber: '', yearOfManufacture: '',
  authenticationStatus: 'PENDING', certificateNumber: '', provenance: '',
  includesBox: false, includesDustBag: false, includesAuthCard: false,
  includesWarrantyCard: false, includesOriginalReceipt: false,
}

const CONDITION_GRADES = ['LIKE_NEW', 'EXCELLENT', 'VERY_GOOD', 'GOOD', 'FAIR']
const AUTH_STATUSES = ['PENDING', 'AUTHENTICATED', 'NOT_REQUIRED']

function Field({ label, name, value, onChange, type = 'text', as, options, className = '' }) {
  const cls = `w-full bg-white border border-taupe/30 text-charcoal placeholder-taupe/40 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold transition-colors ${className}`
  if (as === 'textarea') return (
    <div>
      <label className="block text-taupe text-xs mb-1">{label}</label>
      <textarea name={name} value={value} onChange={onChange} rows={3} className={cls} />
    </div>
  )
  if (as === 'select') return (
    <div>
      <label className="block text-taupe text-xs mb-1">{label}</label>
      <select name={name} value={value} onChange={onChange} className={cls}>
        {options.map(o => <option key={o} value={o}>{o.replace('_', ' ')}</option>)}
      </select>
    </div>
  )
  return (
    <div>
      <label className="block text-taupe text-xs mb-1">{label}</label>
      <input type={type} name={name} value={value} onChange={onChange} className={cls} />
    </div>
  )
}

function ProductModal({ product, onClose, onSaved }) {
  const dispatch = useDispatch()
  const { loading } = useSelector(s => s.products)
  const { items: categories } = useSelector(s => s.categories)
  const matchedCategoryId = product ? (categories.find(c => c.name === product.category)?.id ?? '') : ''
  const [form, setForm] = useState(product ? { ...product, categoryId: matchedCategoryId } : { ...EMPTY_PRODUCT })
  const [imageUrls, setImageUrls] = useState(product?.imageUrls ?? [])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const fileRef = useRef()

  const onChange = e => {
    const { name, type, value, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const onFileChange = async e => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    setUploading(true)
    setError(null)
    try {
      const urls = await Promise.all(files.map(f => uploadImage(f)))
      setImageUrls(prev => [...prev, ...urls])
    } catch (err) {
      setError(err.message || 'Image upload failed')
    } finally {
      setUploading(false)
      fileRef.current.value = ''
    }
  }

  const removeImage = url => setImageUrls(prev => prev.filter(u => u !== url))

  const onSubmit = async e => {
    e.preventDefault()
    setError(null)
    try {
      const payload = {
        ...form,
        imageUrls,
        categoryId:  form.categoryId  ? Number(form.categoryId)  : null,
        buyNowPrice: form.buyNowPrice  ? Number(form.buyNowPrice) : null,
      }
      if (product) {
        await dispatch(updateProduct({ id: product.id, data: payload })).unwrap()
      } else {
        await dispatch(createProduct(payload)).unwrap()
      }
      onSaved()
    } catch (err) {
      setError(err || 'Failed to save')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-almost-black/80">
      <div className="bg-white border border-taupe/15 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-charcoal font-semibold">{product ? 'Edit Product' : 'Add Product'}</h3>
          <button onClick={onClose} className="text-taupe hover:text-charcoal text-xl">×</button>
        </div>

        {error && <div className="bg-burgundy/10 border border-burgundy/30 text-burgundy text-sm rounded-lg px-4 py-3 mb-4">{error}</div>}

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Brand *" name="brand" value={form.brand} onChange={onChange} />
            <Field label="Name *"  name="name"  value={form.name}  onChange={onChange} />
          </div>
          <div>
            <label className="block text-taupe text-xs mb-1">Category *</label>
            <select
              name="categoryId"
              value={form.categoryId}
              onChange={onChange}
              className="w-full bg-white border border-taupe/30 text-charcoal rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold transition-colors"
            >
              <option value="">Select a category</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Model Name" name="modelName" value={form.modelName} onChange={onChange} />
            <Field label="Year of Manufacture" name="yearOfManufacture" value={form.yearOfManufacture} onChange={onChange} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Serial Number" name="serialNumber" value={form.serialNumber} onChange={onChange} />
            <Field label="Certificate Number" name="certificateNumber" value={form.certificateNumber} onChange={onChange} />
          </div>
          <Field label="Description" name="description" value={form.description} onChange={onChange} as="textarea" />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Condition" name="conditionGrade" value={form.conditionGrade} onChange={onChange} as="select" options={CONDITION_GRADES} />
            <Field label="Authentication Status" name="authenticationStatus" value={form.authenticationStatus} onChange={onChange} as="select" options={AUTH_STATUSES} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Buy Now Price (AED)" name="buyNowPrice" value={form.buyNowPrice} onChange={onChange} type="number" />
            <Field label="Source Country" name="sourceCountry" value={form.sourceCountry} onChange={onChange} />
          </div>
          <Field label="Provenance" name="provenance" value={form.provenance} onChange={onChange} as="textarea" />
          <Field label="Authentication Note" name="authenticationNote" value={form.authenticationNote} onChange={onChange} as="textarea" />
          <Field label="Wear Notes" name="wearNotes" value={form.wearNotes} onChange={onChange} as="textarea" />

          <div>
            <p className="text-taupe text-xs mb-2">Inclusions</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                ['includesBox', 'Original Box'],
                ['includesDustBag', 'Dust Bag'],
                ['includesAuthCard', 'Auth Card'],
                ['includesWarrantyCard', 'Warranty Card'],
                ['includesOriginalReceipt', 'Original Receipt'],
              ].map(([name, label]) => (
                <label key={name} className="flex items-center gap-2 text-charcoal text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    name={name}
                    checked={form[name]}
                    onChange={onChange}
                    className="accent-gold w-4 h-4"
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          <div>
            <p className="text-taupe text-xs mb-2">Images</p>
            {imageUrls.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {imageUrls.map(url => (
                  <div key={url} className="relative w-20 h-20 rounded-lg overflow-hidden border border-taupe/30">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(url)}
                      className="absolute top-0.5 right-0.5 bg-burgundy text-ivory text-xs w-5 h-5 rounded-full flex items-center justify-center leading-none"
                    >×</button>
                  </div>
                ))}
              </div>
            )}
            <label className="flex items-center gap-2 cursor-pointer w-fit">
              <span className="text-xs bg-white border border-taupe/30 text-taupe hover:text-charcoal px-3 py-1.5 rounded-lg transition-colors">
                {uploading ? 'Uploading…' : '+ Add Images'}
              </span>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={onFileChange}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="text-taupe text-sm hover:text-charcoal transition-colors px-4 py-2">Cancel</button>
            <button type="submit" disabled={loading || uploading} className="bg-gold text-almost-black font-semibold px-6 py-2 rounded-lg hover:bg-gold/90 disabled:opacity-50 text-sm transition-colors">
              {loading ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function AuctionModal({ product, onClose }) {
  const dispatch = useDispatch()
  const { loading } = useSelector(s => s.auctions)
  const [form, setForm] = useState({
    ticketPrice: '', ticketTarget: '', scheduledStartTime: '', scheduledEndTime: '',
    startCondition: 'ALL_TICKETS_SOLD',
    buyNowEnabled: false,
    buyNowActivationRule: 'IMMEDIATE',
    buyNowActivationTime: '', buyNowActivationThreshold: '',
    estimateLow: '', estimateHigh: '', reservePrice: '', bidIncrement: '',
  })
  const [error, setError] = useState(null)

  const onChange = e => {
    const { name, type, value, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const onSubmit = async e => {
    e.preventDefault()
    setError(null)
    try {
      const payload = {
        ...form,
        productId:    product.id,
        ticketPrice:  form.ticketPrice  ? Number(form.ticketPrice)  : null,
        ticketTarget: form.ticketTarget ? Number(form.ticketTarget) : null,
        estimateLow:  form.estimateLow  ? Number(form.estimateLow)  : null,
        estimateHigh: form.estimateHigh ? Number(form.estimateHigh) : null,
        reservePrice: form.reservePrice ? Number(form.reservePrice) : null,
        bidIncrement: form.bidIncrement ? Number(form.bidIncrement) : null,
        buyNowActivationTime: form.buyNowActivationRule === 'TIME_BASED' && form.buyNowActivationTime ? form.buyNowActivationTime : null,
        buyNowActivationThreshold: form.buyNowActivationRule === 'THRESHOLD_BASED' && form.buyNowActivationThreshold ? Number(form.buyNowActivationThreshold) : null,
      }
      await dispatch(createAuction(payload)).unwrap()
      onClose()
    } catch (err) {
      setError(typeof err === 'string' ? err : err?.message || 'Failed to create auction')
    }
  }

  const selectCls = 'w-full bg-white border border-taupe/30 text-charcoal rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-almost-black/80">
      <div className="bg-white border border-taupe/15 rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-charcoal font-semibold">Create Auction — {product.name}</h3>
          <button onClick={onClose} className="text-taupe hover:text-charcoal text-xl">×</button>
        </div>

        {error && <div className="bg-burgundy/10 border border-burgundy/30 text-burgundy text-sm rounded-lg px-4 py-3 mb-4">{typeof error === 'string' ? error : JSON.stringify(error)}</div>}

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Ticket Price (AED) *" name="ticketPrice" value={form.ticketPrice} onChange={onChange} type="number" />
            <Field label="Ticket Target *"       name="ticketTarget" value={form.ticketTarget} onChange={onChange} type="number" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Estimate Low (AED)"  name="estimateLow"  value={form.estimateLow}  onChange={onChange} type="number" />
            <Field label="Estimate High (AED)" name="estimateHigh" value={form.estimateHigh} onChange={onChange} type="number" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Reserve Price (AED)" name="reservePrice" value={form.reservePrice} onChange={onChange} type="number" />
            <Field label="Bid Increment (AED)" name="bidIncrement" value={form.bidIncrement} onChange={onChange} type="number" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Scheduled Start" name="scheduledStartTime" value={form.scheduledStartTime} onChange={onChange} type="datetime-local" />
            <Field label="Scheduled End"   name="scheduledEndTime"   value={form.scheduledEndTime}   onChange={onChange} type="datetime-local" />
          </div>

          <div>
            <label className="block text-taupe text-xs mb-1">Start Condition *</label>
            <select name="startCondition" value={form.startCondition} onChange={onChange} className={selectCls}>
              <option value="ALL_TICKETS_SOLD">All Tickets Sold</option>
              <option value="SCHEDULED">Scheduled Time</option>
              <option value="ADMIN_TRIGGERED">Manual (Admin Triggers)</option>
            </select>
          </div>

          {/* Buy Now */}
          <div className="border border-taupe/15 rounded-xl p-4 space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="buyNowEnabled" checked={form.buyNowEnabled} onChange={onChange} className="accent-gold w-4 h-4" />
              <span className="text-charcoal text-sm font-medium">Enable Buy Now</span>
            </label>

            {form.buyNowEnabled && (
              <>
                <div>
                  <label className="block text-taupe text-xs mb-1">Buy Now Activation Rule</label>
                  <select name="buyNowActivationRule" value={form.buyNowActivationRule} onChange={onChange} className={selectCls}>
                    <option value="IMMEDIATE">Immediate (always available)</option>
                    <option value="TIME_BASED">Time-based (after a specific date)</option>
                    <option value="THRESHOLD_BASED">Threshold-based (after X% tickets sold)</option>
                  </select>
                </div>
                {form.buyNowActivationRule === 'TIME_BASED' && (
                  <Field label="Activate Buy Now After" name="buyNowActivationTime" value={form.buyNowActivationTime} onChange={onChange} type="datetime-local" />
                )}
                {form.buyNowActivationRule === 'THRESHOLD_BASED' && (
                  <Field label="Activate After % Tickets Sold (0–100)" name="buyNowActivationThreshold" value={form.buyNowActivationThreshold} onChange={onChange} type="number" />
                )}
              </>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="text-taupe text-sm hover:text-charcoal px-4 py-2">Cancel</button>
            <button type="submit" disabled={loading} className="bg-emerald text-ivory font-semibold px-6 py-2 rounded-lg hover:bg-emerald/90 disabled:opacity-50 text-sm transition-colors">
              {loading ? 'Creating…' : 'Create Auction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AdminProductsPage() {
  const dispatch = useDispatch()
  const { items, loading } = useSelector(s => s.products)

  const [showModal, setShowModal] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [auctionTarget, setAuctionTarget] = useState(null)

  useEffect(() => {
    dispatch(fetchProducts())
    dispatch(fetchAuctions())
    dispatch(fetchCategories())
  }, [])

  const onDelete = async id => {
    if (!window.confirm('Delete this product?')) return
    dispatch(deleteProduct(id))
  }

  if (loading) return <Loader text="Loading products…" />

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-6 w-1 bg-emerald rounded-full" />
          <h2 className="font-display text-charcoal text-2xl font-semibold">Products <span className="text-taupe text-lg font-normal">({items.length})</span></h2>
        </div>
        <button
          onClick={() => { setEditTarget(null); setShowModal(true) }}
          className="bg-emerald text-ivory font-semibold px-4 py-2 rounded-lg text-sm hover:bg-emerald/90 transition-colors"
        >
          + Add Product
        </button>
      </div>

      <div className="bg-white border border-taupe/15 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-taupe/5 border-b border-taupe/15 text-left">
              <th className="px-4 py-3 text-taupe font-medium">Product</th>
              <th className="px-4 py-3 text-taupe font-medium hidden sm:table-cell">Brand</th>
              <th className="px-4 py-3 text-taupe font-medium hidden md:table-cell">Buy Now</th>
              <th className="px-4 py-3 text-taupe font-medium">Status</th>
              <th className="px-4 py-3 text-taupe font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(p => (
              <tr key={p.id} className="border-b border-taupe/10 last:border-0 hover:bg-taupe/10 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {p.imageUrls?.[0]
                      ? <img src={p.imageUrls[0]} alt={p.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-taupe/20" />
                      : <div className="w-10 h-10 rounded-lg bg-taupe/10 border border-taupe/20 flex-shrink-0" />
                    }
                    <span className="text-charcoal">{p.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-taupe hidden sm:table-cell">{p.brand}</td>
                <td className="px-4 py-3 text-taupe hidden md:table-cell">
                  {p.buyNowPrice ? `AED ${Number(p.buyNowPrice).toLocaleString()}` : '—'}
                </td>
                <td className="px-4 py-3">
                  {p.sold
                    ? <span className="text-xs bg-burgundy/20 text-burgundy px-2 py-0.5 rounded-full">Sold</span>
                    : <span className="text-xs bg-emerald/10 text-emerald px-2 py-0.5 rounded-full">Available</span>
                  }
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setAuctionTarget(p)}
                      className="text-xs text-gold hover:underline"
                    >
                      Auction
                    </button>
                    <button
                      onClick={() => { setEditTarget(p); setShowModal(true) }}
                      className="text-xs text-taupe hover:text-charcoal"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(p.id)}
                      className="text-xs text-burgundy hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {items.length === 0 && (
          <p className="text-taupe text-sm text-center py-10">No products yet.</p>
        )}
      </div>

      {showModal && (
        <ProductModal
          product={editTarget}
          onClose={() => setShowModal(false)}
          onSaved={() => setShowModal(false)}
        />
      )}

      {auctionTarget && (
        <AuctionModal product={auctionTarget} onClose={() => setAuctionTarget(null)} />
      )}
    </div>
  )
}
