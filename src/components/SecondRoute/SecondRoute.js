import { Text, View, FlatList, Alert } from 'react-native'
import React, { memo, useMemo } from 'react'
import firestore from "@react-native-firebase/firestore"
import FavoritedCard from '../Card/FavoritedCard'
import { useNavigation } from '@react-navigation/native'

const SecondRoute = ({ }) => {

    const navigation = useNavigation()
    // const handleRemove = (id) => {
    //     console.log("handeremove second route", id)
    // }

    const handleDetail = (id) => {
        navigation.navigate("")
    }

    const renderFavorited = ({ item }) => <FavoritedCard item={item} />

    return (
        <View>

            <Text>No favorited</Text>
            {/* <FlatList
                data={fav}
                keyExtractor={(item) => item.id}
                renderItem={renderFavorited}
            /> */}


        </View>
    )
}

export default memo(SecondRoute)
