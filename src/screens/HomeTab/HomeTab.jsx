import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ClassStack from './ClassStack/ClassStack';
import UserProfileScreen from './UserProfileScreen';

const Tab = createBottomTabNavigator();

export default function HomeTab() {

    return (
            
        <Tab.Navigator initialRouteName="Home" screenOptions= {({route}) => ({
        
            tabBarStyle: [{backgroundColor:"black"}], 
            headerShown: false, 
            tabBarIcon: ({focused}) => {

                let iconName;

                if(route.name === "ClassStack") {

                    iconName= "school";
                }

                else if(route.name === "Home") {

                    iconName= "home";
                }

                else if(route.name === "Profile") {

                    iconName="person";
                }

                if(focused) {

                    color = "skyblue"
                }

                else {

                    color = "white"
                }

                return <Ionicons name={iconName} color={color} size= {20}/>
                   
            },
            tabBarActiveTintColor: "skyblue",
            tabBarInactiveTintColor: "white"
        })}>
            <Tab.Screen name="ClassStack" component={ClassStack}/>
            <Tab.Screen name="Profile" component={UserProfileScreen} />
        </Tab.Navigator>
    )
}