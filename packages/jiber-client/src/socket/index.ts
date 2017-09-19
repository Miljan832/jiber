import { ClientStore } from '../client-store'
import { ClientSettings } from '../interfaces/client-settings'
import { createTrySocket } from './try-socket'
import { createOnMessage } from './on-message'
import { createActionHandler } from './action-handler'
import { createWebSocket } from './create-web-socket'
import { createRejoinRooms } from './rejoin-rooms'
import { createResendPending } from './resend-pending'
import { sendAction } from './send-action'
import { createTryToConnect } from './try-to-connect'
import { Action } from 'jiber-core'

/**
 * Some odd manual dependency injection
 */
export const createSocket = (store: ClientStore, settings: ClientSettings) => {
  const resendPending = createResendPending(sendAction, store.getState)
  const rejoinRooms = createRejoinRooms(sendAction, store.getState)
  const actionHandler = createActionHandler(rejoinRooms, resendPending)
  const tryToConnect = createTryToConnect(createWebSocket, settings)
  const onMessage = createOnMessage(store.dispatch, actionHandler)
  const socket = createTrySocket(tryToConnect, onMessage, sendAction)
  return socket
}

export { Action }                                                               // TS4058: make the compiler happy