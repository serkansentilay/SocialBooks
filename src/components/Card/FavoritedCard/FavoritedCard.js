import { Text, View, Image, TouchableOpacity, Alert, TouchableWithoutFeedback } from 'react-native'
import React, { memo, useState } from 'react'
import firestore from "@react-native-firebase/firestore"

const FavoritedCard = ({ item, onRemove, onGoToDetay }) => {
    console.log("FavoritedCard", item)
    console.log("onGoToDetay", onGoToDetay)
    const { description, name, photoURL, firstPublished, writer } = item
    const [mySelf, setMySelf] = useState(false)

    return (
        <View style={{ padding: 5, margin: 1 }}>
            <TouchableWithoutFeedback onPress={onGoToDetay}>
                <View>
                    <View style={{ flexDirection: 'row', }}>
                        <Image width={50} height={50} resizeMode='contain' source={{ uri: photoURL }} />
                        <View style={{}}>
                            <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'black' }}>Name: {name}</Text>
                            <Text style={{ fontSize: 18, color: 'gray' }}>First Published: {firstPublished}</Text>
                            <Text style={{ fontSize: 16, color: 'gray' }}>Writer: {writer}</Text>
                        </View>
                    </View>
                    <Text style={{ fontWeight: 'bold', fontSize: 15, color: 'black' }}
                    >About: {description.length > 30 ? description.slice(0, 30) + "..." : description}</Text>
                </View>
            </TouchableWithoutFeedback>
            <TouchableOpacity onPress={onRemove} style={{ alignSelf: 'flex-end', marginRight: 20 }}>
                <Text style={{ textAlign: 'right', color: 'red', fontSize: 20 }}>Sil</Text>
            </TouchableOpacity>
        </View>
    )
}

export default memo(FavoritedCard)