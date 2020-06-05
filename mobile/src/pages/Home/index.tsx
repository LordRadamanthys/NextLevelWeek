import React, { useState, useEffect, Component, ChangeEvent } from 'react'
import { Feather as Icon } from '@expo/vector-icons'
import { Dropdown } from 'react-native-material-dropdown';
import RNPickerSelect from 'react-native-picker-select';
import { StyleSheet, Text, View, Image, ImageBackground, TextInput } from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import { useNavigation, useRoute } from '@react-navigation/native'
import api from '../../services/api'
import axios from 'axios'


interface IBGERUfesponse {
    sigla: string
}
interface IBGECityResponse {
    nome: string
}

const Home = () => {
    const navigation = useNavigation()
    const [initialUF, setInitialUF] = useState<[]>([])
    const [selectedUF, setSelectedUF] = useState('')
    const [loadSelect, setLoadSelect] = useState(false)
    const [selectedCity, setSelectedCity] = useState('')
    const [initialCity, setInitialCity] = useState<[]>([])

    function handleNavigateToPoint() {
        navigation.navigate('Points', { uf: selectedUF, city: selectedCity })
    }

    function handleSelectedUF(text: string) {
        setLoadSelect(true)
        setSelectedUF(text)
        console.log(text)
    }

    function handleSelectedCity(text: string) {
        console.log(text)
        setSelectedCity(text)

    }
    useEffect(() => {

        axios.get<IBGERUfesponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
            var ufInitials = response.data.map(uf => (
                { label: uf.sigla, value: uf.sigla }
            )) as []
            //console.log(ufInitials)
            setInitialUF(ufInitials)
        })
    }, [])

    useEffect(() => {
        axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios`).then(response => {
            var citys = response.data.map(city => (
                { label: city.nome, value: city.nome, }
            )) as []
            console.log(citys)
            setInitialCity(citys)
            setLoadSelect(false)
        })
    }, [selectedUF])


    return (
        <ImageBackground source={require('../../assests/home-background.png')} imageStyle={{ width: 274, height: 368 }} style={styles.container}>
            <View style={styles.main}>
                <Image source={require('../../assests/logo.png')} />
                <Text style={styles.title} >Seu Marketplace de coleta de residuos</Text>
                <Text style={styles.description} >Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
            </View>

            <View style={styles.footer}>
                <View style={styles.select}>
                    <RNPickerSelect
                        items={initialUF}
                        value={selectedUF}
                        placeholder={{label:"Selecione sua UF"}}
                        onValueChange={(props) => handleSelectedUF(props)}
                    />
                </View>
                <View style={styles.select}>
                    <RNPickerSelect
                     placeholder={{label:"Selecione sua Cidade"}}
                        items={initialCity}
                        value={selectedCity}
                        onValueChange={(props) => handleSelectedCity(props)}
                    />
                </View>
                <RectButton style={styles.button} onPress={handleNavigateToPoint}>
                    <View style={styles.buttonIcon}><Text><Icon name="arrow-right" color="#fff" size={24} /></Text></View>
                    <Text style={styles.buttonText}>Entrar </Text>
                </RectButton>
            </View>
        </ImageBackground>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 32,

    },

    main: {
        flex: 1,
        justifyContent: 'center',
    },

    title: {
        color: '#322153',
        fontSize: 32,
        fontFamily: 'Ubuntu_700Bold',
        maxWidth: 260,
        marginTop: 64,
    },

    description: {
        color: '#6C6C80',
        fontSize: 16,
        marginTop: 16,
        fontFamily: 'Roboto_400Regular',
        maxWidth: 260,
        lineHeight: 24,
    },

    footer: {
        marginBottom: 30
    },

    select: {
        height: 60,
        backgroundColor: '#FFF',
        borderRadius: 10,
        marginBottom: 20,
        paddingHorizontal: 24,
        fontSize: 16,

    },

    input: {
        height: 60,
        backgroundColor: '#FFF',
        borderRadius: 10,
        marginBottom: 8,
        paddingHorizontal: 24,
        fontSize: 16,
    },

    button: {
        backgroundColor: '#34CB79',
        height: 60,
        flexDirection: 'row',
        borderRadius: 10,
        overflow: 'hidden',
        alignItems: 'center',
        marginTop: 8,
    },

    buttonIcon: {
        height: 60,
        width: 60,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        justifyContent: 'center',
        alignItems: 'center'
    },

    buttonText: {
        flex: 1,
        justifyContent: 'center',
        textAlign: 'center',
        color: '#FFF',
        fontFamily: 'Roboto_500Medium',
        fontSize: 16,
    }
});
export default Home