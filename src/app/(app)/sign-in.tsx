import { useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from "@expo/vector-icons"

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const [isLoading, setIsLoading] = React.useState("");
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded) return

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/')
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err) {
      // See https://clerk.com/docs/guides/development/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  return (
    <SafeAreaView className='flex-1'>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className='flex-1'>

        {/* Heaer section*/}
        <View className="flex-1 justify-center">
          {/* logo/Branding}*/}
          <View className='items-center mb-8'>
            <View className='w-20  h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl 
          items-center justify-center mb-4 shadow-lg'>
              <Ionicons name="fitness" size={40} color="white" />
            </View>
            <Text className='text-3xl font-bold text-gray-900 mb-2'>
              FitTracker
            </Text>
            <Text className='text-lg text-gray-600 text-center'>
              Track your fitness journey {"\n"} and reach your goals
            </Text>
          </View>
        </View>

          {/* Sign in Form */}
        <View className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6'>
          <Text className='text-2xl font-bold text-gray-900 mb-6 text-center'>
            Welcome Back
          </Text>
       
        {/* Email Input */}
        <View className='mb-4'>
          <Text className='text-sm font-medium text-gray-700 mb-2'>
            Email
          </Text>
          <View className='flex-row items-center bg-gray-50 rounded-xl px-4 py-4 border border-gray-200'>
            <Ionicons name='mail-outline' size={20} color="#687280" />
            <TextInput 
            autoCapitalize='none'
            value={emailAddress}
            placeholder='Enter your email'
            placeholderTextColor="#9CA3AF"
            onChangeText={setEmailAddress}
            className='flex-1 ml-3 text-gray-900'
            editable={!isLoading} 
            />
          </View>
        </View>


      {/* Password input */}
        <View className='mb-6'>
          <Text className='text-sm font-medium text-gray-700 mb-2'>
            Password
          </Text>
          <View className='flex-row items-center bg-gray-50 rounded-xl px-4 py-4 border border-gray-200'>
            <Ionicons name='lock-closed-outline' size={20} color="#687280" />
            <TextInput 
            value={password}
            placeholder='Enter your password'
            placeholderTextColor="#9CA3AF"
            secureTextEntry={true}
            onChangeText={setPassword}
            className='flex-1 ml-3 text-gray-900'
            editable={!isLoading} 
            />
          </View>
        </View>
        </View>

        {/* <Text>Sign in</Text>
        <TextInput
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Enter email"
          onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
        /> */}
    
        {/* Sign in button */}
        <TouchableOpacity onPress={onSignInPress}>
          <Text>Continue</Text>
        </TouchableOpacity>
        <View style={{ display: 'flex', flexDirection: 'row', gap: 3 }}>
          <Text>Don't have an account?</Text>
          <Link href="/sign-up">
            <Text>Sign up</Text>
          </Link>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}