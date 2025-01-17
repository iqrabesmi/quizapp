import React, { useState } from 'react';
import {StyleSheet, Alert , Image , TouchableOpacity , StatusBar , SafeAreaView } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import UserForm from './components/userForm';
import Flow from './components/quiFlow';
import Home from './components/Home';
import DisplayUsers from './components/displayUser';
import DisplayMarks from './components/displayMarks';
import ScreeningMarks from './components/screeningMarks';
import TotalDisplay from './components/totalDisplay';
import Visualize from './components/visualize';
import About from './components/about';
import PassOrFail from './components/passOrFail';
import LoginScreen from './components/login';

const Stack = createStackNavigator();

const App = () => {
  const [ login,setLogin ] = useState(false);
  const [user, setUser] = useState(null);
  const [standard, setStandard] = useState(7);
  const [language, setLanguage] = useState(null);
  const [school,setSchool] = useState(null);
  const [gender,setGender] = useState(null);
  const [dob,setDob] = useState(null);
  const [phone,setPhone] = useState(0);
  const [email,setEmail] = useState(null);
  const [motherTongue,setMotherTongue] = useState(null);
  const [relation,setRelation] = useState(null);
  const [father,setFather] = useState(null);
  const [mother,setMother] = useState(null);
  const [siblings,setSiblings] = useState(null);
  const [isQuizActive, setIsQuizActive] = useState(false); // Track if quiz is active
  const [msg,setMsg] = useState(null);

  // Function to reset state
  const resetState = () => {
    setUser(null);
    setStandard(7);
    setLanguage(null);
    setIsQuizActive(false);
  };

  // Handle navigation to QuizFlow only when user info is entered
  const handleQuizNavigation = (navigation) => {
    if (!user) {
      Alert.alert(
        "User Information Required",
        "Please enter your information before starting the quiz.",
        [
          { text: "Go to Form", onPress: () => navigation.navigate("UserForm") },
          { text: "Cancel", style: "cancel" },
        ]
      );
    } else {
      navigation.navigate("QuizFlow");
    }
  };

  // Handle navigation to Home with a warning if a quiz is active
  const handleHomeNavigation = (navigation) => {
    if (isQuizActive) {
      Alert.alert(
        "Warning",
        "You are in the middle of a quiz. Are you sure you want to go home? Your progress will be lost.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "OK",
            onPress: () => {
              resetState();
              navigation.reset({
                index: 0,
                routes: [{ name: "D-SMART" }],
              });
            },
          },
        ]
      );
    } else {
      resetState();
      navigation.reset({
        index: 0,
        routes: [{ name: "D-SMART" }],
      });
    }
  };
  
  const resetQuizDetails = () => {
    setUser(null); 
  };



  return (
    !login ? 
      <LoginScreen setLogin={setLogin} />
    :
    <SafeAreaView style={styles.safeArea}>
    <StatusBar
      barStyle="light-content"
      hidden={false}
      backgroundColor="#0056D2"
      translucent={true}
    />
    <NavigationContainer>
      <Stack.Navigator initialRouteName="D-SMART">
        {/* Home Screen */}
        <Stack.Screen
           name="D-SMART"
           options={({ navigation }) => ({
             headerLeft: null,
             headerStyle: {
               backgroundColor: '#0056D2',
             },
             headerTitleStyle: {
               fontSize: 30,
               fontWeight: 'bold',
               color: '#fff',
             },
             headerRight: () => (
               <TouchableOpacity onPress={() => navigation.navigate("About")}>
                 <Image
                   source={require("./assets/icons_clr/info.png")}
                   style={{ height: 35, width: 35, marginRight: 20 }}
                 />
               </TouchableOpacity>
             ),
           })}
         >
          {props => (
            <Home
              {...props}
              user={user} // Pass user state to Home
              msg={msg}
              handleQuizNavigation={handleQuizNavigation} // Pass quiz validation
              resetQuizDetails={resetQuizDetails}
              setLanguage = {setLanguage}
              language = {language}
            />
          )}
        </Stack.Screen>

        {/* QuizFlow Screen */}
        <Stack.Screen
          name="QuizFlow"
          options={({ navigation }) => ({
            title: 'Quiz',
            headerLeft: null, // Remove back button
            headerStyle: {
              backgroundColor: '#0056D2', 
            },
            headerTitleStyle: {
              fontSize: 30, 
              fontWeight: 'bold', 
              color: '#fff',
            },
           headerRight: () => (
              <TouchableOpacity onPress={() => handleHomeNavigation(navigation)} >
                <Image
                  source={require('./assets/icons_clr/reply.png')}
                  style={{ height: 45, width:45 , marginRight:10 }}
                  
                  />
              </TouchableOpacity>
            ),
          })}
        >
          {props => (
            <Flow
              {...props}
              standard={standard}
              language = { language }
              name = { user}
              school = { school }
              gender = {gender}
              dob = {dob}
              phone ={phone}
              email ={email}
              motherTongue = {motherTongue}
              relation = {relation}
              father = {father}
              mother = {mother}
              siblings = {siblings}
              setIsQuizActive={setIsQuizActive}
              setMsg={setMsg}
              setLanguage = {setLanguage}
              msg={msg}
              setUser={setUser} // Pass reset capability if needed inside Flow
            />
          )}
        </Stack.Screen>

        {/* UserForm Screen */}
        <Stack.Screen
          name="UserForm"
          options={({  }) => ({
            title: 'User Form',
            // headerLeft: null, 
            headerStyle: {
              backgroundColor: '#0056D2', 
            },
            headerTitleStyle: {
              fontSize: 25, 
              fontWeight: 'bold', 
              color: '#fff',
            },
            headerTintColor: '#ffffff',
            // headerRight: () => (
            //   <TouchableOpacity onPress={() => handleHomeNavigation(navigation)} >
            //     <Image
            //       source={require('./assets/icons_clr/home.png')}
            //       style={{ height: 45, width:45 , marginRight:10 }}
                  
            //       />
            //   </TouchableOpacity>
            // ),
          })}
        >
          {props => (
            <UserForm
              {...props}
              setUser={setUser}
              setStandard={setStandard}
              setLanguage={setLanguage}
              setDob = {setDob}
              setEmail={setEmail}
              setFather={setFather}
              setGender={setGender}
              setMother={setMother}
              setMotherTongue={setMotherTongue}
              setPhone={setPhone}
              setRelation={setRelation}
              setSchool={setSchool}
              setSiblings={setSiblings}
              setMsg={setMsg}
              msg={msg}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="DisplayUsers"
          options={({ }) => ({
            title: 'Users',
            headerStyle: {
              backgroundColor: '#0056D2', 
            },
            headerTitleStyle: {
              fontSize: 25, 
              fontWeight: 'bold', 
              color: '#fff',
            },
            headerTintColor: '#ffffff',
          })}
          component={DisplayUsers} />

        <Stack.Screen name="DisplayMarks"
          options={({ }) => ({
            title: 'Quiz Marks',
            headerStyle: {
              backgroundColor: '#0056D2', 
            },
            headerTitleStyle: {
              fontSize: 25, 
              fontWeight: 'bold', 
              color: '#fff',
            },
            headerTintColor: '#ffffff',
          })}
          component={DisplayMarks} /> 
          
          <Stack.Screen name="ScreeningMarks"
          options={({ }) => ({
            title: 'Screening Marks',
            headerStyle: {
              backgroundColor: '#0056D2', 
            },
            headerTitleStyle: {
              fontSize: 25, 
              fontWeight: 'bold', 
              color: '#fff',
            },
            headerTintColor: '#ffffff',
          })}
          component={ScreeningMarks} /> 

         <Stack.Screen name="TotalDisplay"
          options={({ }) => ({
            title: 'Totals',
            headerStyle: {
              backgroundColor: '#0056D2', 
            },
            headerTitleStyle: {
              fontSize: 25, 
              fontWeight: 'bold', 
              color: '#fff',
            },
            headerTintColor: '#ffffff',
          })}
          component={TotalDisplay} /> 

         <Stack.Screen name="Visualize"
          options={({ }) => ({
            title: 'Distributions',
            headerStyle: {
              backgroundColor: '#0056D2', 
            },
            headerTitleStyle: {
              fontSize: 25, 
              fontWeight: 'bold', 
              color: '#fff',
            },
            headerTintColor: '#ffffff',
          })}
          component={Visualize} /> 

         <Stack.Screen name="About"
          options={({ }) => ({
            title: 'About',
            headerStyle: {
              backgroundColor: '#0056D2', 
            },
            headerTitleStyle: {
              fontSize: 25, 
              fontWeight: 'bold', 
              color: '#fff',
            },
            headerTintColor: '#ffffff',
          })}
          component={About} /> 

        <Stack.Screen name="Total"
          options={({ }) => ({
            title: 'Graphs',
            headerStyle: {
              backgroundColor: '#0056D2', 
            },
            headerTitleStyle: {
              fontSize: 25, 
              fontWeight: 'bold', 
              color: '#fff',
            },
            headerTintColor: '#ffffff',
          })}
          component={PassOrFail} /> 

      </Stack.Navigator>
    </NavigationContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#fff', // Adjust background color to match your app theme
  },
});

export default App;

