import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export const fetchFavourites   = createAsyncThunk('favourites/fetch', async (_, { rejectWithValue }) => {
  try { return (await api.get('/users/me/favourites')).data }
  catch (err) { return rejectWithValue(err.message) }
})

export const addFavourite = createAsyncThunk('favourites/add', async (productId, { rejectWithValue }) => {
  try { return (await api.post(`/users/me/favourites/${productId}`)).data }
  catch (err) { return rejectWithValue(err.message || 'Failed to save') }
})

export const removeFavourite = createAsyncThunk('favourites/remove', async (productId, { rejectWithValue }) => {
  try { await api.delete(`/users/me/favourites/${productId}`); return productId }
  catch (err) { return rejectWithValue(err.message || 'Failed to remove') }
})

const favouritesSlice = createSlice({
  name: 'favourites',
  initialState: { items: [], loading: false, error: null },
  reducers: {
    clearError(state) { state.error = null },
  },
  extraReducers: builder => {
    const pending  = state => { state.loading = true; state.error = null }
    const rejected = (state, a) => { state.loading = false; state.error = a.payload }

    builder
      .addCase(fetchFavourites.pending,    pending)
      .addCase(fetchFavourites.fulfilled,  (state, a) => { state.loading = false; state.items = a.payload })
      .addCase(fetchFavourites.rejected,   rejected)
      .addCase(addFavourite.pending,       pending)
      .addCase(addFavourite.fulfilled,     (state, a) => { state.loading = false; state.items.unshift(a.payload) })
      .addCase(addFavourite.rejected,      rejected)
      .addCase(removeFavourite.pending,    pending)
      .addCase(removeFavourite.fulfilled,  (state, a) => {
        state.loading = false
        state.items = state.items.filter(i => i.productId !== a.payload)
      })
      .addCase(removeFavourite.rejected,   rejected)
  },
})

export const { clearError } = favouritesSlice.actions
export default favouritesSlice.reducer
