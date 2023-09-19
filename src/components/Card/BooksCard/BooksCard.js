import { Text, View, Image, TouchableWithoutFeedback } from 'react-native'
import React from 'react'

const BooksCard = ({ item, onPress }) => {
    console.log("item bookscard", item)
    const { name, photoURL, writer } = item
    return (

        <TouchableWithoutFeedback onPress={onPress}>
            <View style={{ width: '50%', marginVertical: 5, justifyContent: 'space-between', alignItems: 'center' }}>
                <Image source={{ uri: photoURL }} width={150} height={150} resizeMode='contain' />
                <View>
                    <Text style={{ fontSize: 16, color: 'black', fontWeight: 'bold' }}>Name: {name}</Text>
                    <Text style={{ fontSize: 14, color: 'black' }}>Writer: {writer}</Text>
                </View>

            </View>
        </TouchableWithoutFeedback>
    )
}

export default BooksCard
