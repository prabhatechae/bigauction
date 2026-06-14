import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

// ── Thunks ──────────────────────────────────────────────
export const register = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/register', data)
    return res.data
  } catch (err) {
    return rejectWithValue(err.message || 'Registration failed')
  }
})

export const login = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/login', data)
    return res.data
  } catch (err) {
    return rejectWithValue(err.message || 'Login failed')
  }
})

export const fetchProfile = createAsyncThunk('auth/fetchProfile', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/users/me')
    return res.data
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

export const updateProfile = createAsyncThunk('auth/updateProfile', async (data, { rejectWithValue }) => {
  try {
    const res = await api.put('/users/me', data)
    return res.data
  } catch (err) {
    return rejectWithValue(err.message || 'Update failed')
  }
})

// ── Slice ────────────────────────────────────────────────
const stored = localStorage.getItem('user')

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user:    stored ? JSON.parse(stored) : null,
    token:   localStorage.getItem('token') || null,
    loading: false,
    error:   null,
  },
  reducers: {
    logout(state) {
      state.user  = null
      state.token = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
    clearError(state) { state.error = null },
  },
  extraReducers: builder => {
    const pending  = state => { state.loading = true;  state.error = null }
    const rejected = (state, action) => { state.loading = false; state.error = action.payload }

    const onAuth = (state, action) => {
      state.loading = false
      state.token   = action.payload.token
      state.user    = action.payload
      localStorage.setItem('token', action.payload.token)
      localStorage.setItem('user',  JSON.stringify(action.payload))
    }

    builder
      .addCase(register.pending,       pending)
      .addCase(register.fulfilled,     onAuth)
      .addCase(register.rejected,      rejected)
      .addCase(login.pending,          pending)
      .addCase(login.fulfilled,        onAuth)
      .addCase(login.rejected,         rejected)
      .addCase(fetchProfile.fulfilled, (state, action) => { state.user = action.payload })
      .addCase(updateProfile.pending,  pending)
      .addCase(updateProfile.fulfilled,(state, action) => { state.loading = false; state.user = { ...state.user, ...action.payload } })
      .addCase(updateProfile.rejected, rejected)
  },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer
