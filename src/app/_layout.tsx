import "../global.css";
import { ClerkProvider } from '@clerk/clerk-expo'
import { Slot } from 'expo-router'
import { tokenCache } from '@clerk/clerk-expo/token-cache'

export default function Layout() {
   return (
   <ClerkProvider
      publishableKey="pk_test_Zmxvd2luZy1yYWJiaXQtNzEuY2xlcmsuYWNjb3VudHMuZGV2JA"
      tokenCache={tokenCache}
    >
      <Slot />
    </ClerkProvider>
  )
}
