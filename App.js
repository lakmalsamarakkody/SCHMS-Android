/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import Login from './screens/Login'
import Scan from './screens/Scan'
import Details from './screens/Details'


const MainNavigator = createStackNavigator(
	{
		Login: {
			screen: Login
		},
		Scan: {
			screen: Scan
		},
		Details: {
			screen: Details,
			headerTitle: 'Fuck'
		}
	},
	{
		initialRouteName: 'Login'
	}
);

const App = createAppContainer(MainNavigator);

export default App;
