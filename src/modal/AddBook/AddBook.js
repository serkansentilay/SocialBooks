import { Text, View, TextInput, TouchableOpacity, Image, Platform, Alert } from 'react-native'
import React, { useState } from 'react'
import Modal from "react-native-modal";
import ImagePicker from "react-native-image-crop-picker"
import storage from '@react-native-firebase/storage';
import database from '@react-native-firebase/database';
import firestore from "@react-native-firebase/firestore"

const AddBook = ({ isVisible, onClose, user }) => {
    const [name, setName] = useState()
    const [description, setDescription] = useState()
    const [firstPublished, setFirstPublished] = useState()
    const [photoURL, setPhotoURL] = useState()
    const [writer, setWriter] = useState()
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

    const saveToDatabaseBooks = async () => {
        const uploadUri = photoURL
        console.log("uploadUri ", uploadUri)
        let fileName = uploadUri.substring(uploadUri.lastIndexOf('/') + 1)
        console.log("filename", fileName)
        let dotIndex = fileName.indexOf(".")
        console.log("dotIndex", dotIndex)
        let docId = fileName.slice(0, dotIndex)
        console.log("docId", docId)
        let normalId = docId.replace("-", "").replace("-", "").replace("-", "").replace("-", "").replace("-", "")
        console.log("normalId", normalId)

        const url = await storage().ref(`${user.uid}/${fileName}`).getDownloadURL();
        console.log("storagedaki download url", url)

        firestore().collection("Books").doc(normalId).set({
            name,
            description,
            firstPublished,
            photoURL: url,
            writer,
            uid: normalId
        })
        //realteime ekleme
        //
        // database().ref("/Books").push().set({
        //     name,
        //     description,
        //     firstPublished,
        //     photoURL: url,
        //     writer
        // })
        setUploading(false)
    }

    const submitSaveToBooks = async () => {
        //database booksa ekle
        if (name == null || description == null || firstPublished == null || photoURL == null || writer == null) {
            return Alert.alert("ERROR", "Please fill in this blanks")
        }
        await saveToStorage()
        await saveToDatabaseBooks()
        onClose()
        Alert.alert("SAVED", "Book is saved the books library")
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
                <TextInput
                    style={{ borderWidth: 1, backgroundColor: 'white', width: '70%', color: 'black' }}
                    placeholder='Name'
                    placeholderTextColor={'black'}
                    value={name}
                    onChangeText={setName}
                    maxLength={25}
                />
                <TextInput
                    style={{ borderWidth: 1, backgroundColor: 'white', width: '70%', color: 'black' }}
                    placeholder='Description'
                    placeholderTextColor={'black'}

                    value={description}
                    onChangeText={setDescription}
                    maxLength={100}
                />
                <TextInput
                    style={{ borderWidth: 1, backgroundColor: 'white', width: '70%', color: 'black' }}
                    placeholder='FirstPublished'
                    placeholderTextColor={'black'}

                    value={firstPublished}
                    onChangeText={setFirstPublished}
                    maxLength={4}
                    keyboardType='number-pad'
                />
                <TextInput
                    style={{ borderWidth: 1, backgroundColor: 'white', width: '70%', color: 'black' }}
                    placeholder='Writer'
                    placeholderTextColor={'black'}

                    value={writer}
                    onChangeText={setWriter}
                    maxLength={25}
                />
                <TouchableOpacity onPress={photoAdd}>
                    <Image source={photoURL ? { uri: photoURL } : require("../../assets/camera.png")}
                        resizeMode='contain'
                        width={50}
                        height={50} />
                </TouchableOpacity>
                {uploading && <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold', color: 'gray' }}>{transferred} & completed</Text>}
                <TouchableOpacity onPress={submitSaveToBooks}>
                    <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold', color: 'green' }}>Save</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    )
}

export default AddBook
