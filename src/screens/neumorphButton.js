import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';
import { BoxShadow } from 'react-native-shadow';

// let notchange = heightB < widthB ? widthB : heightB;
export default class neumorphTest extends Component {
  render() {
    let widthB = this.props.width;
    let heightB = this.props.height;
    let borderRadiusB = this.props.borderRadius;
    let change = heightB > widthB ? widthB : heightB;
    let yChange = heightB <= widthB ? 0.3 * change : 0.2 * change;
    const shadowOpt = {
      width: widthB - 0.2 * change,
      height: heightB - 0.2 * change,
      color: '#000',
      border: 0.2 * change,
      radius: borderRadiusB - 0.25 * borderRadiusB,
      opacity: 0.18,
      x: 0.2 * change,
      y: yChange,
      style: { marginVertical: 5 },
    };
    const shadowOpt2 = {
      width: widthB - 0.2 * change,
      height: heightB - 0.2 * change,
      color: '#fff',
      border: 0.2 * change,
      radius: borderRadiusB - 0.2 * borderRadiusB,
      opacity: 1,
      x: -0.0001 * change,
      y: -0.0001 * change,
      style: { marginVertical: 5 },
    };
    return (
      //   <View
      //     style={{

      //     }}>
      <View
        style={[
          {
            //   backgroundColor: 'rgba(234,235,243,1)',
            width: widthB + 0.2 * change,
            height: heightB + yChange,
            //   marginLeft: 50,
            //   alignItems: 'center',
          },
          this.props.style,
        ]}>
        <BoxShadow setting={shadowOpt}>
          <BoxShadow setting={shadowOpt2}>
            <View
              style={[{
                position: 'relative',
                width: widthB,
                height: heightB,
                backgroundColor: '#eaebf3',
                borderRadius: borderRadiusB,
                borderWidth: 1,
                borderColor: '#e5e5e5',
                overflow: 'hidden',
              }, this.props.styleChildren]}>
              {this.props.children}
            </View>
          </BoxShadow>
        </BoxShadow>
      </View>
      //   </View>
    );
  }
}
neumorphTest.propTypes = {
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  borderRadius: PropTypes.number.isRequired,
};
