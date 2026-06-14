import { useState, useCallback } from 'react'

const STORAGE_KEY = 'bigauction_favourites'

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [] }
  catch { return [] }
}

export default function useFavourites() {
  const [favourites, setFavourites] = useState(() => load())

  const toggle = useCallback(auctionId => {
    setFavourites(prev => {
      const next = prev.includes(auctionId)
        ? prev.filter(id => id !== auctionId)
        : [...prev, auctionId]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const isFavourite = useCallback(auctionId => favourites.includes(auctionId), [favourites])

  return { favourites, toggle, isFavourite }
}
