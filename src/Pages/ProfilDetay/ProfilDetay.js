import { Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import styles from "./ProfilDetay.style"
import ProfilHeader from '../../components/ProfilHeader'
import ProfilTabView from '../../components/ProfilTabView'
import firestore from "@react-native-firebase/firestore"
import ProfilUserTab from '../../components/ProfilUserTab'

const ProfilDetay = ({ route }) => {
    const { profile } = route.params
    console.log("ProfilDetay item", profile)

    return (
        <View style={{ flex: 1 }}>
            <ProfilHeader text={profile.userName} url={profile.userPhotoUrl} />
            <ProfilUserTab user={profile} />
        </View>
    )
}

export default ProfilDetay

