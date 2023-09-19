import { Text, View, Image, TouchableOpacity, TextInput, Platform, Alert } from 'react-native'
import React, { useState } from 'react'
import styles from "./EditProfilModal.style"
import Modal from "react-native-modal";
import ImagePicker from "react-native-image-crop-picker"
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import { updateData } from '../../context/userContext/userContextSlice';
import { useDispatch } from 'react-redux';


const EditProfilModal = ({ isVisible, onClose, displayName, photoURL, uid }) => {
    const [photo, setPhoto] = useState(photoURL)
    const [name, setName] = useState(displayName)
    const [uploading, setUploading] = useState(false)
    const [transferred, setTransferred] = useState(0)
    const dispatch = useDispatch()

    const photoAdd = () => {
        ImagePicker.openPicker({
            width: 200,
            height: 200,
            mediaType: 'photo',
            cropping: true
        }).then(image => {
            console.log("imageee", image)
            const imageUri = Platform.OS === "ios" ? image.sourceURL : image.path
            setPhoto(imageUri)
        })
    }

    const saveToStorage = async () => {
        const uploadUri = photo
        console.log("uploadUri ", uploadUri)
        let fileName = uploadUri.substring(uploadUri.lastIndexOf('/') + 1)

        console.log("fileName ", fileName)

        setUploading(true)
        setTransferred(0)

        const task = storage().ref(`${uid}/${fileName}`).putFile(uploadUri);
        task.on('state_changed', taskSnapshot => {
            console.log(`${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`);
            setTransferred(Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) * 100)
        });

        try {
            await task
            console.log("photo saved to storage")
            setUploading(false)
        } catch (error) {
            console.log("saveToStorage error", error)
            setUploading(false)

        }

    }

    const saveToFirestoreUser = async () => {
        const uploadUri = photo
        console.log("uploadUri ", uploadUri)
        let fileName = uploadUri.substring(uploadUri.lastIndexOf('/') + 1)

        const url = await storage().ref(`${uid}/${fileName}`).getDownloadURL();
        console.log("storagedaki download url", url)
        await firestore().collection("Users").doc(uid).update({
            displayName: name,
            photoURL: url
        }).then(st => {
            console.log("saved to firestore")


        })
    }

    const changeData = () => {
        firestore().collection("Users").doc(uid).onSnapshot(async snap => {
            if (snap.exists) {
                console.log("changedata bototmanvi", snap.data())
                const value = snap.data()
                dispatch(updateData(value))
            }
        })
    }

    const submitSave = async () => {
        if (photo === photoURL) {
            if (name != displayName) {
                await firestore().collection("Users").doc(uid).update({
                    displayName: name,
                })
                onClose()
                changeData()
                Alert.alert("Updated", "Updated successfully photo and name")
            }
        } else {
            await saveToStorage()
            await saveToFirestoreUser()
            onClose()
            changeData()
            Alert.alert("Updated", "Updated successfully photo and name")

        }
    }

    return (
        <Modal
            isVisible={isVisible}
            onBackButtonPress={onClose}
            onBackdropPress={onClose}
            onSwipeComplete={onClose}
            swipeDirection={'down'}

        >
            <View style={{ justifyContent: 'center', alignContent: 'center', backgroundColor: 'white', height: 150, borderRadius: 15 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginVertical: 10 }}>
                    <TouchableOpacity onPress={photoAdd}>
                        <Image
                            source={photo ? { uri: photo } : require("../../assets/camera.png")}
                            resizeMode='contain'
                            width={50}
                            height={50}
                        />
                    </TouchableOpacity>
                    <TextInput
                        style={{ borderWidth: 1, backgroundColor: 'white', width: '70%' }}
                        placeholder={name}
                        placeholderTextColor='gray'
                        value={name}
                        onChangeText={setName}
                        maxLength={25}
                        numberOfLines={1}
                    />
                </View>
                {uploading && <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold', color: 'gray' }}>{transferred} & completed</Text>}

                <TouchableOpacity onPress={submitSave}>
                    <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold', color: 'green' }}>Save</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    )
}

export default EditProfilModal
