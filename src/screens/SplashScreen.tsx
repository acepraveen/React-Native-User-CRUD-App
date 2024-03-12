import { StyleSheet, Text, View,Image } from 'react-native'
import React,{useEffect,useState} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize,
  } from 'react-native-responsive-dimensions';
  import {useNavigation} from '@react-navigation/native';

export default function SplashScreen() {

    const navigation=useNavigation()

    
    setTimeout(async() => {
          let token = await AsyncStorage.getItem("token")
          console.log('token',token);
          if(token){
            navigation.replace("Products")
          }else{
            navigation.replace("Login")
          }
    }, 1000);

    return (
        <View style={styles.container}>
            <Image
            style={styles.img}
            source={require('../assets/images/bg2.jpg')}
            resizeMode={"contain"}
            />
            <Text style={styles.title}>UserAPI</Text>
        </View>
      );
    };
    
    const styles = StyleSheet.create({
      container: {
        alignItems: 'center',
        backgroundColor: '#86a6cf',
        height: responsiveHeight(120),
        width: responsiveWidth(100),
        justifyContent:'center',
        marginTop: responsiveHeight(-20)
      },
      img:{
        height: responsiveHeight(30),
        width: responsiveWidth(100),
      },
      title:{
        fontSize: responsiveFontSize(4),
        color:"white",
        fontWeight:"bold",
        elevation:5
      }
    });