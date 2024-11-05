import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import ClassStack from './ClassStack/ClassStack';
import UserProfileScreen from './UserProfileScreen';

const Tab = createBottomTabNavigator();

export default function HomeTab() {

    return (
            
        <Tab.Navigator initialRouteName='ClassStack' screenOptions={{headerShown: false}}>
            <Tab.Screen name="ClassStack" component={ClassStack}/>
            <Tab.Screen name="Profile" component={UserProfileScreen} />
        </Tab.Navigator>
    )
}