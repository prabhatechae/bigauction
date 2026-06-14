import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { addLiveBid, updateLiveStatus } from '../features/auctions/auctionsSlice'

/**
 * Connects to the auction WebSocket and pushes real-time updates into Redux.
 * Automatically cleans up on unmount or when auctionId changes.
 */
const useWebSocket = (auctionId) => {
  const dispatch   = useDispatch()
  const clientRef  = useRef(null)

  useEffect(() => {
    if (!auctionId) return

    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      onConnect: () => {
        client.subscribe(`/topic/auctions/${auctionId}/bids`, msg => {
          dispatch(addLiveBid(JSON.parse(msg.body)))
        })
        client.subscribe(`/topic/auctions/${auctionId}/status`, msg => {
          dispatch(updateLiveStatus(JSON.parse(msg.body)))
        })
      },
      onStompError: frame => {
        console.error('WebSocket error', frame)
      },
    })

    client.activate()
    clientRef.current = client

    return () => { client.deactivate() }
  }, [auctionId, dispatch])
}

export default useWebSocket
