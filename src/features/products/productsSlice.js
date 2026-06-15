import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export const fetchProducts = createAsyncThunk('products/fetchAll', async (_, { rejectWithValue }) => {
  try { return (await api.get('/products')).data }
  catch (err) { return rejectWithValue(err.message) }
})

export const fetchFilteredProducts = createAsyncThunk('products/fetchFiltered', async (params, { rejectWithValue }) => {
  try { return (await api.get('/products/filter', { params })).data }
  catch (err) { return rejectWithValue(err.message) }
})

export const fetchProductById = createAsyncThunk('products/fetchById', async (id, { rejectWithValue }) => {
  try { return (await api.get(`/products/${id}`)).data }
  catch (err) { return rejectWithValue(err.message) }
})

// ── Admin thunks ──────────────────────────────────────────
export const createProduct = createAsyncThunk('products/create', async (data, { rejectWithValue }) => {
  try { return (await api.post('/products', data)).data }
  catch (err) { return rejectWithValue(err.message) }
})

export const updateProduct = createAsyncThunk('products/update', async ({ id, data }, { rejectWithValue }) => {
  try { return (await api.put(`/products/${id}`, data)).data }
  catch (err) { return rejectWithValue(err.message) }
})

export const deleteProduct = createAsyncThunk('products/delete', async (id, { rejectWithValue }) => {
  try { await api.delete(`/products/${id}`); return id }
  catch (err) { return rejectWithValue(err.message) }
})

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items:    [],
    selected: null,
    loading:  false,
    error:    null,
    page:     1,
    pageSize: 12,
  },
  reducers: {
    setPage(state, action) { state.page = action.payload },
    clearSelected(state)   { state.selected = null },
    clearError(state)      { state.error = null },
  },
  extraReducers: builder => {
    const pending  = state => { state.loading = true;  state.error = null }
    const rejected = (state, action) => { state.loading = false; state.error = action.payload }

    builder
      .addCase(fetchProducts.pending,          pending)
      .addCase(fetchProducts.fulfilled,        (state, a) => { state.loading = false; state.items = a.payload })
      .addCase(fetchProducts.rejected,         rejected)
      .addCase(fetchFilteredProducts.pending,  pending)
      .addCase(fetchFilteredProducts.fulfilled,(state, a) => { state.loading = false; state.items = a.payload; state.page = 1 })
      .addCase(fetchFilteredProducts.rejected, rejected)
      .addCase(fetchProductById.pending,       pending)
      .addCase(fetchProductById.fulfilled,     (state, a) => { state.loading = false; state.selected = a.payload })
      .addCase(fetchProductById.rejected,      rejected)
      .addCase(createProduct.pending,           pending)
      .addCase(createProduct.fulfilled,        (state, a) => { state.loading = false; state.items.unshift(a.payload) })
      .addCase(createProduct.rejected,         rejected)
      .addCase(updateProduct.pending,          pending)
      .addCase(updateProduct.fulfilled,        (state, a) => { state.loading = false;
        const idx = state.items.findIndex(p => p.id === a.payload.id)
        if (idx !== -1) state.items[idx] = a.payload
        if (state.selected?.id === a.payload.id) state.selected = a.payload
      })
      .addCase(updateProduct.rejected,         rejected)
      .addCase(deleteProduct.fulfilled,        (state, a) => { state.items = state.items.filter(p => p.id !== a.payload) })
  },
})

export const { setPage, clearSelected, clearError } = productsSlice.actions
export default productsSlice.reducer
