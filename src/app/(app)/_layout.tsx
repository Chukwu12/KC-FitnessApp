import { Stack } from 'expo-router'
import React from 'react'

function Layout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{headerShown: false}} />
      </Stack>
    );
  }
    
     


export default Layout;