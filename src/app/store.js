import { configureStore } from '@reduxjs/toolkit'
import authReducer       from '../features/auth/authSlice'
import productsReducer   from '../features/products/productsSlice'
import auctionsReducer   from '../features/auctions/auctionsSlice'
import walletReducer     from '../features/wallet/walletSlice'
import adminReducer      from '../features/admin/adminSlice'
import categoriesReducer from '../features/categories/categoriesSlice'
import wishlistReducer   from '../features/wishlist/wishlistSlice'
import addressesReducer  from '../features/addresses/addressSlice'
import favouritesReducer from '../features/favourites/favouritesSlice'

const store = configureStore({
  reducer: {
    auth:       authReducer,
    products:   productsReducer,
    auctions:   auctionsReducer,
    wallet:     walletReducer,
    admin:      adminReducer,
    categories: categoriesReducer,
    wishlist:   wishlistReducer,
    addresses:  addressesReducer,
    favourites: favouritesReducer,
  },
})
export default store
