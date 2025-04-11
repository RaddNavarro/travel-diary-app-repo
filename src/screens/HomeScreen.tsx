import React, { useEffect, useState } from "react";
import { Button, Text, View, Image, FlatList, SafeAreaView, ToastAndroid, TouchableOpacity } from "react-native";
import { Props } from '../navigation/props'
import styles from '../styles/styles'
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from 'react-native-vector-icons/Ionicons'
import { ThemeContext } from "../styles/ThemeManager";
import { COLOURS } from "../colors/colors";

const HomeScreen: React.FC<Props> = ({ navigation }) => {

    const [dark, setDark] = useState()
    // const [isDark, setIsDark] = useState(false);
    const [imgUri, setImgUri] = useState([]);
    const [entry, setEntry] = useState([]);

    const { theme } = React.useContext(ThemeContext)


    useEffect(() => {
        fetchData();
    }, [])

  

    const fetchData = async () => {
        // await AsyncStorage.removeItem('entries');
        const entryData = await AsyncStorage.getItem('entries');
        if (entryData) {

            try {
                const parsedEntryData = JSON.parse(entryData)
                setEntry(parsedEntryData)
            } catch (error) {
                console.error(error)
            }

        }
        
    }

    const removeItem = async (id) => {
        try {
            let data = entry.filter((item) => item.id !== id)
            setEntry(data)
            await AsyncStorage.setItem('entries', JSON.stringify(data))
            ToastAndroid.show(
                "Removed Entry", ToastAndroid.SHORT
            );
        } catch (error) {
            console.error(error)
        }
    }

    const renderImg = ({ item }) => {
        return (
            <View>
                <View style={styles.item_inner_container}>
                    <Text style={styles.item_addressTxt(theme)}>
                        {item.locationAddress}
                    </Text>
                    <Image source={{ uri: item.imgSrc }} style={styles.image} />
                </View>

                <View style={{ alignItems: 'center' }}>
                    <TouchableOpacity style={styles.item_deleteBtn(theme)} onPress={() => removeItem(item.id)}>
                        <Text style={styles.item_deleteTxt}>
                            Delete
                        </Text>
                    </TouchableOpacity>
                    {/* <Button title="Delete" onPress={() => removeItem(item.id)} /> */}
                </View>
            </View>
        )
    }


    return (

        <View style={styles.main_container(theme)}>
            {/* <View style={styles.home_header_container}>
                    <Text>HomeScreen</Text>
                    <Button title="Go To Travel Entry" onPress={() => navigation.navigate('TravelEntryScreen')}></Button>
                </View> */}

            <TouchableOpacity style={styles.home_floatingBtn(theme)} onPress={() => navigation.navigate('TravelEntryScreen')}>
                <Ionicons name="camera" size={35} color={theme === 'light' ? COLOURS.light : COLOURS.mediumDark} />
            </TouchableOpacity>

            {entry.length > 0 ? (
                <FlatList
                    data={entry}
                    renderItem={renderImg}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                />
            ) : (
                <Text>No Entries yet</Text>
            )}
        </View>

    )
}


export default HomeScreen;