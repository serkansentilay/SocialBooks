import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../Pages/Home';
import BookDetay from '../Pages/BookDetay';
import ProfilDetay from '../Pages/ProfilDetay';
import ForYou from '../Pages/ForYou';
import Profil from '../Pages/Profil';
import FirstRoute from '../components/FirstRoute';
import SecondRoute from '../components/SecondRoute';

const HomeStack = createNativeStackNavigator();
const ForYouStack = createNativeStackNavigator();
const ProfilStack = createNativeStackNavigator();

export function StackHomeNavigator() {

    return (
        <HomeStack.Navigator>
            <HomeStack.Screen name="Home" component={Home} />
            <HomeStack.Screen name="HomeBookDetay" component={BookDetay} />
            <HomeStack.Screen name="HomeProfilDetay" component={ProfilDetay} />
        </HomeStack.Navigator>

    )
}


export function StackForYouNavigator() {

    return (
        <ForYouStack.Navigator>
            <ForYouStack.Screen name="ForYou" component={ForYou} />
            <ForYouStack.Screen name="ForYouProfilDetay" component={ProfilDetay} />
            <ForYouStack.Screen name="ForYouBookDetay" component={BookDetay} />
        </ForYouStack.Navigator>

    )
}

export function StackProfilNavigator() {

    return (
        <ProfilStack.Navigator>
            <ProfilStack.Screen name="Profil" component={Profil} />
            <ProfilStack.Screen name="ProfilBookDetay" component={BookDetay} />
            <ProfilStack.Screen name="ProfilProfilDetay" component={ProfilDetay} />
            <ProfilStack.Screen name="Readed" component={FirstRoute} />
            <ProfilStack.Screen name="Favorited" component={SecondRoute} />
        </ProfilStack.Navigator>

    )
}