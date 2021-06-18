import {createAppContainer, createSwitchNavigator} from 'react-navigation'

import normalNavigator from './normal'
import authFlowNavigator from './authflow'
import loading from '../screens/loading'

const appNavigator = createSwitchNavigator({
    loading: {screen: loading},
    auth: authFlowNavigator,
    normal: normalNavigator
},{
    initialRouteName: 'loading'
})

export default createAppContainer(appNavigator)