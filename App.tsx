import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import styles from './src/styles/styles';
import { ThemeProvider } from './src/styles/ThemeManager';

export default function App() {
  return (
    // <SafeAreaView style={styles.safe_container}>
    <ThemeProvider>
      <AppNavigator />
    </ThemeProvider>
      
      // </SafeAreaView>
  );
}


