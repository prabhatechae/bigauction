import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../../services/api'

export const fetchCategories = createAsyncThunk('categories/fetchAll', async () => {
  const res = await api.get('/categories')
  return res.data
})

const categoriesSlice = createSlice({
  name: 'categories',
  initialState: { items: [], loading: false },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchCategories.pending, state => { state.loading = true })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchCategories.rejected, state => { state.loading = false })
  },
})

export default categoriesSlice.reducer
