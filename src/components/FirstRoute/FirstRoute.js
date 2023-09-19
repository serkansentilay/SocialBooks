import { Text, View, FlatList } from 'react-native'
import React from 'react'
import FavoritedCard from '../Card/FavoritedCard'

const FirstRoute = ({ }) => {

    const renderReaded = ({ item }) => <FavoritedCard item={item} />

    return (
        <View>
            <Text>Okunan kitap yok</Text>
            {/* <FlatList
                data={read}
                keyExtractor={item => item.id}
                renderItem={renderReaded}
            /> */}


        </View>
    )
}

export default FirstRoute
