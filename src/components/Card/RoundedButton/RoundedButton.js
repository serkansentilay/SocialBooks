import { Text, View, TouchableOpacity } from 'react-native'
import React from 'react'

const RoundedButton = ({ onPress }) => {
    return (
        <View style={{ marginRight: 20, marginBottom: 20, position: 'absolute', bottom: 0, right: 10, }}>
            <TouchableOpacity style={{ borderRadius: 50, width: 50, height: 50, backgroundColor: 'lightblue', justifyContent: 'center', alignItems: 'center', }} onPress={onPress}>
                <Text style={{ fontSize: 20, color: 'black', fontWeight: 'bold', }}>+</Text>
            </TouchableOpacity>
        </View>
    )
}

export default RoundedButton
