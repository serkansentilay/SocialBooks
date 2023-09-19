import { Text, View, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { format, formatDistance, formatRelative, subDays } from 'date-fns'
import firestore from "@react-native-firebase/firestore"

const ForYouCard = ({ item, profile, likes }) => {
    const { user } = useSelector(state => state.auth)
    const date = format(item.date.toDate(), "do MMMM Y")
    console.log("foryoucard", item)
    console.log("likes", likes)
    const [like, setLike] = useState(false)
    const [allLikes, setAllLikes] = useState([])

    useEffect(() => {
        filterLikes()
        checkAllLikesLength()
    }, [likes])

    const checkAllLikesLength = async () => {
        await firestore().collection("Posts").get().then(snp => {
            if (!snp.empty) {
                snp.forEach(doc => {
                    const id = doc.id
                    firestore().collection("Posts").doc(item.uid).collection("Likes").count().get().then(snp => {
                        console.log("snp", snp.data().count)
                        setAllLikes(snp.data().count)
                    })


                })
            }
        })
    }

    const filterLikes = () => {
        likes.forEach(snp => {
            console.log("filterlikes", snp)
            if (snp.uid === item.uid) {
                setLike(true)
            } else {
                setLike(false)
            }
        })
    }


    const handleUpdateLike = async () => {
        if (like) {
            await firestore().collection("Posts").doc(item.uid).collection("Likes").doc(user.uid).delete()
            setLike(false)
        } else {
            await firestore().collection("Posts").doc(item.uid).collection("Likes").doc(user.uid).set({
                uid: user.uid
            })
            setLike(true)
        }
    }


    return (
        <View style={{ padding: 5, margin: 5 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={profile}>
                    <Image source={{ uri: item.userPhotoUrl ? item.userPhotoUrl : require("../../../assets/anonymous.png") }}
                        resizeMode='contain'
                        borderRadius={50}
                        width={50}
                        height={50} />
                </TouchableOpacity>
                <View>

                    <Text style={{ marginLeft: 20, fontSize: 20, fontWeight: 'bold', color: 'black' }}>{item.userName}</Text>
                    <Text style={{ marginLeft: 20, fontSize: 16, color: 'black' }}>{date}</Text>
                </View>
            </View>
            <Text style={{ marginLeft: 20, marginVertical: 10, fontSize: 18, color: 'black' }}>{item.about}</Text>
            <Image source={{ uri: item.photoURL }}
                resizeMode='contain'
                width={350}
                height={200} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: 'black', textAlign: 'left', fontSize: 30, }}>Like:  {allLikes}</Text>
                <TouchableOpacity onPress={handleUpdateLike} style={{ alignSelf: 'center', marginVertical: 5, }}>
                    <Text style={[{ textAlign: 'right', color: 'white', fontSize: 40, borderRadius: 10, backgroundColor: like ? "orangered" : "tomato" }]}>Like </Text>
                </TouchableOpacity>
            </View>
        </View >
    )
}

export default ForYouCard
