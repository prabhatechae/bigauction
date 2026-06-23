import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addFavourite, removeFavourite } from '../features/favourites/favouritesSlice'

/**
 * Server-side favourites hook (uses productId).
 * Falls back to no-op when not authenticated.
 */
export default function useFavourites() {
  const dispatch = useDispatch()
  const { items } = useSelector(s => s.favourites)
  const { user }  = useSelector(s => s.auth)

  // items is an array of FavouriteResponse objects with productId
  const isFavourite = useCallback(
    productId => items.some(f => f.productId === productId),
    [items]
  )

  const toggle = useCallback(productId => {
    if (!user || !productId) return
    if (isFavourite(productId)) dispatch(removeFavourite(productId))
    else                         dispatch(addFavourite(productId))
  }, [user, isFavourite, dispatch])

  return { favourites: items.map(f => f.productId), toggle, isFavourite }
}
