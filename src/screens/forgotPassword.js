import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  TextInput,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Box from '../screens/neumorphButton';
import Icon from 'react-native-vector-icons/Feather';
import auth from '@react-native-firebase/auth';
import ErrorPopup from './errorPopup'

export default class openingScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      icon: 'eye-off',
      hidePassword: true,
      email: '',
      modalVisible: false,
      modalMessage: '',
      errorMessage: '',
      errorVisible: false
    };
    this.forgetPassword = this.forgetPassword.bind(this)
  }
  _changeIcon = () => {
    this.state.icon !== 'eye-off'
      ? this.setState({ icon: 'eye-off', hidePassword: true })
      : this.setState({ icon: 'eye', hidePassword: false });
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.state.modalMessage !== prevState.modalMessage && this.state.modalMessage !== '') {
      this.setState({ modalVisible: true })
    }
    else if (this.state.errorMessage !== prevState.errorMessage && this.state.errorMessage !== '') {
      this.setState({ errorVisible: true })
    }
  }

  forgetPassword() {
    auth().sendPasswordResetEmail(this.state.email)
      .then(() => {
        this.setState({ modalMessage: `Please Check Your Email ${this.state.email}` })
      })
      .catch((error) => {
        const { message } = error
        this.setState({ errorMessage: message })
      })
    // alert(`Please Check Your Email ${this.state.email}`)
  }
  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(234,235,243,1)',
          //   justifyContent: 'center',
        }}>

        <ErrorPopup
          title="Done"
          subTitle={this.state.modalMessage}
          okButtonText="OK"
          clickFunction={() => {
            this.setState({modalMessage: ''})
            this.setState({ modalVisible: !this.state.modalVisible }); //Always keep this thing here
          }}
          modalVisible={this.state.modalVisible}
        />

        <ErrorPopup
          title="Error"
          subTitle={this.state.errorMessage}
          okButtonText="OK"
          clickFunction={() => {
            this.setState({errorMessage: ''})
            this.setState({ errorVisible: !this.state.errorVisible }); //Always keep this thing here
          }}
          modalVisible={this.state.errorVisible}
        />

        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 0,
            marginLeft: 15,
            marginTop: 5,
          }}
          onPress={() => this.props.navigation.goBack()}>
          <Box height={50} width={50} borderRadius={10}>
            <Icon
              name="chevron-left"
              color="#7f7f7f"
              size={40}
              style={{ alignSelf: 'center', marginTop: 5 }}
            />
          </Box>
        </TouchableOpacity>
        <View
          style={{
            marginLeft: '10%',
            width: '100%',
            marginTop: 100,
            marginBottom: 30,
          }}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 30,
              color: '#36454f',
              opacity: 0.75,
            }}>
            Forgot Password?
          </Text>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 15,
              color: '#36454f',
              opacity: 0.35,
              width: '80%',
              marginTop: 20,
            }}>
            Please enter your email address and we will email you a link to
            reset your password.
          </Text>
        </View>
        <KeyboardAvoidingView behavior="padding">
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View>
              <Box
                height={50}
                width={300}
                borderRadius={25}
                style={{ alignSelf: 'center' }}>
                <TextInput
                  placeholder="Enter Email Address"
                  placeholderColor="#B5BFD0"
                  style={{
                    fontWeight: 'bold',
                    paddingHorizontal: 20,
                    width: '100%',
                  }}
                  onChangeText={(val) => this.setState({ email: val })}

                />
              </Box>
              <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                colors={['#EA688A', '#EA7A7F']}
                style={{
                  height: 50,
                  borderRadius: 25,
                  width: 300,
                  alignSelf: 'center',
                  marginTop: 10,
                }}>
                <TouchableOpacity
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'transparent',
                    height: 50,
                    width: 300,
                  }}
                  onPress={() => {
                    this.forgetPassword()
                  }}>
                  <Text
                    style={{ color: '#fff', fontWeight: 'bold', fontSize: 12 }}>
                    Reset Password
                  </Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
        <View
          style={{
            width: '100%',
            position: 'absolute',
            top: '73%',
          }}>
          <Image
            source={require('../assets/group.png')}
            style={{ width: '100%', zIndex: -1 }}
          />
        </View>
      </View>
    );
  }
}