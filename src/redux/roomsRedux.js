import { PURGE } from "redux-persist"

export const GET_ROOMS = 'GET_ROOMS'

export const CHANGE_ADMIN = 'CHANGE_ADMIN'

export const GET_ROOM_HOSTS = 'GET_ROOM_HOSTS'
export const ADD_ROOM_HOSTS = 'ADD_ROOM_HOSTS'
export const REMOVE_ROOM_HOSTS = 'REMOVE_ROOM_HOSTS'
export const TALK_ROOM_HOSTS = 'TALK_ROOM_HOSTS'
export const CONNECTED_HOSTS = 'CONNECTED_HOSTS'
export const UPDATE_HOSTS = 'UPDATE_HOSTS'

export const GET_ROOM_AUDIENCE = 'GET_ROOM_AUDIENCE'
export const ADD_ROOM_AUDIENCE = 'ADD_ROOM_AUDIENCE'
export const REMOVE_ROOM_AUDIENCE = 'REMOVE_ROOM_AUDIENCE'
export const CONNECTED_AUDIENCE = 'CONNECTED_AUDIENCE'

export const GET_ROOM_QUEUE = 'GET_ROOM_QUEUE'
export const ADD_ROOM_QUEUE = 'ADD_ROOM_QUEUE'
export const REMOVE_ROOM_QUEUE = 'REMOVE_ROOM_QUEUE'
export const CONNECTED_QUEUE = 'CONNECTED_QUEUE'

export const GET_CONNECTED = 'GET_CONNECTED'

export const CLEAR_ROOM = 'CLEAR_ROOM'

const INITIAL_STATE = { roomAudience: [], roomHosts: [], roomQueue: [], rooms: [], connected: false }

export default function roomsRedux(state = INITIAL_STATE, action) {
    switch (action.type) {

        case CLEAR_ROOM:
            return { ...state, roomAudience: [], roomHosts: [], roomQueue: [] }

        case GET_CONNECTED:
            return { ...state, connected: action.payload }

        case GET_ROOMS:
            return { ...state, rooms: action.payload }

        case GET_ROOM_HOSTS:
            return { ...state, roomHosts: action.payload }

        case ADD_ROOM_HOSTS:
            return { ...state, roomHosts: [...state.roomHosts, action.payload] }

        case UPDATE_HOSTS:
            return {
                ...state, roomHosts: [...state.roomHosts.map((item) => {
                    if (item.username !== action.payload.username) {
                        return item
                    }
                    else {
                        return {
                            ...item,
                            value: action.payload.value
                        }
                    }
                })]
            }

        case REMOVE_ROOM_HOSTS:
            return {...state , roomHosts: [...state.roomHosts.filter(item => item.username !== action.payload)]}

        case TALK_ROOM_HOSTS:
            return {
                ...state, roomHosts: state.roomHosts.map((item) => {
                    for (var i = 0; i < action.payload.length; i += 1) {
                        if (item.username === action.payload[i]) {
                            return {
                                ...item,
                                talk: true
                            }
                        }
                        else {
                            return item
                        }
                    }
                })
            }

        case CONNECTED_HOSTS:
            return {
                ...state, roomHosts: state.roomHosts.map((item, index) => {
                    if (index === action.payload['index']) {
                        return {
                            ...item,
                            connected: action.payload['type']
                        }
                    }
                    else {
                        return item
                    }
                })
            }

        case GET_ROOM_AUDIENCE:
            return { ...state, roomAudience: action.payload }

        case ADD_ROOM_AUDIENCE:
            return { ...state, roomAudience: [...state.roomAudience, action.payload] }

        case REMOVE_ROOM_AUDIENCE:
            return {...state , roomAudience: [...state.roomAudience.filter(item => item.username !== action.payload)]}

        case CONNECTED_AUDIENCE:
            return {
                ...state, roomAudience: state.roomAudience.map((item, index) => {
                    if (index === action.payload['index']) {
                        return {
                            ...item,
                            connected: action.payload['type']
                        }
                    }
                    else {
                        return item
                    }
                })
            }


        case GET_ROOM_QUEUE:
            return { ...state, roomQueue: action.payload }

        case ADD_ROOM_QUEUE:
            return { ...state, roomQueue: [...state.roomQueue, action.payload] }

        case REMOVE_ROOM_QUEUE:
            return {...state , roomQueue: [...state.roomQueue.filter(item => item.username !== action.payload)]}

        case CONNECTED_QUEUE:
            return {
                ...state, roomQueue: state.roomQueue.map((item, index) => {
                    if (index === action.payload['index']) {
                        return {
                            ...item,
                            connected: action.payload['type']
                        }
                    }
                    else {
                        return item
                    }
                })
            }

        case CHANGE_ADMIN:
            return {
                ...state, roomHosts: state.roomHosts.map((item, index) => {
                    if (index === 0) {
                        return {
                            ...item, ...action.payload
                        }
                    }
                    else {
                        return item
                    }
                })
            }

        case PURGE:
            return INITIAL_STATE

        default:
            return state
    }
}