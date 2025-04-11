import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, StatusBar, Platform } from "react-native";
import { ThemeContext } from "./ThemeManager";
import { COLOURS } from "../colors/colors";
import React from "react";

const themes = () => {
  const { theme } = React.useContext(ThemeContext)
}


const styles = StyleSheet.create({
  
    safe_container: {
      flex: 1,
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
    },
    main_container: (theme) => ({
      flex: 1,
      backgroundColor: theme === 'light' ? COLOURS.light : COLOURS.dark,
      alignItems: 'center',
      justifyContent: 'center',
    }),
    image: {
        width: 200,
        height: 400,
        marginTop: 20,
        borderRadius: 10
      },

    // HEADER
    headerTxt: (theme) => ({
      fontWeight: 'bold',
      fontSize: 22,
      color: theme === 'light' ? COLOURS.dark : COLOURS.light
    }),
    header_container: {
      marginLeft: 15,
      
    },


    // HOME 
    home_header_container: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: '50%',
      borderWidth: 1,
      padding: 40
    },
    home_floatingBtn: (theme) => ({
      position: 'absolute',
      width: 60,
      height: 60,
      alignItems: 'center',
      justifyContent: 'center',
      right: 40,
      bottom: 40,
      zIndex: 1,
      backgroundColor: theme === 'light' ? COLOURS.mainTheme : COLOURS.textLight,
      borderRadius: 100,
    }),


    // ITEM
    item_inner_container: {
      marginTop: 20,
      marginBottom: 20,
      alignItems: 'center',

    },
    item_addressTxt: (theme) => ({
      fontWeight: 'bold',
      fontSize: 17,
      color: theme === 'light' ? COLOURS.dark : COLOURS.light
    }),
    item_deleteBtn: (theme) => ({
      backgroundColor: theme === 'light' ? COLOURS.mediumMainTheme : COLOURS.light,
      padding: 20,
      alignItems: 'center',
      justifyContent: 'center',
      width: '70%',
      borderRadius: 20,
      marginBottom: 20 
    }),
    item_deleteTxt: {
      fontWeight: 700, 
      letterSpacing: 1.5,
      color: COLOURS.textDark
      
    },

    // TRAVEL ENTRY SCREEN
    camera_container: {
      borderColor: COLOURS.cameraColor,
      borderStyle: 'dashed',
      borderWidth: 7,
      borderRadius: 20,
      padding: 10
    },
    saveBtn: (theme) => ({
      backgroundColor: theme === 'light' ? COLOURS.mediumMainTheme : COLOURS.light,
      padding: 20,
      alignItems: 'center',
      justifyContent: 'center',
      width: '70%',
      borderRadius: 20,
      marginTop: 20 
    }),
    saveBtnTxt: (theme) => ({
      fontWeight: 700, 
      letterSpacing: 1.5,
      color: COLOURS.textDark
    })
  });


  export default styles;