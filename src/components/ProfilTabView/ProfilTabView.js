import { Text, View, useWindowDimensions, Alert, Button, FlatList } from 'react-native'
import React, { memo, useState, useEffect } from 'react'
import styles from "./ProfilTabView.style"
import { TabView, SceneMap } from 'react-native-tab-view';
import FirstRoute from '../FirstRoute';
import SecondRoute from '../SecondRoute';
import firestore from "@react-native-firebase/firestore"
import { useNavigation } from '@react-navigation/native';
import FavoritedCard from '../Card/FavoritedCard';

const ProfilTabView = ({ user, }) => {
    const [page, setPage] = useState(0)
    const navigation = useNavigation()
    const [readed, setReaded] = useState([])
    const [favorited, setFavorited] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        checkFirestoreReaded()
        checkFirestoreFavorited()
        setLoading(false)
    }, [])

    const checkFirestoreReaded = async () => {
        await firestore().collection("Books").get().then(snp => {
            if (!snp.empty) {
                snp.forEach(doc => {
                    const id = doc.id
                    firestore().collection("Books").doc(id).collection("Readed").get().then(snp => {
                        if (!snp.empty) {
                            snp.forEach(doc => {
                                if (doc.id === user.uid) {
                                    firestore().collection("Books").doc(id).get().then(snp => {
                                        readed.filter(filt => filt.uid != snp.data().uid)
                                        setReaded(prev => [...prev, snp.data()])
                                    })
                                }
                            })
                        }
                    })
                })
            }
        })
    }

    const checkFirestoreFavorited = async () => {
        await firestore().collection("Books").get().then(snp => {
            if (!snp.empty) {
                snp.forEach(doc => {
                    const id = doc.id
                    firestore().collection("Books").doc(id).collection("Favorited").get().then(snp => {
                        if (!snp.empty) {
                            snp.forEach(doc => {
                                if (doc.id === user.uid) {
                                    firestore().collection("Books").doc(id).get().then(snp => {
                                        favorited.filter(filt => filt.uid != snp.data().uid)
                                        setFavorited(prev => [...prev, snp.data()])
                                    })
                                }
                            })
                        }
                    })
                })
            }
        })

    }

    const handleFavoritedRemove = async (id) => {
        await firestore().collection("Books").doc(id).collection("Favorited").doc(user.uid).delete()
        setFavorited([])
        checkFirestoreFavorited()
        Alert.alert("Delete", "Deleted Favorited the book")
    }

    const handleReadedRemove = async (id) => {
        await firestore().collection("Books").doc(id).collection("Readed").doc(user.uid).delete()
        setReaded([])
        checkFirestoreReaded()
        Alert.alert("Delete", "Deleted Readed the book")
    }

    console.log("readed", readed)
    console.log("favorited", favorited)

    const handleGoToDetay = (item) => {
        console.log("bana bstın ongotodetay")

    }

    const renderFavorited = ({ item }) => <FavoritedCard item={item}
        onGoToDetay={() => handleGoToDetay(item)}
        onRemove={() => handleFavoritedRemove(item.uid)} />

    const renderReaded = ({ item }) => <FavoritedCard
        item={item}
        onGoToDetay={() => onGoToDetay(item)}
        onRemove={() => handleReadedRemove(item.uid)} />

    const goToReadedPage = () => {
        setPage(0)
    }
    const goToFavoritedPage = () => {
        setPage(1)
    }


    return (
        <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                <Button title="Readed" onPress={goToReadedPage} />
                <Button title="Favorited" onPress={goToFavoritedPage} />
            </View>
            <View style={{ borderWidth: 1, borderColor: 'blue', marginVertical: 2 }}></View>

            {readed.length > 0 && page === 0 && (<FlatList
                data={readed}
                keyExtractor={(item) => item.uid}
                renderItem={renderReaded}

            />)}

            {favorited.length > 0 && page === 1 && (<FlatList
                data={favorited}
                keyExtractor={item => item.uid}
                renderItem={renderFavorited}
            />)}

            {favorited.length < 1 && page === 1 && <Text style={{ color: 'orange', fontSize: 25, textAlign: 'center', marginTop: 30 }}>NO ITEM FAVORITED</Text>}
            {readed.length < 1 && page === 0 && <Text style={{ color: 'orange', fontSize: 25, textAlign: 'center', marginTop: 30 }}>NO ITEM READED</Text>}

        </View>
    );

}

export default ProfilTabView
