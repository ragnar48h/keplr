// How to use this thing:
// <ErrorPopup
//  title="Success"
//  subTitle="You are successfully logged out of your account. Log In again to use your favourite platform."
//  okButtonText="OK"
//  clickFunction={() => {
//   this.setState({ modalVisible: !this.state.modalVisible }); //Always keep this thing here
//   console.log("blah"); //Add any more functions here.
//  }}
//  modalVisible={this.state.modalVisible}
// />
// Now to make it toggle, toggle state modalVisibile.
// To try to out use 'test.js' in 'screens'.

import React, { Component } from "react";
import { Text, View, Modal, Dimensions, TouchableOpacity } from "react-native";
import Box from "./neumorphButton";
import LinearGradient from "react-native-linear-gradient";
import PropTypes from "prop-types";
const screenWidth = Math.round(Dimensions.get("window").width);
export default class defaultErrorPopup extends Component {
  render() {
    return (
      <View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.props.modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            <View
              style={{
                // height: 200,
                width: "80%",
                backgroundColor: "rgba(234,235,243,1)",
                borderRadius: 10,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "#4e7bb4",
                  fontSize: 25,
                  fontWeight: "bold",
                  marginTop: 15,
                }}
              >
                {this.props.title}
              </Text>
              <Text
                style={{
                  color: "#A1AFC3",
                  fontSize: 18,
                  marginTop: 10,
                  marginHorizontal: 25,
                  alignSelf: "center",
                  textAlign: "center",
                  marginBottom: 100,
                }}
              >
                {this.props.subTitle}
              </Text>
              <View
                style={{
                  position: "absolute",
                  bottom: 20,
                  alignSelf: "center",
                }}
              >
                <View
                  style={{
                    borderBottomColor: "#BFBFBF",
                    borderBottomWidth: 2,
                    borderRadius: 2,
                    width: "100%",
                    opacity: 0.2,
                    marginBottom: 5,
                  }}
                />
                <Box height={40} width={0.7 * screenWidth} borderRadius={20}>
                  <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    colors={["#EA688A", "#EA7A7F"]}
                    style={{
                      height: 40,
                      borderRadius: 20,
                      width: 0.7 * screenWidth,
                      alignSelf: "center",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "transparent",
                        height: 40,
                        width: 0.7 * screenWidth,
                      }}
                      onPress={() => {
                        // this.setState({
                        //   modalVisible: !this.state.modalVisible,
                        // });
                        this.props.clickFunction();
                      }}
                    >
                      <Text
                        style={{
                          color: "#fff",
                          fontWeight: "bold",
                          fontSize: 12,
                        }}
                      >
                        {this.props.okButtonText}
                      </Text>
                    </TouchableOpacity>
                  </LinearGradient>
                </Box>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
defaultErrorPopup.propTypes = {
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string.isRequired,
  okButtonText: PropTypes.string.isRequired,
  clickFunction: PropTypes.func.isRequired,
  modalVisible: PropTypes.bool.isRequired,
};
