import {View, Text, TouchableOpacity} from 'react-native';
import React, {useEffect} from 'react';
import RootNavigation from './src/navigation';
import Toast, {BaseToast, ErrorToast} from 'react-native-toast-message';

export default function App() {
  const toastConfig = {
    success: props => (
      <BaseToast
        {...props}
        style={{borderLeftColor: 'green', borderLeftWidth: 15}}
        contentContainerStyle={{paddingHorizontal: 15}}
        text1Style={{
          fontSize: 17,
        }}
        text2Style={{
          fontSize: 15,
        }}
        visibilityTime={1000}
        text2NumberOfLines={3}
      />
    ),
    /*
      Overwrite 'error' type,
      by modifying the existing `ErrorToast` component
    */
    error: props => (
      <ErrorToast
        {...props}
        text1Style={{
          fontSize: 17,
        }}
        text2Style={{
          fontSize: 15,
        }}
        style={{
          borderLeftColor: 'red',
          borderLeftWidth: 15,
          paddingVertical: 20,
          height: 80,
        }}
        text2NumberOfLines={2}
      />
    ),
  };

  return (
    <>
      <RootNavigation />
      <Toast config={toastConfig} />
    </>
  );
}
