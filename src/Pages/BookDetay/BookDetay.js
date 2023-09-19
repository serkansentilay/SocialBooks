import { Text, View, Image, Button, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import styles from "./BookDetay.style"
import firestore from "@react-native-firebase/firestore"
import { useSelector } from 'react-redux'


const BookDetay = ({ route }) => {
    const { book } = route.params
    const { user } = useSelector(state => state.auth)
    console.log("titemxbook", book)
    const [readed, setReaded] = useState(false)
    const [favorited, setFavorited] = useState(false)

    useEffect(() => {
        checkReadedAndFavorited()
    }, [])

    //readed ve favorited user id var mı onu kontrol et
    console.log("readed ne", readed, "favoritedne", favorited)
    // button isimleri eğer readed varsa readed yoksa add to read ya da favorited için de
    const checkReaded = () => {
        firestore().collection("Books").doc(book.uid).collection("Readed").get().then(snp => {
            if (!snp.empty) {
                snp.forEach(doc => {
                    if (doc.id === user.uid) {
                        setReaded(true)
                    } else {
                        setReaded(false)
                    }
                })
            }
        })
    }

    const checkFavorited = () => {
        firestore().collection("Books").doc(book.uid).collection("Favorited").get().then(snp => {
            if (!snp.empty) {
                snp.forEach(doc => {
                    if (doc.id === user.uid) {
                        setFavorited(true)
                    } else {
                        setFavorited(false)
                    }
                })
            }
        })
    }

    const checkReadedAndFavorited = async () => {
        await checkReaded()
        await checkFavorited()
    }

    const addToReaded = () => {
        if (readed) {
            Alert.alert("Warning", "Already you got it readed")
        } else {
            //ekleme işlemi olacak
            firestore().collection("Books").doc(book.uid).collection("Readed").doc(user.uid).set({
                uid: user.uid
            })
            Alert.alert("Success", "Successfully added to Readed")

        }
    }

    const addToFavorited = () => {
        if (favorited) {
            Alert.alert("Warning", "Already you got it favorited")
        } else {
            firestore().collection("Books").doc(book.uid).collection("Favorited").doc(user.uid).set({
                uid: user.uid
            })
            Alert.alert("Success", "Successfully added to Favorited")

        }
    }



    return (
        <View style={{ flex: 1, alignItems: 'center', padding: 10 }}>

            <Image source={{ uri: book.photoURL }} width={200} height={200} resizeMode='contain' />
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'black' }}>name: {book.name}</Text>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'black' }}>writer: {book.writer}</Text>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'black' }}>firstPublished: {book.firstPublished}</Text>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'black' }}>description: {book.description}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '80%', marginVertical: 10 }}>
                <Button title={readed ? "Readed" : "Add to Readed"} onPress={addToReaded} />
                <Button title={favorited ? 'FAVORITED' : "Add to Favorited"} onPress={addToFavorited} />
            </View>

        </View >
    )
}

export default BookDetay
