// src/AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import AddContactScreen from './screens/AddContactScreen';
import WorkFinishedScreen from './screens/WorkFinishedScreen';
import DeliveredScreen from './screens/DeliveredScreen';
import StatusScreen from './screens/StatusScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="AddContact" component={AddContactScreen} />
                <Stack.Screen name="WorkFinished" component={WorkFinishedScreen} />
                <Stack.Screen name="Delivered" component={DeliveredScreen} />
                <Stack.Screen name="Status" component={StatusScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
