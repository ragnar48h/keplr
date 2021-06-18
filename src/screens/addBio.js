import React, { Component } from "react";
import {
  Text,
  View,
  Image,
  TextInput,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Box from '../screens/neumorphButton';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import ImagePicker from 'react-native-image-crop-picker'
import firestore from "@react-native-firebase/firestore"
import storage from "@react-native-firebase/storage"
import AsyncStorage from "@react-native-async-storage/async-storage"
import ErrorPopup from './errorPopup'
import { connect } from 'react-redux'
import { GET_USER } from '../redux/userRedux'

var BASE64 = ''
class openingScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keyboardOn: false,
      photoUrl: undefined,
      photoUrlBase64: '',
      firstName: '',
      lastName: '',
      bio: '',
      username: this.props.navigation.getParam('username'),
      mime: '',
      isLoading: false,
      fieldmodalVisible: false,
      authmodalVisible: false,
      fieldMessage: '',
      authMessage: '',
    };
    this.keyboardCheck = this.keyboardCheck.bind(this);
    this.onChangeText = this.onChangeText.bind(this)
    this.addUserDetails = this.addUserDetails.bind(this)
    this.keyboardCheck();
    this.imageNot
  }

  keyboardCheck = () => {
    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      this._keyboardDidShow
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      this._keyboardDidHide
    );
  };

  componentDidMount() {
    // console.log("NAVIGATION USERNAME", this.props.navigation.getParam('username'))
    // console.log("NAVIGATION UID", this.props.navigation.getParam('uid'))
    // console.log("NAVIGATION EMAIL", this.props.navigation.getParam('email'))
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.authMessage !== prevState.authMessage && this.state.authMessage !== '') {
      this.setState({ authmodalVisible: true })
    }

    else if (this.state.fieldMessage !== prevState.fieldMessage && this.state.fieldMessage !== '') {
      this.setState({ fieldmodalVisible: true })
    }
  }

  _keyboardDidShow = () => {
    // console.log("ON");
    // this.changeKeyboardState(true);
    this.setState({ keyboardOn: true });
  };

  _keyboardDidHide = () => {
    // console.log("OFF");
    // this.changeKeyboardState(false);
    this.setState({ keyboardOn: false });
  };
  onChangeText = (key, val) => {
    this.setState({ [key]: val });
  };
  addUserDetails = async () => {
    if (this.state.photoUrl === undefined) {
      this.setState({ fieldMessage: 'Choose Image By Clicking on the Top Right Icon to Proceed' })
      return
    }
    if(this.state.firstName == '' || this.state.lastName == '' || this.state.bio == ''){
      this.setState({
        fieldMessage:'Please Fill all the Fields',
        fieldmodalVisible:true
      })
      return
    }
    this.setState({ isLoading: true })
    const ref = storage().ref(this.state.username.toLowerCase() + '/dp.png');
    await ref.putFile(this.state.photoUrl);
    var url = await ref.getDownloadURL();
    firestore()
      .collection('Users')
      .doc(this.state.username.toLowerCase())
      .update({
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        bio: this.state.bio,
        photoUrl: url,
      })
      .then(() => {
        firestore()
          .collection("Users")
          .doc(this.state.username.toLowerCase())
          .get()
          .then(function (user) {
            // console.log(user)
            AsyncStorage.setItem('data', JSON.stringify(user['_data']))
          }.bind(this))
          .catch(function (error) {
            const { code, message } = error;
            this.setState({ authMessage: message })
          });
        this.props.dispatch({
          type: GET_USER,
          payload: {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            bio: this.state.bio,
            photoUrl: url,
            username: this.props.navigation.getParam('username'),
            uid: this.props.navigation.getParam('uid'),
            email: this.props.navigation.getParam('email'),
          }
        })
        this.props.navigation.navigate("openingScreen")
        // console.log('User updated!');
      })
      .catch((error) => {
        // handle failure
        // console.log(error)
        this.setState({ isLoading: true })
        this.setState({ authMessage: `Error: ${error.code} | ${error.description}` })
      });
  }
  render() {
    if (this.state.isLoading === true) {
      return (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator size="large" color="#4e7bb4" />
        </View>
      )
    } else {


      return (
        <View style={{ flex: 1, backgroundColor: "rgba(234,235,243,1)" }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>

            <ErrorPopup
              title="Cannot Proceed"
              subTitle={this.state.fieldMessage}
              okButtonText="OK"
              clickFunction={() => {
                this.setState({ fieldMessage: '' })
                this.setState({ fieldmodalVisible: !this.state.fieldmodalVisible }); //Always keep this thing here
              }}
              modalVisible={this.state.fieldmodalVisible}
            />

            <ErrorPopup
              title="Error"
              subTitle={this.state.authMessage}
              okButtonText="OK"
              clickFunction={() => {
                this.setState({ authMessage: '' })
                this.setState({ authmodalVisible: !this.state.authmodalVisible }); //Always keep this thing here
              }}
              modalVisible={this.state.authmodalVisible}
            />

            {this.state.photoUrl === undefined &&
              <TouchableOpacity
                onPress={() => {
                  try {
                    ImagePicker.openPicker({
                      height: 500,
                      width: 500,
                      cropping: true
                    })
                      .then((image) => {
                        this.setState({
                          photoUrl: Platform.OS === 'ios' ? image.replace('file://', '') : image['path'],
                          mime: image['mime']
                        })
                      })
                    // console.log(this.state)
                  } catch (error) {
                    this.imageNot = error
                    // this.setState({ authMessage: error })
                  }
                }}
              >
                <Box
                  height={102}
                  width={102}
                  borderRadius={16}
                  style={{ alignSelf: "center" }}
                >
                  <Image
                    source={require('../assets/placeholder.jpg')}
                    style={{
                      height: 100,
                      width: 100,
                      borderRadius: 15,
                      // resizeMode: "contain",
                    }}
                  />
                  <Text
                    style={{
                      position: "absolute",
                      bottom: 0,
                      fontSize: 11,
                      alignSelf: "center",
                      color: "#fff",
                      fontWeight: "bold",
                      backgroundColor: "#EA688A",
                      paddingHorizontal: 20,
                      paddingVertical: 1,
                    }}
                  >
                    Edit DP
              </Text>
                </Box>
              </TouchableOpacity>
            }
            {this.state.photoUrl !== undefined &&
              <TouchableOpacity
                onPress={async () => {
                  try {
                    var image = await ImagePicker.openPicker({
                      height: 500,
                      width: 500,
                      cropping: true
                    })
                    this.setState({
                      photoUrl: Platform.OS === 'ios' ? image.replace('file://', '') : image['path'],
                      mime: image['mime']
                    })
                  } catch (error) {
                    this.setState({ authMessage: error })
                  }
                }}
              >
                <Box
                  height={102}
                  width={102}
                  borderRadius={16}
                  style={{ alignSelf: "center" }}
                >
                  <Image
                    source={{ uri: this.state.photoUrl }}
                    style={{
                      height: 100,
                      width: 100,
                      borderRadius: 15,
                      // resizeMode: "contain",
                    }}
                  />
                </Box>
              </TouchableOpacity>
            }
          </View>
          {/* <KeyboardAvoidingView behavior="padding"> */}
          <KeyboardAwareScrollView>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={{ marginTop: 20 }}>
                <Box
                  height={50}
                  width={300}
                  borderRadius={25}
                  style={{ alignSelf: "center" }}
                >
                  <TextInput
                    placeholder="First Name"
                    placeholderColor="#B5BFD0"
                    style={{
                      fontWeight: "bold",
                      paddingHorizontal: 20,
                      width: "100%",
                    }}
                    onChangeText={(val) => this.onChangeText("firstName", val)}
                  />
                </Box>
                <Box
                  height={50}
                  width={300}
                  borderRadius={25}
                  style={{ alignSelf: "center" }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <TextInput
                      placeholder="Last Name"
                      placeholderColor="#B5BFD0"
                      style={{
                        fontWeight: "bold",
                        paddingHorizontal: 20,
                        width: 260,
                      }}
                      onChangeText={(val) => this.onChangeText("lastName", val)}

                    />
                  </View>
                </Box>
                <Box
                  height={70}
                  width={300}
                  borderRadius={25}
                  style={{ alignSelf: "center", marginLeft: 10 }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <TextInput
                      placeholder="Bio. eg: Anime Fanatic (ﾉ◕ヮ◕)."
                      multiline={true}
                      numberOfLines={3}
                      textAlignVertical="top"
                      style={{
                        fontWeight: "bold",
                        paddingHorizontal: 20,
                        width: 260,
                      }}
                      onChangeText={(val) => this.onChangeText("bio", val)}
                    />
                  </View>
                </Box>
                <LinearGradient
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  colors={["#EA688A", "#EA7A7F"]}
                  style={{
                    height: 50,
                    borderRadius: 25,
                    width: 300,
                    alignSelf: "center",
                    marginTop: 10,
                  }}
                >
                  <TouchableOpacity
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "transparent",
                      height: 50,
                      width: 300,
                    }}
                    onPress={() =>
                      this.addUserDetails()
                    }
                  >
                    <Text
                      style={{ color: "#fff", fontWeight: "bold", fontSize: 12 }}
                    >
                      NEXT
                  </Text>
                  </TouchableOpacity>
                </LinearGradient>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAwareScrollView>
          <KeyboardAvoidingView behavior="position">
            <View
              style={{
                width: "100%",
                bottom: this.state.keyboardOn ? -500 : -20,
                position: "absolute",
              }}
            >
              <Image
                source={require("../assets/logo.png")}
                // style={{borderWidth: 1, borderColor: 'black'}}
                style={{alignSelf:'center', height: 100, width: 100, marginBottom: '10%'}}
              />
            </View>
          </KeyboardAvoidingView>
        </View>
      );
    }
  }
}

const mapStateToProps = state => {
  return ({
    user: state.user
  })
}

export default connect(mapStateToProps)(openingScreen)