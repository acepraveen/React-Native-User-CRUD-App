import React, {useState} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  ImageBackground,
  ScrollView,
  ActivityIndicator,
  Modal,
} from 'react-native';
import Toast from 'react-native-toast-message';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import {useNavigation} from '@react-navigation/native';
import {validateEmail, validatePassword} from '../constants/validate';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [borderChange, setborderChange] = useState({
    emailBorder: 'white',
    passwordBorder: 'white',
  });
  const [loader, setLoader] = useState(false);

  const navigation = useNavigation();
  const handleLogin = async () => {
    if (!email.trim()) {
      showErrorToast('Please enter email ');
      setEmail('');
      setborderChange({...borderChange, emailBorder: 'red'});
      return;
    } else if (!validateEmail(email)) {
      showErrorToast('Please enter valid email');
      setborderChange({...borderChange, emailBorder: 'red'});
      return;
    } else if (!password.trim()) {
      showErrorToast('Please enter password');
      setPassword('');
      setborderChange({...borderChange, passwordBorder: 'red'});
      return;
    } else if (!validatePassword(password)) {
      showErrorToast('Please enter strong password');
      setborderChange({...borderChange, passwordBorder: 'red'});
      return;
    }
    setLoader(true);
    let data = JSON.stringify({
      email: email,
      password: password,
    })
    console.log('d',data);
    
    await fetch('ADD LOGIN API', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data,
    })
      .then(res => {
        console.log('rrr',res.json());
        
        return res.json();
      })
      .then(async res => {
        console.log('res', res);
        setLoader(false);
        if (res.token) {
          showSuccessToast(`Logged in Successfully`);
          await AsyncStorage.setItem("token",JSON.stringify(res.token))
          setTimeout(() => {
            navigation.replace('Products');
          }, 1000);
        } else {
          showErrorToast(`${res.error ? res.error : res.msg? res.msg : "Something went wrong"}`);
        }
      });


  };

  const showErrorToast = message => {
    Toast.show({
      type: 'error',
      text1: 'Login',
      text2: message,
      visibilityTime: 3000,
      autoHide: true,
    });
  };

  const showSuccessToast = message => {
    Toast.show({
      type: 'success',
      text1: 'Login',
      text2: message,
      visibilityTime: 1000,
      autoHide: true,
    });
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={styles.container}>
    
      <Modal transparent visible={loader}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.1)',
          }}>
          <ActivityIndicator size="large" />
        </View>
      </Modal>
      <ScrollView
        contentContainerStyle={{
          alignItems: 'center',
          paddingBottom: responsiveHeight(20),
        }}>
        <ImageBackground
          source={require('../assets/images/bg1.jpg')}
          // source={{uri:""}}
          style={{
            width: responsiveWidth(100),
            height: responsiveHeight(40),
            justifyContent: 'center',
            // alignItems:"center"
          }}
          resizeMode={'cover'}>
          <Text
            style={{
              fontSize: responsiveFontSize(4),
              width: responsiveWidth(65),
              color: 'white',
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
            Login
          </Text>
        </ImageBackground>

        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.input,
              {borderWidth: 2, borderColor: borderChange.emailBorder},
            ]}
            placeholder="Email"
            placeholderTextColor="gray"
            onChangeText={text => {
              setEmail(text);
              setborderChange({...borderChange, emailBorder: 'white'});
            }}
            value={email}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <View
            style={[
              styles.passwordInput,
              {borderWidth: 2, borderColor: borderChange.passwordBorder},
            ]}>
            <TextInput
              style={styles.passwordField}
              placeholder="Password"
              placeholderTextColor="gray"
              onChangeText={text => {
                setPassword(text);
                setborderChange({...borderChange, passwordBorder: 'white'});
              }}
              value={password}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              onPress={toggleShowPassword}
              style={styles.showHideButton}>
              <Text style={{
                color:"gray",
                width: responsiveWidth(12)
              }}>{showPassword ? 'Hide' : 'Show'}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={handleLogin} style={styles.loginBtn}>
            <Text style={styles.loginBtnTxt}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.signupButton}
          onPress={()=>{
            navigation.navigate('Register')
          }}
          >
            <Text style={styles.signupText}>SignUp</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#86a6cf',
    borderBottomRightRadius: responsiveHeight(24),
    height: responsiveHeight(100),
    width: responsiveWidth(100),
  },
  input: {
    height: 60,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 40,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    width: responsiveWidth(80),
    marginTop: responsiveHeight(5),
    color:'black'
  },
  passwordInput: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderColor: '#ccc',
    borderWidth: 1,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    width: responsiveWidth(80),
  },
  passwordField: {
    flex: 1,
    color:'black'
  },
  showHideButton: {
    padding: 8,
  },
  signupButton: {
    marginTop: responsiveHeight(7),
  },
  signupText: {
    color: '#fff',
    textDecorationLine: 'underline',
    fontSize: 16,
    textAlign:"center"
  },
  loginBtn: {
    backgroundColor: '#fab74e',
    paddingHorizontal: responsiveWidth(15),
    paddingVertical: responsiveHeight(1),
    borderRadius: 50,
    elevation: 10,
    alignSelf: 'center',
    marginTop: responsiveHeight(10),
  },
  loginBtnTxt: {
    textAlign: 'center',
    fontSize: responsiveFontSize(3),
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
