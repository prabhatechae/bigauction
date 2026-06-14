import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export const fetchAllUsers    = createAsyncThunk('admin/fetchUsers',    async (_, { rejectWithValue }) => {
  try { return (await api.get('/admin/users')).data }
  catch (err) { return rejectWithValue(err.message) }
})

export const fetchAllOrders   = createAsyncThunk('admin/fetchOrders',   async (_, { rejectWithValue }) => {
  try { return (await api.get('/admin/orders')).data }
  catch (err) { return rejectWithValue(err.message) }
})

export const updateOrderStatus = createAsyncThunk('admin/updateOrder',  async ({ orderId, status }, { rejectWithValue }) => {
  try { return (await api.patch(`/admin/orders/${orderId}/status`, { status })).data }
  catch (err) { return rejectWithValue(err.message) }
})

export const fetchReports     = createAsyncThunk('admin/fetchReports',  async (_, { rejectWithValue }) => {
  try { return (await api.get('/admin/reports')).data }
  catch (err) { return rejectWithValue(err.message) }
})

export const saveCreditConfig = createAsyncThunk('admin/saveCreditConfig', async (data, { rejectWithValue }) => {
  try { return (await api.post('/admin/credit-config', data)).data }
  catch (err) { return rejectWithValue(err.message) }
})

export const adjustUserCredit = createAsyncThunk('admin/adjustCredit', async ({ userId, amount, note }, { rejectWithValue }) => {
  try { await api.post(`/admin/users/${userId}/credit`, { amount, note }) }
  catch (err) { return rejectWithValue(err.message) }
})

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    users:        [],
    orders:       [],
    reports:      null,
    creditConfig: null,
    loading:      false,
    error:        null,
  },
  reducers: {
    clearError(state) { state.error = null },
  },
  extraReducers: builder => {
    const pending  = state => { state.loading = true;  state.error = null }
    const rejected = (state, action) => { state.loading = false; state.error = action.payload }

    builder
      .addCase(fetchAllUsers.pending,      pending)
      .addCase(fetchAllUsers.fulfilled,    (state, a) => { state.loading = false; state.users   = a.payload })
      .addCase(fetchAllUsers.rejected,     rejected)
      .addCase(fetchAllOrders.pending,     pending)
      .addCase(fetchAllOrders.fulfilled,   (state, a) => { state.loading = false; state.orders  = a.payload })
      .addCase(fetchAllOrders.rejected,    rejected)
      .addCase(updateOrderStatus.fulfilled,(state, a) => {
        const idx = state.orders.findIndex(o => o.id === a.payload.id)
        if (idx !== -1) state.orders[idx] = a.payload
      })
      .addCase(fetchReports.pending,       pending)
      .addCase(fetchReports.fulfilled,     (state, a) => { state.loading = false; state.reports = a.payload })
      .addCase(fetchReports.rejected,      rejected)
      .addCase(saveCreditConfig.fulfilled, (state, a) => { state.creditConfig = a.payload })
  },
})

export const { clearError } = adminSlice.actions
export default adminSlice.reducer
