import { Text, View, Button, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState, useMemo } from 'react'
import styles from "./Profil.style"
import ProfilHeader from '../../components/ProfilHeader'
import { useDispatch, useSelector } from 'react-redux';
import { signOutGoogle, updateData } from '../../context/userContext/userContextSlice';
import firestore from "@react-native-firebase/firestore"
import EditProfilModal from '../../modal/EditProfilModal';
import ProfilTabView from '../../components/ProfilTabView';

// const handleRemoveFavorited = (id) => {
//     firestore().collection("Users").doc(user.uid).collection("Favorited").doc(id).delete()
//     Alert.alert("Deleted", "Successfully deleted your favorited book")
// }


const Profil = () => {
    const dispatch = useDispatch()

    const { user } = useSelector(state => state.auth)
    const [isModalVisible, setModalVisible] = useState(false);
    console.log("selector user", user)




    const updateFirestore = () => {
        firestore().collection("Users").doc(user.uid).onSnapshot(snap => {
            console.log("updatefirestore gelen snap ", snap)
            if (snap.exists) {
                const value = snap.data()
                dispatch(updateData(value))

            }
        })
    }



    const submitOut = () => {
        dispatch(signOutGoogle())
    }
    const toggleVisibleModal = () => {
        setModalVisible(!isModalVisible);
    };
    const toggleCloseModal = () => {
        setModalVisible(!isModalVisible);
        updateFirestore()
    };

    return (
        <View style={{ flex: 1 }}>
            <View>
                <TouchableOpacity style={{ marginRight: 20, marginVertical: 5 }} onPress={toggleVisibleModal}>
                    <Text style={{ textAlign: 'right', fontSize: 20, color: 'green', fontWeight: 'bold' }}>Edit Profil</Text>
                </TouchableOpacity>
                <EditProfilModal uid={user?.uid} displayName={user?.displayName} photoURL={user?.photoURL} isVisible={isModalVisible} onClose={toggleCloseModal} />
                <ProfilHeader text={user?.displayName} url={user?.photoURL} />
            </View>
            <ProfilTabView user={user} />

            <Button title='ÇIKIŞ' onPress={submitOut} />
        </View>
    )
}

export default Profil
