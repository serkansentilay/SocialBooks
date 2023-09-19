import { Text, View, TouchableOpacity, TextInput, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import Modal from "react-native-modal";
import ImagePicker from "react-native-image-crop-picker"
import firestore from "@react-native-firebase/firestore"
import storage from '@react-native-firebase/storage';

const AddForYou = ({ isVisible, onClose, user }) => {
    const [about, setAbout] = useState(null)
    const [photoURL, setPhotoURL] = useState(null)
    const [uploading, setUploading] = useState(false)
    const [transferred, setTransferred] = useState(0)

    const photoAdd = () => {
        ImagePicker.openPicker({
            width: 200,
            height: 200,
            mediaType: 'photo',
            cropping: true
        }).then(image => {
            console.log("imageee", image)
            const imageUri = Platform.OS === "ios" ? image.sourceURL : image.path
            setPhotoURL(imageUri)
        })
    }
    const saveToStorage = async () => {
        const uploadUri = photoURL
        console.log("uploadUri ", uploadUri)
        let fileName = uploadUri.substring(uploadUri.lastIndexOf('/') + 1)

        console.log("fileName ", fileName)

        setUploading(true)
        setTransferred(0)

        const task = storage().ref(`${user.uid}/${fileName}`).putFile(uploadUri);
        task.on('state_changed', taskSnapshot => {
            console.log(`${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`);
            setTransferred(Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) * 100)
        });

        try {
            await task
            console.log("photo saved to storage")

        } catch (error) {
            console.log("saveToStorage error", error)
            setUploading(false)

        }

    }

    const saveForYouToFirestore = async () => {
        const uploadUri = photoURL
        console.log("uploadUri ", uploadUri)
        let fileName = uploadUri.substring(uploadUri.lastIndexOf('/') + 1)
        console.log("filename", fileName)
        const url = await storage().ref(`${user.uid}/${fileName}`).getDownloadURL();
        console.log("storagedaki download url", url)
        //firestore kaydet
        firestore().collection("Foryou").add({
            userName: user.name,
            email: user.email,
            photoURL: url,
            uid: user.uid,
            about: about,
            date: new Date()
        })

        setUploading(false)

    }

    const submitForYou = async () => {
        if (about == null || photoURL == null) {
            return Alert.alert("ERROR", "Please fill in this blanks")
        }
        await saveToStorage()
        await saveForYouToFirestore()
        onClose()
        Alert.alert("SAVED", "Post is saved the for you library")
    }

    return (
        <Modal
            isVisible={isVisible}
            onBackButtonPress={onClose}
            onBackdropPress={onClose}
            onSwipeComplete={onClose}
            swipeDirection={'down'}
        >
            <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', paddingVertical: 10 }}>
                <Text style={{ color: 'black' }}>Share a Post</Text>
                <TextInput
                    style={{ borderWidth: 1, backgroundColor: 'white', width: '70%', color: 'black' }}
                    placeholder='About'
                    placeholderTextColor={'black'}
                    value={about}
                    onChangeText={setAbout}
                    maxLength={50}
                    multiline={true}
                    numberOfLines={3}
                />
                <TouchableOpacity onPress={photoAdd}>
                    <Image source={photoURL ? { uri: photoURL } : require("../../assets/camera.png")}
                        resizeMode='contain'
                        width={50}
                        height={50} />
                </TouchableOpacity>
                {uploading && <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold', color: 'gray' }}>{transferred} & completed</Text>}
                <TouchableOpacity onPress={submitForYou}>
                    <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold', color: 'green' }}>Save</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    )
}

export default AddForYou
