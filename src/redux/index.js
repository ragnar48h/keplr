import {createStore,combineReducers,applyMiddleware} from 'redux'
import {persistStore,persistReducer} from 'redux-persist'
import AsyncStorage from '@react-native-async-storage/async-storage'
import thunk from 'redux-thunk'

import roomsRedux from './roomsRedux'
import userRedux from './userRedux'

const rootReducer = combineReducers ({
    rooms: roomsRedux,
    user: userRedux
})

const persistConfig = {
    key:'root',
    storage: AsyncStorage,
    whitelist:['user']
}

const pReducer = persistReducer(persistConfig, rootReducer)

export const store =  createStore(pReducer,applyMiddleware(thunk))
export const persistor = persistStore(store)

