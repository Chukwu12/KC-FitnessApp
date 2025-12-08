import "../global.css";
import { ClerkProvider } from '@clerk/clerk-expo'
import { Slot } from 'expo-router'

export default function Layout() {
   return (
    <ClerkProvider>
      <Slot />
    </ClerkProvider>
  )
}
