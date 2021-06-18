import { PURGE} from "redux-persist"

export const GET_USER = 'GET_USER' 

export default function userRedux(state = {user:{}}, action) {
    switch(action.type) {
        case GET_USER:
            return {...state,user: action.payload}
        
        case PURGE:
            return {user: {}}
        
        default:
            return state
    }
}