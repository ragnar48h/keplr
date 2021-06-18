import {createStackNavigator} from 'react-navigation-stack';
import audioRoom from '../screens/audioRoom';
import profile from '../screens/profile';
import audioRoomHome from '../screens/audioRoomHome';

const normalNavigator = createStackNavigator(
  {
    openingScreen: {
      screen: audioRoomHome,
    },
    audioRoom: {
      screen: audioRoom,
    },
    profile: {
      screen: profile,
    },
  },
  {
    headerMode: 'none',
  },
);

export default normalNavigator;
