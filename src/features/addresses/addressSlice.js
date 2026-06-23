import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export const fetchAddresses   = createAsyncThunk('addresses/fetch',  async (_, { rejectWithValue }) => {
  try { return (await api.get('/users/me/addresses')).data }
  catch (err) { return rejectWithValue(err.message) }
})

export const addAddress = createAsyncThunk('addresses/add', async (data, { rejectWithValue }) => {
  try { return (await api.post('/users/me/addresses', data)).data }
  catch (err) { return rejectWithValue(err.message || 'Failed to add address') }
})

export const updateAddress = createAsyncThunk('addresses/update', async ({ id, data }, { rejectWithValue }) => {
  try { return (await api.put(`/users/me/addresses/${id}`, data)).data }
  catch (err) { return rejectWithValue(err.message || 'Failed to update address') }
})

export const deleteAddress = createAsyncThunk('addresses/delete', async (id, { rejectWithValue }) => {
  try { await api.delete(`/users/me/addresses/${id}`); return id }
  catch (err) { return rejectWithValue(err.message || 'Failed to delete address') }
})

const addressSlice = createSlice({
  name: 'addresses',
  initialState: { items: [], loading: false, error: null },
  reducers: {
    clearError(state) { state.error = null },
  },
  extraReducers: builder => {
    const pending  = state => { state.loading = true; state.error = null }
    const rejected = (state, a) => { state.loading = false; state.error = a.payload }

    builder
      .addCase(fetchAddresses.pending,    pending)
      .addCase(fetchAddresses.fulfilled,  (state, a) => { state.loading = false; state.items = a.payload })
      .addCase(fetchAddresses.rejected,   rejected)
      .addCase(addAddress.pending,        pending)
      .addCase(addAddress.fulfilled,      (state, a) => { state.loading = false; state.items.unshift(a.payload) })
      .addCase(addAddress.rejected,       rejected)
      .addCase(updateAddress.pending,     pending)
      .addCase(updateAddress.fulfilled,   (state, a) => {
        state.loading = false
        const idx = state.items.findIndex(i => i.id === a.payload.id)
        if (idx !== -1) state.items[idx] = a.payload
        else state.items.unshift(a.payload)
      })
      .addCase(updateAddress.rejected,    rejected)
      .addCase(deleteAddress.pending,     pending)
      .addCase(deleteAddress.fulfilled,   (state, a) => {
        state.loading = false
        state.items = state.items.filter(i => i.id !== a.payload)
      })
      .addCase(deleteAddress.rejected,    rejected)
  },
})

export const { clearError } = addressSlice.actions
export default addressSlice.reducer
