import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export const fetchWishlist   = createAsyncThunk('wishlist/fetch',  async (_, { rejectWithValue }) => {
  try { return (await api.get('/users/me/wishlist')).data }
  catch (err) { return rejectWithValue(err.message) }
})

export const addWishlistItem = createAsyncThunk('wishlist/add', async (data, { rejectWithValue }) => {
  try { return (await api.post('/users/me/wishlist', data)).data }
  catch (err) { return rejectWithValue(err.message || 'Failed to add item') }
})

export const updateWishlistItem = createAsyncThunk('wishlist/update', async ({ id, data }, { rejectWithValue }) => {
  try { return (await api.put(`/users/me/wishlist/${id}`, data)).data }
  catch (err) { return rejectWithValue(err.message || 'Failed to update item') }
})

export const deleteWishlistItem = createAsyncThunk('wishlist/delete', async (id, { rejectWithValue }) => {
  try { await api.delete(`/users/me/wishlist/${id}`); return id }
  catch (err) { return rejectWithValue(err.message || 'Failed to delete item') }
})

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: { items: [], loading: false, error: null },
  reducers: {
    clearError(state) { state.error = null },
  },
  extraReducers: builder => {
    const pending  = state => { state.loading = true; state.error = null }
    const rejected = (state, a) => { state.loading = false; state.error = a.payload }

    builder
      .addCase(fetchWishlist.pending,       pending)
      .addCase(fetchWishlist.fulfilled,     (state, a) => { state.loading = false; state.items = a.payload })
      .addCase(fetchWishlist.rejected,      rejected)
      .addCase(addWishlistItem.pending,     pending)
      .addCase(addWishlistItem.fulfilled,   (state, a) => { state.loading = false; state.items.unshift(a.payload) })
      .addCase(addWishlistItem.rejected,    rejected)
      .addCase(updateWishlistItem.pending,  pending)
      .addCase(updateWishlistItem.fulfilled,(state, a) => {
        state.loading = false
        const idx = state.items.findIndex(i => i.id === a.payload.id)
        if (idx !== -1) state.items[idx] = a.payload
      })
      .addCase(updateWishlistItem.rejected, rejected)
      .addCase(deleteWishlistItem.pending,  pending)
      .addCase(deleteWishlistItem.fulfilled,(state, a) => {
        state.loading = false
        state.items = state.items.filter(i => i.id !== a.payload)
      })
      .addCase(deleteWishlistItem.rejected, rejected)
  },
})

export const { clearError } = wishlistSlice.actions
export default wishlistSlice.reducer
