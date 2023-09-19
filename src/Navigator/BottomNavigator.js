import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Profil from '../Pages/Profil';
import { StackHomeNavigator, StackForYouNavigator, StackProfilNavigator } from './StackNavigator';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { Text } from 'react-native';
import firestore from "@react-native-firebase/firestore"
import auth from "@react-native-firebase/auth"
import { updateData } from '../context/userContext/userContextSlice';
const Tab = createBottomTabNavigator();

export default function BottomNavigator() {
    const dispatch = useDispatch()
    const user = auth().currentUser
    console.log("bototmnavigatorr", user)

    const changeData = () => {
        firestore().collection("Users").doc(user.uid).onSnapshot(async snap => {
            if (snap.exists) {
                console.log("changedata bototmanvi", snap.data())
                const value = snap.data()
                dispatch(updateData(value))
            }
        })
    }


    const existData = () => {
        firestore()
            .collection("Users")
            .doc(user.uid)
            .onSnapshot(async snap => {
                if (!snap.exists) {
                    console.log("snap yok")
                    await firestore().collection("Users").doc(user.uid).set({
                        uid: user.uid,
                        displayName: user.displayName,
                        email: user.email,
                        photoURL: user.photoURL
                    })
                }
                console.log("snap var ", snap)
            })
    }

    useEffect(() => {
        existData()
        changeData()
    }, [])



    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen name="HomeTab" component={StackHomeNavigator} />
            <Tab.Screen name="ForYouTab" component={StackForYouNavigator} />
            <Tab.Screen name="ProfilTab" component={StackProfilNavigator} />
        </Tab.Navigator>
    )
}