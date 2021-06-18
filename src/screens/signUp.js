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
import Box from './neumorphButton';
import Icon from "react-native-vector-icons/Feather";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore"
import AsyncStorage from "@react-native-async-storage/async-storage"
import ErrorPopup from './errorPopup'

export default class openingScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keyboardOn: false,
      passwordsDontMatch: true,
      usernameAvailable: true, //Add your username availability logic here.
      icon2: "eye-off",
      hidePassword2: true,
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
      isLoading: false,
      fieldmodalVisible: false,
      authmodalVisible: false,
      fieldMessage: '',
      authMessage: ''
    };
    this.onChangeText = this.onChangeText.bind(this);
    this.checkUsername = this.checkUsername.bind(this);
    this.keyboardCheck = this.keyboardCheck.bind(this);
    this.onRegister = this.onRegister.bind(this)
    this.matchPassword = this.matchPassword.bind(this)
    this.keyboardCheck();

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

  componentDidUpdate(prevProps, prevState) {
    if (this.state.authMessage !== prevState.authMessage && this.state.authMessage !== '') {
      this.setState({ authmodalVisible: true })
    }

    else if (this.state.fieldMessage !== prevState.fieldMessage && this.state.fieldMessage !== '') {
      this.setState({ fieldmodalVisible: true })
    }
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
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

  _changeIcon2 = () => {
    this.state.icon2 !== "eye-off"
      ? this.setState({ icon2: "eye-off", hidePassword2: true })
      : this.setState({ icon2: "eye", hidePassword2: false });
  };

  onChangeText = (key, val) => {
    if (key == 'username') {
      return this.checkUsername(val)
    }

    if (key == 'confirmPassword') {
      if (this.matchPassword(val))
        this.setState({ passwordsDontMatch: false });
      else
        this.setState({ passwordsDontMatch: true });

    }
    this.setState({ [key]: val });
  };

  checkUsername = (username) => {
    firestore()
      .collection('Users')
      .doc(username.toLowerCase())
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          this.setState({
            usernameAvailable: false,
            username: username
          })
          return 0;
        } else {
          this.setState({
            usernameAvailable: true,
            username: username
          })
          return 1;
        }
      });
  }
  matchPassword(Cpassword) {
    if (this.state.password != Cpassword)
      return 0
    else
      return 1
  }
  onRegister() {
    if(this.state.username == '' || this.state.email == '' || this.state.password == ''){
      this.setState({
        fieldMessage: 'Please Fill all the Fields!',
        fieldmodalVisible:true
      })
      return;
    }
    if (!this.state.usernameAvailable) {
      // alert("Username Not Available")
      this.setState({fieldMessage: 'Username Not Available'})
      return;
    }
    if (!this.matchPassword(this.state.confirmPassword)) {
      this.setState({fieldMessage: 'Passwords Don\'t Match'})
      // alert('password Doesn\'t Match')
      return;
    }
    this.setState({ isLoading: true })
    const { email, password } = this.state;
    // console.log(this.state)
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(response => {
        const { username, email } = this.state;

        var user_uid = response.user.uid;
        AsyncStorage.setItem("userId", user_uid);
        const data = {
          email: email,
          username: username,
          uid: user_uid
        };

        firestore()
          .collection("Users")
          .doc(username.toLowerCase())
          .set(data);

        firestore()
          .collection("Users")
          .doc(username.toLowerCase())
          .get()
          .then(function (user) {
            // console.log(user);
            this.props.navigation.navigate('addBio', {
              username: username,
              uid: user_uid,
              email: email
            });
            //navigation.dispatch({ type: "Login", user: user });
          }.bind(this))
          .catch(function (error) {
            const { code, message } = error;
            this.setState({ isLoading: false })
            this.setState({authMessage: message})
            // alert(message);
          });
      })
      .catch(error => {
        const { code, message } = error;
        this.setState({ isLoading: false })
        this.setState({authMessage: message})
        // alert(message);
      });
  }
  render() {
    if (this.state.isLoading === true) {
      return (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator size="large" color="#4e7bb4" />
        </View>
      )
    }
    else {
      return (
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(234,235,243,1)",
            justifyContent: "center",
          }}
        >

          <ErrorPopup
            title="Cannot Proceed!"
            subTitle={this.state.fieldMessage}
            okButtonText="OK"
            clickFunction={() => {
              this.setState({fieldMessage: ''})
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

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginRight: 15,
            }}
          >
            <TouchableOpacity
              style={{
                marginLeft: 15,
                marginTop: 5,
              }}
              onPress={() => this.props.navigation.goBack()}
            >
              <Box height={50} width={50} borderRadius={10}>
                <Icon
                  name="chevron-left"
                  color="#7f7f7f"
                  size={40}
                  style={{ alignSelf: "center", marginTop: 5 }}
                />
              </Box>
            </TouchableOpacity>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 30,
                color: "#4e7bb4",
              }}
            >
              Sign Up!
            </Text>
          </View>
          {/* <KeyboardAvoidingView behavior="padding"> */}
          <KeyboardAwareScrollView style={{ marginTop: 50 }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View>
                <View>
                  <Box
                    height={50}
                    width={300}
                    borderRadius={25}
                    style={{ alignSelf: "center" }}
                  >
                    <TextInput
                      placeholder="Username"
                      placeholderColor="#B5BFD0"
                      style={{
                        fontWeight: "bold",
                        paddingHorizontal: 20,
                        width: "100%",
                      }}
                      onChangeText={(val) => this.onChangeText("username", val)}
                    />
                  </Box>
                  {this.state.username != '' && (
                    <Text style={{
                      color:this.state.usernameAvailable ? "#4e7bb4" : "#ea688a", 
                      marginLeft:"15%",
                      fontWeight:"bold"

                    }}>
                      {this.state.usernameAvailable? `${this.state.username} is available`: `${this.state.username} is not available`}
                      </Text>
                  )}
                    
                </View>
                <Box
                  height={50}
                  width={300}
                  borderRadius={25}
                  style={{ alignSelf: "center" }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <TextInput
                      placeholder="Email Address"
                      placeholderColor="#B5BFD0"
                      style={{
                        fontWeight: "bold",
                        paddingHorizontal: 20,
                        width: "100%",
                      }}
                      onChangeText={(val) => this.onChangeText("email", val)}
                    />
                  </View>
                </Box>
                <Box
                  height={50}
                  width={300}
                  borderRadius={25}
                  style={{ alignSelf: "center" }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <TextInput
                      placeholder="Password"
                      placeholderColor="#B5BFD0"
                      secureTextEntry={true}
                      style={{
                        fontWeight: "bold",
                        paddingHorizontal: 20,
                        width: 260,
                      }}
                      onChangeText={(val) => this.onChangeText("password", val)}
                    />
                  </View>
                </Box>
                <View>
                
                  <Box
                    height={50}
                    width={300}
                    borderRadius={25}
                    style={{ alignSelf: "center" }}
                  >
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <TextInput
                        placeholder="Confirm Password"
                        placeholderColor="#B5BFD0"
                        secureTextEntry={this.state.hidePassword2}
                        style={{
                          fontWeight: "bold",
                          paddingHorizontal: 20,
                          width: 260,
                        }}
                        onChangeText={(val) =>
                          this.onChangeText("confirmPassword", val)
                        }
                      />
                      <Icon
                        name={this.state.icon2}
                        size={20}
                        color="#B5BFD0"
                        onPress={this._changeIcon2}
                      />
                    </View>
                  </Box>
                  {this.state.confirmPassword != '' && this.state.passwordsDontMatch && (
                    <Text style={{
                      color:this.state.passwordsDontMatch ? "#ea688a":"#4e7bb4" , 
                      marginLeft:"15%",
                      fontWeight:"bold"

                    }}>
                      {"Passwords Don't Match"}
                      </Text>
                  )}
                </View>
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
                    onPress={this.onRegister}
                  >
                    <Text
                      style={{ color: "#fff", fontWeight: "bold", fontSize: 12 }}
                    >
                      SIGN UP
                    </Text>
                  </TouchableOpacity>
                </LinearGradient>
                <View style={{ alignSelf: "center", flexDirection: "row" }}>
                  <Text
                    style={{
                      color: "#a9b6c8",
                      marginTop: 10,
                      fontWeight: "bold",
                    }}
                  >
                    Already a User?
                  </Text>
                  <TouchableOpacity
                    onPress={() => this.props.navigation.goBack()}
                  >
                    <Text
                      style={{
                        color: "#6C90C4",
                        marginTop: 10,
                        textAlign: "center",
                        marginLeft: 5,
                        fontWeight: "bold",
                      }}
                    >
                      Log In.
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAwareScrollView>
          {/* </KeyboardAvoidingView> */}
          <KeyboardAvoidingView behavior="position">
            <View
              style={{
                width: "100%",
                position: "absolute",
                // marginTop: 20,
                // top: "10%",
                bottom: this.state.keyboardOn ? -500 : 0,
              }}
            >
              <Image
                source={require("../assets/group.png")}
                style={{ width: "100%", zIndex: -1 }}
                // style={{borderWidth: 1, borderColor: 'black'}}
                // style={{alignSelf:'center', height: 100, width: 100, marginBottom: '10%'}}
              />
            </View>
          </KeyboardAvoidingView>
        </View>
      );
    }

  }
}