import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import BottomNavigator from './Navigator/BottomNavigator';
import Login from './Pages/Login';
import auth from "@react-native-firebase/auth"
import { useSelector } from 'react-redux';

const Router = () => {
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState();
    console.log("router user", user)
    // Handle user state changes
    function onAuthStateChanged(user) {
        setUser(user);
        if (initializing) setInitializing(false);
    }

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount
    }, []);
    return (
        <NavigationContainer>
            {user ? <BottomNavigator /> : <Login />}
        </NavigationContainer>

    )
}

export default Router

