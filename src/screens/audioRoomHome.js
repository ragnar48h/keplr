import React, { Component } from 'react';
import {
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  FlatList,
  ActivityIndicator,
  Modal,
  TextInput,
  Keyboard,
  Platform,
  PermissionsAndroid
} from 'react-native';
import 'react-native-get-random-values'
import Icon from 'react-native-vector-icons/Feather';
import Material from 'react-native-vector-icons/MaterialIcons'
import Box from './neumorphButton';
import CBox from './customizableNeuButton';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import { GET_ROOMS, GET_CONNECTED } from '../redux/roomsRedux';
import ErrorPopup from './errorPopup'
import firestore from '@react-native-firebase/firestore'
import database from '@react-native-firebase/database'
import Toast from 'react-native-simple-toast'
import { v4 as uuidv4 } from 'uuid'
import {
  PulseIndicator,
} from 'react-native-indicators';

class audioRoomHome extends Component {
  constructor(props) {
    super(props);

    this.state = {
      createRoomModalVisible: false,
      buttonFetching: false,
      hashtag: '',
      caption: '',
      feedback: '',
      feedbackModalVisible: false,
      loading: true,
      getError: false,
      modalVisible: false,
      createError: false,
      createLoading: false,
      refreshing: false
    };

    PermissionsAndroid.request('android.permission.RECORD_AUDIO')

  }

  toggleCreateRoomModal = () => {
    this.setState({
      createRoomModalVisible: !this.state.createRoomModalVisible,
    });
  };


  onRefresh = () => {
    console.log("ONREFRESH")
  };

  getRooms = () => {
    database().ref('rooms').once('value')
      .then((query) => {
        var arr = []
        query.forEach(doc => {
          var obj = { id: doc.key }
          obj = { ...obj, ...doc.val() }
          arr.push(obj)
          // console.log("OBJ", obj)
        })
        this.props.dispatch({
          type: GET_ROOMS,
          payload: arr
        })
        this.setState({ loading: false })
        this.setState({ refreshing: false })
      })
      .catch(() => {
        this.setState({ refreshing: false })
        this.setState({ loading: false })
        this.setState({ getError: true })
      })

  }


  async componentDidMount() {

    database().ref('dummy').on('value', snap => {

    })

    database().ref('.info/connected').on('value', snap => {
      this.props.dispatch({
        type: GET_CONNECTED,
        payload: snap.val()
      })
    })

    this.getRooms()

  }

  componentDidUpdate(prevProps, prevState) {

    if (this.state.createLoading !== prevState.createLoading) {
      console.log("CREATE LOADING", this.state.createLoading)
    }

  }

  componentWillUnmount() {

    database().ref('dummy').off()
    database().ref('.info/connected').off()

  }

  // componentDidUpdate(prevProps , prevState) {
  //   if(this.props.connected !== prevProps.connected) {
  //     console.log("CONNECTED", prevProps.connected , this.props.connected )
  //   }
  // }

  render() {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: 'rgba(234,235,243,1)',
          // height: screenHeight,
        }}>
        <TopBar
          name={this.props.user.user.firstName}
          photoUrl={this.props.user.user.photoUrl}
          feedbackModal={() => this.setState({ feedbackModalVisible: true })}
          navigateToEditProfile={() =>
            this.props.navigation.navigate('profile')
          }
        />

        {/* ~~~~~~ This is create room button located at the bottom. ~~~~~~ */}
        <View
          style={{
            paddingBottom: 10,
            borderTopWidth: 2,
            borderTopColor: 'rgba(191,191,191,0.3)',
            backgroundColor: 'rgba(234,235,243,1)',
            alignItems: 'center',
            width: '100%',
            position: 'absolute',
            bottom: 0,
            zIndex: 5,
          }}>
          <CreateRoomButton
            height={40}
            width={300}
            text="CREATE ROOM"
            borderRadius={20}
            createRoom={async () => {
              var audio = true
              if (Platform.OS === 'android') {
                audio = await PermissionsAndroid.check('android.permission.RECORD_AUDIO')
              }
              if (this.props.connected) {
                if (audio) {
                  this.setState({ createRoomModalVisible: true })
                }
                else {
                  Toast.showWithGravity('Please give permission to access to audio in order to create a room', Toast.SHORT, Toast.CENTER)
                }
              }
              else {
                Toast.showWithGravity('Disconnected from internet. Can\'t create Room', Toast.SHORT, Toast.CENTER)
              }
            }}
          />
        </View>

        {/* Create Room Popup */}
        <Modal
          animationType='fade'
          transparent={true}
          visible={this.state.createRoomModalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,0.2)',
            }}>
            <View
              style={{
                height: 285,
                width: '80%',
                borderWidth: 3,
                borderColor: '#e5e5e5',
                backgroundColor: 'rgba(234,235,243,1)',
                borderRadius: 10,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 10,
                  alignItems: 'center',
                  paddingHorizontal: 15,
                }}>
                <Text
                  style={{
                    color: '#4e7bb4',
                    fontWeight: 'bold',
                    fontSize: 20,
                  }}>
                  Create Audioroom
                </Text>
                <Icon
                  name="x-circle"
                  style={{ color: '#EA688A' }}
                  size={25}
                  onPress={this.toggleCreateRoomModal}
                />
              </View>
              <View
                style={{
                  marginTop: 10,
                  borderBottomColor: '#BFBFBF',
                  borderBottomWidth: 2,
                  borderRadius: 2,
                  width: '100%',
                  opacity: 0.2,
                }}
              />
              <Box
                height={40}
                width={275}
                borderRadius={20}
                style={{ alignSelf: 'center', marginTop: 10 }}>
                <TextInput
                  placeholder="Hashtag/Title of the room"
                  placeholderTextColor="#B5BFD0"
                  style={{
                    fontWeight: 'bold',
                    paddingHorizontal: 20,
                    width: '100%',
                  }}
                  onChangeText={(text) => {
                    this.setState({ hashtag: text });
                  }}
                />
              </Box>
              <Box
                height={70}
                width={275}
                borderRadius={20}
                style={{ alignSelf: 'center', marginLeft: 10 }}>
                <TextInput
                  placeholder="Description"
                  multiline={true}
                  numberOfLines={3}
                  textAlignVertical="top"
                  placeholderTextColor="#B5BFD0"
                  style={{
                    fontWeight: 'bold',
                    paddingHorizontal: 20,
                    width: '100%',
                  }}
                  onChangeText={(text) => {
                    this.setState({ caption: text });
                  }}
                />
              </Box>
              <View style={{ alignSelf: 'center', marginTop: 10 }}>
                <CreateRoomButton
                  height={40}
                  width={275}
                  loading={this.state.createLoading}
                  borderRadius={20}
                  text="CREATE ROOM"
                  createRoom={() => {

                    if (!this.state.createLoading) {

                      if (this.props.connected) {
                        if (this.state.hashtag !== '') {
                          this.setState({ createLoading: true })
                          var roomId = uuidv4()
                          database().ref(`rooms/${roomId}`).set({
                            hashtag: this.state.hashtag,
                            na: 0,
                            nh: 0,
                            caption: this.state.caption,
                          })
                            .then(() => {
                              database().ref(`hosts/${roomId}`).set({
                                [`${this.props.user.user.username}`]: {
                                  value: -1,
                                  photoUrl: this.props.user.user.photoUrl
                                }
                              })
                                .then(() => {
                                  fetch('https://us-central1-keplr-4ff01.cloudfunctions.net/api/agoraToken', {
                                    method: 'POST',
                                    headers: {
                                      Accept: 'application/json',
                                      'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({
                                      roomId: roomId
                                    })
                                  })
                                    .then((res) => {
                                      return res.json()
                                    })
                                    .then((res) => {
                                      console.log("TYPE PF TOKEN", typeof (res.token))
                                      this.toggleCreateRoomModal()
                                      this.setState({ createLoading: false })
                                      this.props.navigation.navigate('audioRoom', { hashtag: this.state.hashtag, caption: this.state.caption, roomId: roomId, role: 3, agoraToken: res.token })
                                    })
                                    .catch((err) => {
                                      database().ref(`rooms/${roomId}`).remove().catch()
                                      database().ref(`hosts/${roomId}`).remove().catch()
                                      console.log("ERROR INSIDE", err)
                                      this.setState({ createLoading: false })
                                      Toast.showWithGravity('We encountered an error. Please Try Again', Toast.SHORT, Toast.CENTER)
                                    })

                                })
                                .catch((err) => {
                                  database().ref(`hosts/${roomId}`).remove().catch()
                                  console.log("ERROR OUTSIDE", err)
                                  this.setState({ createLoading: false })
                                  Toast.show('We encountered an error. Please Try Again.', Toast.SHORT)
                                  this.toggleCreateRoomModal()
                                })
                            })
                            .catch(() => {
                              database().ref(`rooms/${roomId}`).remove().catch()
                              this.setState({ createLoading: false })
                              Toast.show('No Internet Connection', Toast.SHORT)
                              this.toggleCreateRoomModal()
                            })
                        }
                        else {
                          Toast.show('Please enter the title of the room', Toast.SHORT)
                        }
                      }
                      else {
                        Toast.show('Disconnected from internet. Can\'t create Room', Toast.SHORT)
                      }

                    }

                  }}
                />
              </View>
            </View>
          </View>
        </Modal>
        {/* Add feedback submit function here. */}
        <FeedbackModal
          feedbackModalVisible={this.state.feedbackModalVisible}
          toggleCreateRoomModal={() =>
            this.setState({ feedbackModalVisible: false })
          }
          onChangeText={(text) => {
            this.setState({ feedback: text });
          }}
          submitFunction={() => {
            firestore().collection('feedback').add({
              text: this.state.feedback
            })
              .then(() => {
                this.setState({ feedbackModalVisible: false })
              })
              .catch(() => {
                this.setState({ feedbackModalVisible: false })
              })
          }}
        />
        {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~` */}
        {/* While making a flatlist here add marginBottom of 60. */}
        <ErrorPopup
          title="Error"
          subTitle='There was an error while fetching rooms. Please Retry'
          okButtonText="OK"
          clickFunction={() => {

            this.setState({ getError: false })
          }}
          modalVisible={this.state.getError}
        />
        {this.state.loading ? (
          <View style={{ flex: 1, justifyContent: 'center', marginBottom: 60 }}>
            <ActivityIndicator size="large" color="#EA7A7F" />
          </View>
        ) : this.props.rooms.length === 0 ? (
          <View
            style={{
              alignSelf: 'center',
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              marginBottom: 80,
            }}>
            <Image
              style={{ height: '50%', width: '60%', resizeMode: 'contain' }}
              source={require('../../Assets/noRooms.png')}
            />
            <Text
              style={{
                alignSelf: 'center',
                color: '#7f7f7f',
                // fontWeight: 'bold',
                fontSize: 17,
                marginTop: 20,
              }}>
              {' '}
                  No rooms yet.
                </Text>
            <Text
              style={{
                alignSelf: 'center',
                color: '#7f7f7f',
                // fontWeight: 'bold',
                fontSize: 17,
                marginTop: -5,
              }}>
              {' '}
                  Go on, create one!
                </Text>

            <Text
              style={{

                alignSelf: 'center',
                color: "#4e7bb4",
                fontWeight: 'bold',
                fontSize: 23,
                marginTop: 5,
              }}
              onPress={() => {
                this.getRooms()
                // console.log("REFRESH")
              }}
            >
              {' '}
                  Refresh
                </Text>
          </View>
        ) : (
              <FlatList
                style={{ marginBottom: 60, marginTop: 30 }}
                data={this.props.rooms}
                refreshing={this.state.refreshing}
                onRefresh={this.getRooms}
                keyExtractor={(item) => item['id']}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => {
                  var showText = ''
                  var count
                  if (item.nh !== undefined) {
                    count = item.nh
                  }
                  if (item.na !== undefined) {
                    if (item.nh !== undefined) {
                      count += item.na
                    }
                  }
                  if (item.participants !== undefined) {
                    var keys = Object.keys(item.participants)
                    if (keys.length === 0) {
                      showText = 'Be the first to start the conversation!';
                    } else if (keys.length === 1) {
                      showText = `${keys[0]} is already here!`;
                    } else if (keys.length === 2) {
                      showText = `${keys[0]} and ${keys[1]} are exchanging thoughts!`;
                    } else if (keys.length === 3) {
                      if (count !== undefined) {
                        showText = `${keys[0]},${keys[1]},${keys[2]} and ${count} other(s) are here!`
                      }
                      else {
                        showText = `${keys[0]},${keys[1]},${keys[2]} and other(s) are here!`
                      }
                    }
                  }

                  return (
                    <Room
                      hashtag={item.hashtag}
                      caption={item.caption}
                      joinButton={async () => {
                        if (this.props.connected) {
                          var audio = true
                          if (Platform.OS === 'android') {
                            audio = PermissionsAndroid.check('android.permission.RECORD_AUDIO')
                          }
                          if (audio) {

                            this.setState({ buttonFetching: item.id })

                            fetch('https://us-central1-keplr-4ff01.cloudfunctions.net/api/agoraToken', {
                              method: 'POST',
                              headers: {
                                Accept: 'application/json',
                                'Content-Type': 'application/json'
                              },
                              body: JSON.stringify({
                                roomId: item.id
                              })
                            })
                              .then((res) => {
                                return res.json()
                              })
                              .then((res) => {
                                console.log("TYPE OF TOKEN", typeof (res.token))
                                this.setState({ buttonFetching: false })
                                this.props.navigation.navigate('audioRoom', { caption: item.caption, hashtag: item.hashtag, roomId: item.id, role: 0, agoraToken: res.token })
                              })
                              .catch(() => {
                                this.setState({ buttonFetching: false })
                                Toast.showWithGravity('We encountered an error. Please Try Again', Toast.SHORT, Toast.CENTER)
                              })
                          }
                          else {
                            Toast.showWithGravity('Please give audio permission to join a room', Toast.SHORT, Toast.CENTER)
                          }

                        }
                        else {
                          Toast.showWithGravity('You have to be connected to the Internet to join a room', Toast.SHORT, Toast.CENTER)
                        }
                      }}
                      fetching={this.state.buttonFetching}
                      id={item.id}
                      adminJSON={item.admin}
                      participantsJSON={item.participants}
                      navigateToListOfParticipants={() => {
                        // console.log('listofparticipants');
                      }}
                      participantsCallToAction={showText}
                    />
                  );
                }}
              />
            )}
      </SafeAreaView>
    );
    // }
  }
}
class FeedbackModal extends Component {
  render() {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.props.feedbackModalVisible}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.2)',
          }}>
          <View
            style={{
              height: 250,
              width: '80%',
              borderWidth: 3,
              borderColor: '#e5e5e5',
              backgroundColor: 'rgba(234,235,243,1)',
              borderRadius: 10,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 10,
                alignItems: 'center',
                paddingHorizontal: 15,
              }}>
              <Text
                style={{
                  color: '#4e7bb4',
                  fontWeight: 'bold',
                  fontSize: 20,
                }}>
                Feedback
              </Text>
              <Icon
                name="x-circle"
                style={{ color: '#EA688A' }}
                size={25}
                onPress={this.props.toggleCreateRoomModal}
              />
            </View>
            <View
              style={{
                marginTop: 10,
                borderBottomColor: '#BFBFBF',
                borderBottomWidth: 2,
                borderRadius: 2,
                width: '100%',
                opacity: 0.2,
                marginBottom: 10,
              }}
            />
            <Box
              height={70}
              width={275}
              borderRadius={25}
              style={{ alignSelf: 'center', marginLeft: 10 }}>
              <TextInput
                placeholder="Your feedback will remain anonymous."
                multiline={true}
                numberOfLines={3}
                textAlignVertical="top"
                onChangeText={this.props.onChangeText}
                style={{
                  fontWeight: 'bold',
                  paddingHorizontal: 20,
                  width: '100%',
                  color: '#7f7f7f',
                }}
              />
            </Box>
            <View style={{ alignSelf: 'center', marginTop: 10 }}>
              <CreateRoomButton
                height={40}
                width={275}
                borderRadius={20}
                text="SUBMIT"
                createRoom={this.props.submitFunction}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}
// This is the room items, the props are:
// hashtag: String, the name of the room.
// caption: String, the caption/topic or whatever.
// joinButton: Function, add join navigation logic here.
// adminJSON: JSON, list of admins, the one with Elon Musk, Messi and AddyK. Each item must be in the following format:
//         //~~~~To keep a good UI try restricting number of admins shown to 3.~~~~~//
//         id: number, indicating the id in the list,
//         photoUrl: can be uri or require, the photo of the admin, eq: require('../../../Assets/stock.jpg'),
//         username:string,eg: 'Elon Musk',
//         bio:string, eg: "Author, feminist, critic. 'A Room of One's Own', out 9/29 from @HogarthPress. Author, feminist, critic. 'A Room of One's Own', out 9/29 from @HogarthPress.",
//         navigateToProfile: Add logic at =(1)= ,below see line 190. Shud be an onPress which navigates to profile,
// particaipantJSON:  JSON, list of participants, Each item will have:
//        //~~~~To keep a good UI try restricting number of participantsList shown to 4.~~~~~//
//        id: number, indicating the id in the list,
//        photoUrl: can be uri or require, the photo of the admin, eq:require('../../../Assets/stock.jpg'),
// navigateToListOfParticipants: Function, onPress it shud navigate to show a list of users in this room.
// participantsCallToAction: String, saying who all are hanging in this room.
// ~~~~~~~~~~~~~~~~~~CHANGE LINE 190 ACCORDINGLY.~~~~~~~~~~~~~~~
// Check below for more comments.
export class Room extends Component {
  render() {
    var load = false;
    if (this.props.fetching !== false) {
      if (this.props.id === this.props.fetching) {
        load = true;
      }
    }

    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: 15,
            justifyContent: 'space-between',
          }}>
          <View style={{ marginTop: 10 }}>
            <Text style={{ fontWeight: 'bold', color: '#A1AFC3' }}>
              {this.props.hashtag}
            </Text>
            <Text
              ellipsizeMode="tail"
              numberOfLines={1}
              style={{ fontWeight: 'bold', color: '#bebebe', width: 270 }}>
              {this.props.caption}
            </Text>
          </View>
          <JoinButton
            joinButton={this.props.joinButton}
            fetching={this.props.fetching}
            shouldLoad={load}
            key={`join${this.props.id}`}
          />
        </View>
        {this.props.adminJSON !== undefined && Object.keys(this.props.adminJSON).map((item) => {
          return (
            <PhotoAndBio
              key={item}
              photoUrl={this.props.adminJSON[item]['photoUrl']}
              username={item}
              bio={this.props.adminJSON[item]['bio']}
              // ~~~~~~~~~~~~~~~~~  =(1)= Add navigate to Profile Logic here, per item of JSON. ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
              navigateToProfile={() => {
                // console.log(item.navigateToProfile);
              }}
            />
          );
        })}
        <View style={{ alignSelf: 'center', marginTop: 5 }}>
          <View
            style={{
              flexDirection: 'row',
              alignSelf: 'center',
              marginLeft: 20,
            }}>
            {this.props.participantsJSON !== undefined && Object.keys(this.props.participantsJSON).map((item) => {
              return (
                <Image
                  key={item}
                  source={{ uri: this.props.participantsJSON[item] }}
                  style={{
                    marginLeft: -20,
                    height: 50,
                    width: 50,
                    borderRadius: 25,
                    borderWidth: 2,
                    borderColor: '#4e7bb4',
                  }}
                />
              );
            })}
          </View>
          <Text
            style={{
              fontWeight: 'bold',
              color: '#bebebe',
              width: 180,
              marginTop: 7,
              textAlign: 'center',
              fontSize: 12,
            }}
            onPress={this.props.navigateToListOfParticipants}>
            {this.props.participantsCallToAction}
          </Text>
        </View>
        <View
          style={{
            marginTop: 5,
            borderBottomColor: '#BFBFBF',
            borderBottomWidth: 2,
            borderRadius: 2,
            width: '90%',
            marginTop: 10,
            alignSelf: 'center',
            opacity: 0.2,
          }}
        />
      </View>
    );
  }
}
export class TopBar extends Component {
  render() {
    // console.log("PHOTOURL",this.props.photoUrl)
    return (
      <View style={{ marginLeft: 25 }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingRight: 10,
            backgroundColor: 'rgba(234,235,243,1)',
          }}>
          <View style={{ marginTop: 20, marginLeft: 5 }}>
            <Material
              name="feedback"
              color="#7f7f7f"
              size={25}
              onPress={this.props.feedbackModal}
            />
            <Text style={{ fontSize: 20, color: '#7f7f7f', marginTop: 15 }}>
              Hello,
            </Text>
          </View>
          <View style={{ marginTop: 10 }}>
            <CBox
              height={100}
              width={100}
              borderRadius={15}
              borderBlack={25}
              radiusBlack={10}
              xBlack={15}
              yBlack={15}
              borderWhite={10}
              radiusWhite={10}
              xWhite={-1}
              yWhite={-1}
              style={{ marginLeft: 4 }}>
              <Image
                style={{ height: 100, width: 100, borderRadius: 15 }}
                source={{
                  uri: this.props.photoUrl
                }}
              />
            </CBox>
            <TouchableOpacity
              style={{
                position: 'absolute',
                top: -4,
                right: 6,
                zIndex: 2,
                alignItems: 'center',
                justifyContent: 'center',
                height: 30,
                width: 30,
                borderRadius: 15,
                backgroundColor: 'rgba(234,235,243,1)',
                elevation: 10,
              }}
              onPress={this.props.navigateToEditProfile}>
              <Icon name="edit" color="#4e7bb4" size={20} />
            </TouchableOpacity>
          </View>
        </View>
        <Text
          ellipsizeMode="tail"
          numberOfLines={1}
          style={{
            color: '#4e7bb4',
            fontSize: 45,
            fontWeight: 'bold',
            marginTop: -55,
            width: '55%',
          }}>
          {/* Aryaman */}
          {this.props.name}
        </Text>
        <Text style={{ color: 'rgba(0,0,0,0.8)', fontSize: 20, marginTop: -5 }}>
          Let's explore something new.
        </Text>
      </View>
    );
  }
}
export class CreateRoomButton extends Component {

  constructor(props) {
    super(props)

    this.state = {
      loading: (this.props.loading === true ? true : false)
    }
  }

  componentDidUpdate(prevProps, prevState) {

    if (this.props.loading !== prevProps.loading) {

      if (this.props.loading === true) {
        this.setState({ loading: true })
      }
      else {
        this.setState({ loading: false })
      }

    }

  }

  render() {
    return (
      <TouchableOpacity
        onPress={this.props.createRoom}>
        <Box height={40} width={275} borderRadius={20}>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={['#EA688A', '#EA7A7F']}
            style={{
              height: 40,
              borderRadius: 20,
              width: 300,
              alignSelf: 'center',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'transparent',
                height: 40,
                width: 300,
              }}
            >
              {!this.state.loading &&
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 12 }}>
                  {this.props.text}
                </Text>
              }
              {this.state.loading &&
                <PulseIndicator color="#4e7bb4" size={40} />
              }
            </View>
          </LinearGradient>
        </Box>
      </TouchableOpacity>
    );
  }
}
export class JoinButton extends Component {
  render() {
    return (
      <Box height={40} width={60} borderRadius={20}>
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={['#EA688A', '#EA7A7F']}
          style={{
            height: 40,
            borderRadius: 20,
            width: 60,
            borderWidth: 1,
            borderColor: '#e5e5e5',
            alignSelf: 'center',
            justifyContent: 'center',
          }}>
          {/* <Icon
            onPress={this.props.joinButton}
            name="user-plus"
            color="#fff"
            size={20}
            style={{alignSelf: 'center'}}
          /> */}
          {!this.props.shouldLoad && (
            <TouchableOpacity
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'transparent',
                height: 40,
                width: 60,
              }}
              onPress={this.props.joinButton}>
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 12 }}>
                JOIN
              </Text>
            </TouchableOpacity>
          )}
          {this.props.shouldLoad && (
            <PulseIndicator color="#4e7bb4" size={40} />
          )}
        </LinearGradient>
      </Box>
    );
  }
}
export class Photo extends Component {
  render() {
    return (
      <Box height={55} width={55} borderRadius={10}>
        <TouchableWithoutFeedback
          style={{
            height: 55,
            width: 55,
            borderRadius: 10,
            backgroundColor: 'rgba(234,235,243,1)',
            borderWidth: 1,
            borderColor: '#e5e5e5',
            alignSelf: 'center',
            justifyContent: 'center',
          }}
          onPress={this.props.navigateToProfile}>
          <Image
            source={{ uri: this.props.photoUrl }}
            style={{ height: 55, width: 55 }}
          />
        </TouchableWithoutFeedback>
      </Box>
    );
  }
}
export class PhotoAndBio extends Component {
  render() {
    return (
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 15,
          alignItems: 'center',
        }}>
        <Photo
          photoUrl={this.props.photoUrl}
          navigateToProfile={this.props.navigateToProfile}
        />
        <View style={{ marginRight: 70, marginLeft: 10 }}>
          <Text
            onPress={this.props.navigateToProfile}
            style={{ fontWeight: 'bold', color: '#A1AFC3' }}>
            {this.props.username}
          </Text>
          <Text
            style={{ fontWeight: 'bold', color: '#bebebe', fontSize: 12 }}
            ellipsizeMode="tail"
            numberOfLines={2}>
            {this.props.bio}
          </Text>
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    rooms: state.rooms.rooms,
    user: state.user,
    connected: state.rooms.connected,
  };
};

export default connect(mapStateToProps)(withNavigation(audioRoomHome));
