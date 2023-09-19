import { Text, View, FlatList, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import styles from "./ForYou.style"
import firestore from "@react-native-firebase/firestore"
import ForYouCard from '../../components/Card/ForYouCard'
import RoundedButton from '../../components/Card/RoundedButton'
import AddForYou from '../../modal/AddForYou'
import { useSelector } from 'react-redux'

const ForYou = ({ navigation }) => {
    const [posts, setPosts] = useState([])
    const { user } = useSelector(state => state.auth)
    const [isModalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(true)
    const [likes, setLikes] = useState([])
    const [filterlike, setFilterLike] = useState([])

    const getLikes = async () => {
        await firestore().collection("Posts").get().then(snp => {
            if (!snp.empty) {
                snp.forEach(doc => {
                    const id = doc.id
                    firestore().collection("Posts").doc(id).collection("Likes").get().then(snp => {
                        if (!snp.empty) {
                            snp.forEach(doc => {
                                if (doc.id === user.uid) {
                                    firestore().collection("Posts").doc(id).get().then(snp => {
                                        likes.filter(filt => filt.uid != snp.data().uid)
                                        setLikes(prev => [...prev, snp.data()])
                                    })
                                }
                            })
                        }
                    })
                })
            }
        })
    }

    const getPosts = async () => {
        await firestore().collection("Posts").get().then(snp => {
            if (!snp.empty) {
                snp.forEach(doc => {
                    posts.filter(filt => filt.uid != doc.data().uid)
                    setPosts(prev => [...prev, doc.data()])
                })
            }
        })

    }

    useEffect(() => {
        getPosts()
        getLikes()
    }, [])

    const toggleVisibleModal = () => {
        setModalVisible(!isModalVisible);
    };
    const toggleCloseModal = () => {
        setModalVisible(!isModalVisible);
    };

    const goToProfile = (item) => {
        if (user.uid === item.userUid) {
            navigation.navigate("ProfilTab")
        } else {
            navigation.navigate("ForYouProfilDetay", {
                profile: item
            })
        }
    }


    const renderForYouFirestore = ({ item }) => <ForYouCard likes={likes} item={item} profile={() => goToProfile(item)} />
    return (
        <>
            {posts != [] ? <FlatList
                data={posts}
                keyExtractor={item => item.date.toDate()}
                renderItem={renderForYouFirestore}
            /> : <Text style={{ color: 'orange', fontSize: 30 }}>Not yet posts</Text>}
            <RoundedButton onPress={toggleVisibleModal} />
            <AddForYou user={user} isVisible={isModalVisible} onClose={toggleCloseModal} />
        </>
    )
}

export default ForYou
