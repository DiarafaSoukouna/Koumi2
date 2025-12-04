import Ionicons from '@expo/vector-icons/Ionicons'
import { StyleSheet, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function LoginPage() {
  return (
    <SafeAreaView style={styles.container}>
      <Ionicons name="arrow-back-outline" size={24} color="black" />

      <Text
        style={{
          marginTop: 20,
          fontWeight: 'bold',
          fontSize: 20,
        }}
      >
        First Page
      </Text>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
