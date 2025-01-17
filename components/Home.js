import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, Image } from 'react-native';
import XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';


const Home = ({ navigation, user, msg, handleQuizNavigation, resetQuizDetails , language , setLanguage }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalActions, setModalActions] = useState([]);
  const [serverStatus, setServerStatus] = useState(null);
  
  // For Server Data Button
  const [examScrores,setExamScores] = useState(null);
  const [totalScores,setTotalScores] = useState(null);
  const [users,setUsers] = useState(null);
  const [dataLoading,setDataLoading] = useState(false);
  const [dataPresent, setDataPresent] = useState(false);

  // For language selection
  const [languageModalVisible, setLanguageModalVisible] = useState(false); 
  const languages = ['english', 'hindi', 'telugu'];



  // exporting to excel
  const exportToExcel = async () => {
    const jsonData = examScrores;

    const filteredData = jsonData.map(item => {
      const { createdAt, updatedAt, __v, _id, user, ...rest } = item; 
      const userName = users.find(u => u._id === user)?.name || user;  

      const screeningTotal = item.behaviour + item.communication + item.motorCoordination + item.numberConcepts + item.readingAndWriting + item.soundAwareness;

      const result = {
        FluencyResult: item.Fluency >= totalScores.FluencyCutoff ? "Pass" : "Fail",
        letterWritingResult: item.letterWriting >= totalScores.letterWritingCutoff ? "Pass" : "Fail",
        ListeningResult: item.Listening >= totalScores.ListeningCutoff ? "Pass" : "Fail",
        phonemeReplacementResult: item.phonemeReplacement >= totalScores.phonemeReplacementCutoff ? "Pass" : "Fail",
        rhymeTestResult: item.rhymeTest >= totalScores.rhymeTestCutoff ? "Pass" : "Fail",
        wordReadingResult: item.wordReading >= totalScores.wordReadingCutoff ? "Pass" : "Fail",
        wordWritingResult: item.wordWriting >= totalScores.wordWritingCutoff ? "Pass" : "Fail",
        letterReadingResult: item.letterReading >= totalScores.letterReadingCutoff ? "Pass" : "Fail",
        pictureNamingResult: item.pictureNaming >= totalScores.pictureNamingCutoff ? "Pass" : "Fail",
      };
    
      // Count the number of "Fail" in the result
      const failCount = Object.values(result).filter(status => status === "Fail").length;

      return {
        user: userName, 
        ...rest,
        ...result,
        ScreeningResult : screeningTotal>=12 ? "Need medical check up" : "Normal",
        Result : failCount >=3 ? "Fail" : "Pass",
      };
    });

    try {
      // Convert JSON data to a worksheet
      const ws = XLSX.utils.json_to_sheet(filteredData);
      // Create a workbook and append the worksheet
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'ExamData');
  
      // Write the workbook as binary string
      const wbout = XLSX.write(wb, { type: 'binary', bookType: 'xlsx' });
  
      // Convert binary string to ArrayBuffer
      const buffer = new ArrayBuffer(wbout.length);
      const view = new Uint8Array(buffer);
      for (let i = 0; i < wbout.length; i++) {
        view[i] = wbout.charCodeAt(i) & 0xFF;
      }
  
      // Convert ArrayBuffer to Base64 string
      const base64String = arrayBufferToBase64(buffer);
  
      // Define file path
      const filePath = `${FileSystem.documentDirectory}ExamData.xlsx`;
  
      // Write file to the system (Base64 encoded string)
      await FileSystem.writeAsStringAsync(filePath, base64String, {
        encoding: FileSystem.EncodingType.Base64,
      });
  
      // Share the file
      await Sharing.shareAsync(filePath);
      console.log('Excel file exported and shared successfully!');
    } catch (error) {
      console.error('Error exporting Excel file:', error);
    }
  };
  
  // Helper function to convert ArrayBuffer to Base64 string
  const arrayBufferToBase64 = (buffer) => {
    const byteArray = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < byteArray.length; i++) {
      binary += String.fromCharCode(byteArray[i]);
    }
    return window.btoa(binary);  // Convert to Base64 string
  };



  const renderLanguageModal = () => (
    <Modal
      transparent={true}
      animationType="slide"
      visible={languageModalVisible}
      onRequestClose={() => setLanguageModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalMessage}>Select Language</Text>
          <ScrollView style={{ width: '100%' }}>
            {languages.map((lang, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.modalButton, language === lang ? styles.confirmButton : null]}
                onPress={() => {
                  setLanguage(lang);
                  setLanguageModalVisible(false);
                }}
              >
                <Text style={styles.modalButtonText}>{lang}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );


  // Fetching data form server
  const getDataFromServer = async () => {
    setDataLoading("Loading");
    try
    {
        const examResponse = await fetch("https://quizserver-11qu.onrender.com/JST/find");
        const userResponse = await fetch('https://quizserver-11qu.onrender.com/user/find');
        const totalResponse = await fetch('https://quizserver-11qu.onrender.com/total/find');
        if (!examResponse.ok) {
          throw new Error("Failed to fetch screening marks.");
        }
        if (!userResponse.ok) {
          throw new Error("Failed to fetch users.");
        }
        if(!totalResponse.ok){
          throw new Error("Failed to fetch totals.");
        }

        const data = await examResponse.json();
        setExamScores(data.exam);

        const data2 = await userResponse.json();
        setUsers(data2.users);

        const data3 = await totalResponse.json();
        setTotalScores(data3.total);

        setDataPresent(true);
        setDataLoading("Done");
    }
    catch(err)
    {
      setDataLoading("Error");
    }
  }

  const renderDataButton = () => {
    if( dataLoading == "Loading" ){
      return (
        <TouchableOpacity
          style={[styles.button,{backgroundColor:'transparent'}]}
          disabled={true}
        >
           <Image 
            source={ require('../assets/icons_clr/cloud_download.png') } 
            style={{ width: 35, height:35 }} 
          />
          <Text style={styles.buttonText}>Loading...</Text>
        </TouchableOpacity>
      );
    }
    
    if( dataLoading == "Error" ){
      return(
        <TouchableOpacity
          style={[styles.button,{backgroundColor:'transparent'}]}
          onPress={getDataFromServer}
        >
           <Image 
            source={ require('../assets/icons_clr/public.png') } 
            style={{ width: 35, height:35 }} 
          />
          <Text style={styles.buttonText}> Try Again </Text>
        </TouchableOpacity>
      );
    }

    if( dataLoading == "Done" ){
      return(
        <TouchableOpacity
          style={[styles.button,{backgroundColor:'transparent'}]}
          onPress={getDataFromServer}
        >
           <Image 
            source={ require('../assets/icons_clr/cloud_done.png') } 
            style={{ width: 35, height:35 }} 
          />
          <Text style={styles.buttonText}>Data Loaded</Text>
        </TouchableOpacity>
      );
    }

    return(
      <TouchableOpacity
        style={[styles.button,{backgroundColor:'transparent'}]}
        onPress={getDataFromServer}
      >
        <Image 
            source={ require('../assets/icons_clr/cloud_sync.png') } 
            style={{ width: 35, height:35 }} 
          />
        <Text style={styles.buttonText}>Load Data</Text>
      </TouchableOpacity>
    );
  }

  // server Connection Button -- PING 

  const checkServerConnection = async () => {
    setServerStatus("checking");
    try {
      const response = await fetch('https://quizserver-11qu.onrender.com/user/find'); // Replace with your server URL
      if (response.ok) {
        setServerStatus("connected");
      } else {
        setServerStatus(null);
        showModal('Error: Server responded, but not OK.', [{ label: 'OK', onPress: handleCloseModal }]);
      }
    } catch (error) {
      setServerStatus(null);
      showModal('Error: Unable to connect to the server.', [{ label: 'OK', onPress: handleCloseModal }]);
    }
  };

  const renderServerButton = () => {
    if (serverStatus === "checking") {
      return (
        <TouchableOpacity
          style={[styles.button,{backgroundColor:"transparent"}]}
          disabled={true}
        >
          <Image 
            source={ require('../assets/icons_clr/travel_explore.png') } 
            style={{ width: 35, height:35 }} 
          />
          <Text style={styles.buttonText}>Connecting...</Text>
        </TouchableOpacity>
      );
    }

    if (serverStatus === "connected") {
      return (
        <TouchableOpacity
          style={[styles.button,{backgroundColor:"transparent"}]}
          onPress={checkServerConnection}
        >
          <Image 
            source={ require('../assets/icons_clr/public.png') } 
            style={{ width: 35, height:35 }} 
          />
          <Text style={styles.buttonText}>Pong !!!</Text>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        style={[styles.button,{backgroundColor:"transparent"}]}
        
        onPress={checkServerConnection}
      >
        <Image 
            source={ require('../assets/icons_clr/public_off.png') } 
            style={{ width: 35, height:35 }} 
          />
        <Text style={styles.buttonText}>Ping</Text>
      </TouchableOpacity>
    );
  };

  const showModal = (message, actions) => {
    setModalMessage(message);
    setModalActions(actions);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  

  const renderCustomButton = (title = 'assignment',
    onPress,
    disabled = false, 
    color = 'transparent',
    img = (<Image 
      source={ require('../assets/icons_clr/group.png') } 
      style={{ width: 35, height:35 }} 
    />)
  ) => (

    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: disabled ? '#D3D3D3' : color },
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      
      {img}

      <Text style={styles.iconButtonText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>

      {/* <View style={styles.msg}>
        {user ? (
          <Text style={styles.title}>{msg}</Text>
        ) : (
          <Text style={styles.title}>Welcome to the D-SMART !!!</Text>
        )}
      </View>
       */}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quiz</Text>
        <View style={styles.horizontal}>
          <View style={styles.buttonWrapper}>
            {renderCustomButton('User Info', () => navigation.navigate('UserForm'),undefined,'#0077FF',
                ( user ?  <Image 
                  source={ require('../assets/icons_clr/assignment_turned_in.png') } 
                  style={{ width: 35, height:35 }} />
                 : <Image 
                 source={ require('../assets/icons_clr/pending.png') } 
                 style={{ width: 35, height:35 }} /> )
              ) }
          </View>
          <View style={styles.buttonWrapper}>
            {renderCustomButton(
              'Start Quiz',
              () => {
                if (!user) {
                  showModal('Please fill user Info first.', [{ label: 'OK', onPress: handleCloseModal }]);
                } else {
                  handleQuizNavigation(navigation);
                }
              },
              false,
              user ? '#0077FF' : '#b2b2b2',
              (<Image 
                source={ require('../assets/icons_clr/assignment.png') } 
                style={{ width: 35, height:35 }} 
              />)
            )}
          </View>
          <View style={styles.buttonWrapper}>
            {renderCustomButton(
              language ? `${language}` : "Language",
              () => setLanguageModalVisible(true),
              false,
              '#0077FF',
              (<Image 
                source={ require('../assets/icons_clr/language.png') } 
                style={{ width: 35, height:35 }} 
              />)
            )}
          </View>
          {renderLanguageModal()}
          <View style={styles.buttonWrapper}>
            {renderCustomButton(
              'Reset Quiz',
              () =>
                showModal('Are you sure to reset the quiz?\n\nThis action cannot be undone..!!', [
                  { label: 'Cancel', onPress: handleCloseModal },
                  {
                    label: 'Confirm',
                    onPress: () => {
                      handleCloseModal();
                      resetQuizDetails();
                      setServerStatus(null);
                      setLanguage(null);

                      console.log('Quiz Reset!');
                    },
                  },
                ]),
              false,
              '#0077FF',
              (<Image 
                source={ require('../assets/icons_clr/restart.png') } 
                style={{ width: 35, height:35 }} 
              />)
            )}
          </View>
        </View>
        
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Connection</Text>
        <View style={styles.horizontal}>
          <View style={styles.buttonWrapper}>
            {renderServerButton()}
          </View>
          <View style={styles.buttonWrapper} >
            {renderDataButton()}
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data</Text>
        
        {
          dataPresent ? 
          (
            <>
            <View style={styles.horizontal}>
              <View style={styles.buttonWrapper}>
                {renderCustomButton('Users', () => navigation.navigate('DisplayUsers' , { users } )
                  ,undefined,undefined,
                  (<Image 
                    source={ require('../assets/icons_clr/group.png') } 
                    style={{ width: 35, height:35 }} 
                  />)
                  )}
              </View>
              <View style={styles.buttonWrapper}>
                {renderCustomButton('Quiz', () => navigation.navigate('DisplayMarks' , { marksData : examScrores , users , total : totalScores } )
                  ,undefined,undefined,
                  (<Image 
                    source={ require('../assets/icons_clr/summarize.png') } 
                    style={{ width: 35, height:35 }} 
                  />)
                  )}
              </View>
              <View style={styles.buttonWrapper}>
                {renderCustomButton('Screening', () => navigation.navigate('ScreeningMarks' , { marksData : examScrores , users , total : totalScores }  )
                ,undefined,undefined,
                (<Image 
                  source={ require('../assets/icons_clr/summarize.png') } 
                  style={{ width: 35, height:35 }} 
                />)
                )}
              </View>
              <View style={styles.buttonWrapper}>
                {renderCustomButton('Totals', () => navigation.navigate('TotalDisplay' , { total : totalScores }  )
                ,undefined,undefined,
                (<Image 
                  source={ require('../assets/icons_clr/function.png') } 
                  style={{ width: 35, height:35 }} 
                />)
               )}
              </View>
              
              
              <View style={styles.buttonWrapper}>
                {renderCustomButton('Distributions', () => navigation.navigate('Visualize' , { data : users }  )
                ,undefined,undefined,
                (<Image 
                  source={ require('../assets/icons_clr/finance.png') } 
                  style={{ width: 35, height:35 }} 
                />)
                )}
              </View>

              <View style={styles.buttonWrapper}>
                {renderCustomButton('Visualize', () => navigation.navigate('Total' , { users , examScores:examScrores , totalScores }  )
                ,undefined,undefined,
                (<Image 
                  source={ require('../assets/icons_clr/finance.png') } 
                  style={{ width: 35, height:35 }} 
                />)
                )}
              </View>
              
              <View style={styles.buttonWrapper}>
                {renderCustomButton('Download', 
                () => exportToExcel() 
                ,undefined,undefined,
                (<Image 
                  source={ require('../assets/icons_clr/download.png') } 
                  style={{ width: 35, height:35 }} 
                />)
                )}
              </View>
            </View>
            </>
          ) : (
            <View>
              <Text style={styles.txt} > Please load data to access </Text>
            </View>
          )
          
        }
      </View>


      {/* <View style={styles.section} >
        <Text style={styles.sectionTitle} > About </Text>
        <View style={styles.buttonWrapper}>
          {renderCustomButton('About', () => navigation.navigate('About')
            ,undefined,undefined,
            (<Image 
              source={ require('../assets/icons_clr/info.png') } 
              style={{ width: 35, height:35 }} 
            />)
           )}
        </View>
      </View> */}

      <Modal
        transparent={true}
        animationType="fade"
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <View style={styles.modalButtonContainer}>
              {modalActions.map((action, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.modalButton, action.label === 'Confirm' ? styles.confirmButton : null]}
                  onPress={action.onPress}
                >
                  <Text style={styles.modalButtonText}>{action.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: "#f3f3f3",
    // backgroundColor:"#201E43",
    // backgroundColor:"#003366",
    padding: 10,
  },
  horizontal:{
    flex:1,
    flexDirection:"row",
    // justifyContent:"space-around",
    alignContent:'flex-start',
    flexWrap:'wrap',
  },
  iconButtonText:{
    position:"absolute",
    fontSize:12,
    top:"180%",
    color: "#333333",
    // color:'#7285a3',
    textAlign: "center",
    width:80,
  },
  msg:{
    width:"100%",
    borderRadius:10,
    paddingHorizontal:20,
    paddingVertical:5,
  },
  title: {
    fontSize: 25,
    marginVertical: 20,
    textAlign: 'center',
    fontWeight:"bold",
    color:"#003C99",
    // backgroundColor:"gray",
    // color:'#708090'
  },
  section: {
    width: '100%',
    marginVertical: 20,
    paddingHorizontal: 10,
    elevation:10,
    paddingVertical: 10,
    // backgroundColor:"#134B70",
    // backgroundColor:"#e3f2fc",
    backgroundColor: "#f4f4f4",
    borderRadius:10,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    // color:'#EEEEEE',
    color:"#003C99",
    // backgroundColor:"gray",
    // paddingBottom:15,
    // borderBottomWidth:2,
    // borderColor:'gray',
    marginVertical: 10,  
    marginLeft: 10,  
  },
  buttonWrapper: {
    width: 60,
    marginHorizontal:14,
    marginBottom:40,
  },
  button: {
    // width: '100%',
    // elevation:5,
    // shadowColor:'blue',
    paddingVertical:13,
    paddingHorizontal:7,
    borderRadius: 20,
    alignItems: 'center',
  },
  buttonText: {
    position:"absolute",
    top:"180%",
    width:100,
    fontSize: 12,
    color:'#333333',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 50,
    paddingHorizontal:20,
    alignItems: 'center',
  },
  modalMessage: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    padding: 10,
    margin:10,
    marginHorizontal: 5,
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: '#b2b2b2',
  },
  confirmButton: {
    backgroundColor: '#0077FF',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  defaultButton: {
    backgroundColor: '#0077FF',
  },
  checkingButton: {
    backgroundColor: '#b2b2b2',
  },
  connectedButton: {
    backgroundColor: '#25b715',
  },
  errorButton:{
    backgroundColor: "red",
  },
  txt: {
    fontSize: 20,
    textAlign: "center",
    padding: 10,
    marginVertical: 5,
    color: "gray",
  }
});

export default Home;
