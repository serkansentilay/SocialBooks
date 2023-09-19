import { Text, View, FlatList, TextInput } from 'react-native'
import React, { useEffect, useState, } from 'react'
import styles from "./Home.style"
import RoundedButton from '../../components/Card/RoundedButton'
import database from '@react-native-firebase/database';
import BooksCard from '../../components/Card/BooksCard';
import { useSelector } from 'react-redux';
import firestore from "@react-native-firebase/firestore"
import AddBook from '../../modal/AddBook';

const Home = ({ navigation }) => {
    const [books, setBooks] = useState([])
    const [loading, setLoading] = useState(true)
    const [readed, setReaded] = useState([])
    const [favorited, setFavorited] = useState([])
    const { user } = useSelector(state => state.auth)
    const [isModalVisible, setModalVisible] = useState(false);
    const [search, setSearch] = useState("")
    const [searchList, setSearchList] = useState([])
    useEffect(() => {
        getBooks()

    }, [])


    const getBooks = async () => {
        //firestoredan tüm booksları getir
        await firestore().collection("Books").get().then(snp => {
            if (!snp.empty) {
                snp.forEach(doc => { //verileri bir kez eklmeyi düzelt sonra arama ekle bitir
                    books.filter(snp => snp.uid !== doc.data().id)
                    setBooks(prev => [...prev, doc.data()])
                    //books.filter(filt => filt.uid !== doc.data().uid)

                }
                )
                setLoading(false)
            }
        })
    }

    useEffect(() => {
        searchGet()
    }, [search])

    const searchGet = () => {
        console.log("searchhhh", search)
        if (search) {
            books.forEach(snp => {
                if (snp.name.toLowerCase().includes(search.toLowerCase().trim())) {
                    const val = searchList.find(doc => doc.uid === snp.uid)
                    console.log("val", val)
                    if (!val) {
                        console.log("val tanımsız")
                        console.log("snp", snp)
                        setSearchList(prev => [...prev, snp])
                    } else {
                        const data = searchList.filter(filt => filt.name === snp.name)
                        setSearchList(data)
                    }
                }
            })
        } else {
            setSearchList([])
        }
    }


    const handleDetay = (book) => {
        //detay sayfasında kitabı gösterceğiz        
        navigation.navigate("HomeBookDetay", {
            book
        })
    }

    if (loading) {
        return <Text>Loading...</Text>
    }
    const toggleVisibleModal = () => {
        setModalVisible(!isModalVisible);
    };
    const toggleCloseModal = () => {
        setModalVisible(!isModalVisible);
        getBooks()
    };

    const renderBooks = ({ item }) => <BooksCard item={item} onPress={() => handleDetay(item)} />

    return (
        <View style={{ flex: 1 }}>
            {books != [] ?
                <View>
                    <TextInput
                        placeholder='Search'
                        placeholderTextColor='gray'
                        style={{ borderWidth: 1, borderColor: 'gray', padding: 10, color: 'black' }}
                        value={search}
                        onChangeText={setSearch}
                        autoCapitalize='none'
                        disableFullscreenUI
                    />
                    {search ? <FlatList
                        contentContainerStyle={{ justifyContent: 'space-between', alignItems: 'center', }}
                        numColumns={2}
                        data={searchList}
                        keyExtractor={(item) => item.name}
                        renderItem={renderBooks}
                    /> : <FlatList
                        contentContainerStyle={{ justifyContent: 'space-between', alignItems: 'center', }}
                        numColumns={2}
                        data={books}
                        keyExtractor={(item) => item.name}
                        renderItem={renderBooks}
                    />}
                </View>
                : <Text>Not yet books</Text>}
            <RoundedButton onPress={toggleVisibleModal} />
            <AddBook user={user} isVisible={isModalVisible} onClose={toggleCloseModal} />
        </View>
    )
}

export default Home
