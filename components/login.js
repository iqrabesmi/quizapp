import React, { useState } from 'react';
import { View, TextInput, Alert, Text, StyleSheet, SafeAreaView, StatusBar, Image, TouchableOpacity ,ImageBackground } from 'react-native';

// Hardcoded list of authorized users (name, password pairs)
const authorizedUsers = [
  { username: 'user', password: '123' },
];

const LoginScreen = (props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    const user = authorizedUsers.find(
      (user) => user.username === username && user.password === password
    );
    if (user) {
      Alert.alert('Success', 'You are logged in!');
      props.setLogin(true);
    } else {
      Alert.alert('Error', 'Invalid username or password');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
    <ImageBackground
      source={require('../assets/images/layered-waves-haikei.png')}
      style={{ flex:1 }}
      resizeMode='cover'
    >
      <StatusBar barStyle="light-content" backgroundColor="#0056D2" />
      
      <View style={styles.header}>
        <Text style={styles.name}>Welcome to </Text>
        <Text style={{ fontSize:60 , fontWeight:"bold" , color:"#fff" , marginTop:15 }} >D-SMART</Text>
      </View>

      <View style={styles.loginContainer}>
        <TextInput
          placeholder="Username"
          style={styles.input}
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          placeholder="Password"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Log In</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent:'space-between',
    // alignItems:"stretch",
    backgroundColor: '#f1f8ff', // Light blue background for a soft look
  },
  header: {
    width: '100%',
    paddingVertical: 30,
    paddingLeft: 20,
    // marginTop:10,
    justifyContent: 'center',
  },
  name: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#f5f5f5',
    textAlign: 'left',
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:150,
    paddingHorizontal: 30,
  },
  input: {
    width: '100%',
    // borderWidth: 2,
    borderRadius: 15,
    padding: 15,
    marginVertical: 12,
    // borderColor: '#0056D2', 
    backgroundColor: '#fff',
    fontSize: 16,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButton: {
    width: '100%',
    padding: 16,
    backgroundColor: '#28A745', // Green background for the login button
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    marginTop: 15,
    shadowColor: 'lightblue',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
