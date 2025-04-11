import { Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "../screens/HomeScreen";
import TravelEntryScreen from "../screens/TravelEntryScreen";
import styles from "../styles/styles";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "../styles/ThemeManager";
import { COLOURS } from "../colors/colors";
import { Colors } from "react-native/Libraries/NewAppScreen";

const Stack = createStackNavigator();

const AppNavigator = () => {

    // const [isDark, setIsDark] = useState(false);

    // const toggleTheme = () => {
    //     if (isDark === false) {
    //         setIsDark(true);
    //     } else {
    //         setIsDark(false)
    //     }
    // }
    const { toggleTheme } = React.useContext(ThemeContext)
    const { theme } = React.useContext(ThemeContext)

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{
                headerRight: () => (
                    <View>
                        <TouchableOpacity style={{ marginLeft: 15, marginRight: 20 }} onPress={() => toggleTheme()}>
                            <Ionicons name="moon" size={28} color={theme === 'light' ? COLOURS.mediumDark : COLOURS.light} />
                        </TouchableOpacity>
                    </View>
                )
            }}>
                <Stack.Screen name="HomeScreen" component={HomeScreen} options={{
                    headerTitle: () => (
                        <View style={styles.header_container}>
                            <Text style={styles.headerTxt(theme)}>Home</Text>
                        </View>
                    ),
                    headerStyle: {
                        height: 150,
                        backgroundColor: theme === 'light' ? COLOURS.mainTheme : COLOURS.mediumDark,
                        shadowColor: theme === 'light' ? COLOURS.white : COLOURS.dark,
                        // elevation: 10,
                    },
                    headerLeft: () => null,
                   
                }}/>
                <Stack.Screen name="TravelEntryScreen" component={TravelEntryScreen} options={{
                    headerTitle: () => (
                        <View style={styles.header_container}>
                            <Text style={styles.headerTxt(theme)}>Add a Travel Entry</Text>
                        </View>
                    ),
                    headerStyle: {
                        height: 150,
                        backgroundColor: theme === 'light' ? COLOURS.mainTheme : COLOURS.mediumDark,
                        shadowColor: theme === 'light' ? COLOURS.white : COLOURS.dark,
                        elevation: 10,
                    },
                    headerTintColor: theme === 'light' ? COLOURS.dark : COLOURS.light
                    
                   
                }}/>
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default AppNavigator;