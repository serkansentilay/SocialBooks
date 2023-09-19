import { Text, View, Image } from 'react-native'
import React from 'react'


const ProfilHeader = ({ url, text }) => {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginVertical: 10 }}>
            <Image source={url ? { uri: url } : require("../../assets/anonymous.png")} width={100} height={100} />
            <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 20 }}>{text}</Text>
        </View>
    )
}

export default ProfilHeader
