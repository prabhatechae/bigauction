import { useEffect, useRef, useCallback } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

/**
 * Subscribes to /topic/users/{userId}/notifications for personal alerts:
 *   - OUTBID: another user placed a higher bid
 *   - AUCTION_WON: this user won the auction
 *   - AUCTION_CLOSED: auction ended with no winner (credit refunded)
 *
 * onNotification(notification) is called with the parsed payload.
 */
const useUserNotifications = (userId, onNotification) => {
  const clientRef      = useRef(null)
  const callbackRef    = useRef(onNotification)
  callbackRef.current  = onNotification   // always use latest callback without reconnecting

  useEffect(() => {
    if (!userId) return

    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      onConnect: () => {
        client.subscribe(`/topic/users/${userId}/notifications`, msg => {
          try {
            const notification = JSON.parse(msg.body)
            callbackRef.current?.(notification)
          } catch {}
        })
      },
      onStompError: frame => {
        console.error('Notification WebSocket error', frame)
      },
    })

    client.activate()
    clientRef.current = client

    return () => { client.deactivate() }
  }, [userId])
}

export default useUserNotifications
