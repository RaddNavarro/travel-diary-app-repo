import React, { useEffect, useState } from "react";
import { Text, View, Button, ToastAndroid, Image, Platform, TouchableOpacity } from "react-native";
import { Props } from '../navigation/props'
import styles from "../styles/styles";
import * as ImagePicker from "expo-image-picker";
import * as Location from 'expo-location';
import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from 'react-native-uuid';
import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "../styles/ThemeManager";

// for the entry data
interface Entry {
    id: string,
    imgSrc?: string,
    locationAddress: string
}

// for the coords
interface LocationCoords {
    latitude: number,
    longitude: number
}

// for the notifications
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false
    })

})

const TravelEntryScreen: React.FC<Props> = ({ navigation }) => {
    const [entry, setEntry] = useState<Entry[]>([]);
    const [currentEntry, setCurrentEntry] = useState<Entry | null>();
    const [imgUri, setImgUri] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    
    const [dark, setDark] = useState()

     const { theme } = React.useContext(ThemeContext)

    useEffect(() => {
        fetchData();
        requestPermission();
    }, [])


    // useEffect activates once a change in the entry state happens to update the data
    useEffect(() => {
        if (entry) {
            updateData();
        }
    }, [entry])

    useEffect(() => {
        registerForPushNotificationAsync();
    }, [])



    const fetchData = async () => {
        const entryData = await AsyncStorage.getItem('entries');
        
        if (entryData) {

            try {
                const parsedEntryData = JSON.parse(entryData)

                setEntry(parsedEntryData)
            } catch (error) {
                console.error(error)
            }

        } else {
            try {
                setEntry([])
            } catch (error) {
                console.error(error)
            }
        }
    }

    const sendNotification = async () => {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: 'Travel Diary',
                body: 'A new entry has been added',
                sound: 'default',
            },
            trigger: null,
        });
    };

    async function registerForPushNotificationAsync() {
        let token;
        
        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C'
            })
        }

        if (!Device.isDevice) {
            alert('Must use a physical device for push notification');
            return;
        }

        const { granted: existingPermission } =
            await Notifications.getPermissionsAsync();

        let finalPermission = existingPermission;

        if (!existingPermission) {
            const { granted: newPermission } =
                await Notifications.requestPermissionsAsync();
            finalPermission = newPermission;
        }

        if (!finalPermission) {
            alert('Failed to get push token for push notifications!');
            return;
        }

        // if (!Constants.expoConfig?.extra?.eas?.projectId) {
        //     alert('Project ID not found in Expo config');
        //     return;
        // }

        token = (
            await Notifications.getExpoPushTokenAsync({
                projectId: Constants.expoConfig.extra.eas.projectId
            })
        ).data;

        console.log('Expo Push Token:', token);

        return token;
    }

    const requestPermission = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
            setErrorMsg('Permission to access location was denied')
        }
    }

    const getCurrentLocation = async () => {
        try {
            const locationData = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High
            });

            const coords = {
                latitude: locationData.coords.latitude,
                longitude: locationData.coords.longitude
            }


            return coords;
        } catch (error) {
            setErrorMsg('Error fetching location');
            console.error(error);
            return null;
        }
    }

    const getCurrentAddress = async (coords: LocationCoords) => {

        const address = await Location.reverseGeocodeAsync(coords)


        return formatAddress(
            address[0].name ?? '',
            address[0].city ?? '',
            address[0].region ?? '',
            address[0].postalCode ?? ''
        )
    }

    function formatAddress(
        name: string,
        city: string,
        region: string,
        postalCode: string
    ): string {
        return name + ', ' + city + ', ' + region + ', ' + postalCode;
    }



    const updateData = async () => {
        await AsyncStorage.setItem('entries', JSON.stringify(entry))
        // console.log(imgUri)
    }

    const takePicture = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();

        if (status !== "granted") {
            alert("Camera permission is required to take pictures");
            return;
        }

        try {
            let result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                quality: 1,
            });

            const coords = await getCurrentLocation();
            if (!coords) {
                return;
            }

            const address = await getCurrentAddress(coords);


            if (!result.canceled) {
                setCurrentEntry({ id: uuid.v4(), imgSrc: result.assets[0].uri, locationAddress: address })
            }
            
        } catch (error) {
            console.error(error)
        }
    };

    const SaveEntry = () => {

        if (currentEntry) {
            setEntry(prev => [...prev,
            { id: currentEntry.id, imgSrc: currentEntry?.imgSrc, locationAddress: currentEntry.locationAddress }
            ]);

            setCurrentEntry(null);

            ToastAndroid.show(
                "New Entry Added", ToastAndroid.SHORT
            )
            sendNotification()

            navigation.popTo('HomeScreen')
        } else {
            ToastAndroid.show(
                "Please take a picture", ToastAndroid.SHORT
            )
        }

    }

    return (
        <View style={styles.main_container(theme)}>

            {/* <Button title="Take picture" onPress={takePicture}></Button> */}
           
            {currentEntry?.imgSrc ? (
                <>
                    <Image source={{ uri: currentEntry.imgSrc }} style={styles.image} />

                    <TouchableOpacity style={styles.saveBtn(theme)} onPress={SaveEntry}>
                        <Text style={styles.saveBtnTxt(theme)}>
                            Save Image
                        </Text>
                    </TouchableOpacity>
                </>
            ) :
                <TouchableOpacity style={styles.camera_container} onPress={takePicture}>
                    <Ionicons name="camera" size={200} color="#B2B2B2"/>
                </TouchableOpacity>
                

            }


        </View>
    )
}


export default TravelEntryScreen;