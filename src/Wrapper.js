import React from 'react'
import Router from './Router'
import { Provider } from 'react-redux'
import { store } from './context/store'

const Wrapper = () => {
    return (
        <Provider store={store}>
            <Router />
        </Provider>
    )
}

export default Wrapper

