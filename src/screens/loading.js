import React, {Component} from 'react'
import { View, Image, ActivityIndicator } from 'react-native'
import auth from '@react-native-firebase/auth'

var unsubscribe
export default class Loading extends Component {

    componentDidMount() {
        unsubscribe = auth().onAuthStateChanged(user => {
             if(user === null) {
          this.props.navigation.navigate('auth')
             }
             else {
                 this.props.navigation.navigate('normal')
             }
        })
    }

    componentWillUnmount() {
        unsubscribe()
    }

    render() {
        return(
            <Image source={require('../../Assets/launch_screen.png')} />
        )
    }

}