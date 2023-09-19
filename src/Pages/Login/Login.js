import { Text, View, Button } from 'react-native'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { signInGoogle } from '../../context/userContext/userContextSlice'
import styles from "./Login.style"

const Login = () => {
    const dispatch = useDispatch()
    const loading = useSelector(state => state.auth.loading)

    const submit = () => {
        dispatch(signInGoogle())
    }

    if (loading) {
        return <Text>Loading...</Text>
    }

    return (
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            <Text>Login</Text>
            <Button title='login with google' onPress={submit} />
        </View>
    )

}

export default Login