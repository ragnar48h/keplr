import {createStackNavigator} from 'react-navigation-stack'

import login from '../screens/login'
import signUp from '../screens/signUp'
import forgotPassword from '../screens/forgotPassword'
import addBio from '../screens/addBio'

const authFlowNavigator = createStackNavigator({

    login: {
        screen: login
    },
    signUp: {
        screen: signUp
    },
    forgotPassword: {
        screen: forgotPassword
    },
    addBio: {
        screen: addBio
    },

},{
    headerMode: 'none'
})

export default authFlowNavigator