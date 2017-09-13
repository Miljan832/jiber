import { Action, CONFIRMED_STATE } from '../core'
import { createEnsureRoom } from './ensure-room'

////////////////////////////////////////////////////////////////////////////////
// mocks
////////////////////////////////////////////////////////////////////////////////
let calls: any[]
const dispatch = (action: Action) => calls.push(action)
const getRoomState: any = (roomId: string) => {
  if (roomId === 'room1') return {roomId: 'room1', source: 'store'}
  return undefined
}
const fetchRoomState: any = async (roomId: string) => {
  if (roomId === 'room2') return {roomId: 'room2', source: 'storage'}
  return undefined
}

////////////////////////////////////////////////////////////////////////////////
// setup
////////////////////////////////////////////////////////////////////////////////
const ensureRoom = createEnsureRoom(dispatch, getRoomState, fetchRoomState)
beforeEach(() => calls = [])

////////////////////////////////////////////////////////////////////////////////
// tests
////////////////////////////////////////////////////////////////////////////////
test('return state from store if it exists', async () => {
  const room = await ensureRoom('room1')
  expect(room).toEqual({roomId: 'room1', source: 'store'})
})

test('return state from storage if it exists', async () => {
  const room = await ensureRoom('room2')
  expect(room).toEqual({roomId: 'room2', source: 'storage'})
  expect(calls).toEqual([{
    type: CONFIRMED_STATE,
    roomId: 'room2',
    source: 'storage',
    $roomId: 'room2'
  }])
})

test('return default if not found in the store or storage', async () => {
  const room = await ensureRoom('room3')
  expect(room).toEqual({confirmed: undefined, lastUpdatedAt: 0, members: {}})
})