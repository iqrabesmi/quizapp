import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity, Platform, SafeAreaView,Alert } from 'react-native';
import { Formik } from 'formik';
import RNPickerSelect from 'react-native-picker-select';
import * as Yup from 'yup';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import ReactDatePicker from 'react-datepicker'; // Only for web
import 'react-datepicker/dist/react-datepicker.css';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  school: Yup.string().required('School is required'),
  gender: Yup.string().required('Gender is required'),
  class: Yup.string().required('Class is required'),
  dob: Yup.string().required('Date of Birth is required'),
  motherTongue: Yup.string().required('Mother tongue is required'),
  mediumOfInstruction: Yup.string().required('Medium of Instruction is required'),
  relationWithChild: Yup.string().required('Relation with child is required'),
  father: Yup.string().required('Father is required'),
  mother: Yup.string().required('Mother is required'),
  siblings: Yup.string().required('Siblings are required'),
});

const UserForm = (props) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const handleSubmitForm = (name,standard,language) => {
      Alert.alert('Success', 'User information submitted!');
      props.navigation.navigate('D-SMART'); // Navigate back to Home or QuizFlow if needed
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (selectedDate, setFieldValue) => {
    const formattedDate = selectedDate.toISOString().split('T')[0];
    setFieldValue('dob', formattedDate);
    hideDatePicker();
  };

  return (
    <Formik
      initialValues={{
        name: '',
        school: '',
        gender: '',
        class: '',
        dob: '',
        phone: '',
        email: '',
        motherTongue: '',
        mediumOfInstruction: '',
        relationWithChild: '',
        father: '',
        mother: '',
        siblings: '',
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        props.setUser(values.name);
        props.setLanguage(values.mediumOfInstruction);
        props.setStandard(values.class);
        props.setFather(values.father);
        props.setMother(values.mother);
        props.setDob(values.dob);
        props.setPhone(values.phone);
        props.setEmail(values.email);
        props.setMotherTongue(values.motherTongue);
        props.setSiblings(values.siblings);
        props.setRelation(values.relationWithChild);
        props.setGender(values.gender);
        props.setSchool(values.school);
        props.setMsg(`Hello ${values.name} !!!`);
        handleSubmitForm(values.name,values.motherTongue,values.class);
      }}
    >
      {({ handleChange, handleBlur,handleSubmit, setFieldValue, values, errors, touched }) => (
        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.scrollViewContainer}>
            <View style={styles.formWrapper}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                value={values.name}
              />
              {touched.name && errors.name && <Text style={styles.error}>{errors.name}</Text>}

              <Text style={styles.label}>School</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChange('school')}
                onBlur={handleBlur('school')}
                value={values.school}
              />
              {touched.school && errors.school && <Text style={styles.error}>{errors.school}</Text>}

              <Text style={styles.label}>Gender</Text>
              <View style={{ borderWidth: 1, borderColor: "gray", borderRadius: 5}}>
                <RNPickerSelect
                  onValueChange={(value) => setFieldValue('gender', value)}
                  items={[
                    { label: 'Male', value: 'male' },
                    { label: 'Female', value: 'female' },
                    { label: 'Other', value: 'other' },
                  ]}
                  placeholder={{ label: 'Select Gender', value: null }}
                  style={pickerSelectStyles}
                />
              </View>
              {touched.gender && errors.gender && <Text style={styles.error}>{errors.gender}</Text>}

              <Text style={styles.label}>Class</Text>
              <View style={{ borderWidth: 1, borderColor: "gray", borderRadius: 5}}>
                <RNPickerSelect
                  onValueChange={(value) => setFieldValue('class', value)}
                  items={[
                    { label: '1', value: '1' },
                    { label: '2', value: '2' },
                    { label: '3', value: '3' },
                    { label: '4', value: '4' },
                    { label: '5', value: '5' },
                    // { label: '6', value: '6' },
                    // { label: '7', value: '7' },
                    // { label: '8', value: '8' },
                    // { label: '9', value: '9' },
                    // { label: '10', value: '10' },
                  ]}
                  placeholder={{ label: 'Select Class', value: null }}
                  style={pickerSelectStyles}
                />
              </View>
              {touched.class && errors.class && <Text style={styles.error}>{errors.class}</Text>}

              <Text style={styles.label}>Date of Birth</Text>
              {Platform.OS === 'web' ? (
                <View style={styles.datePickerWrapper}>
                  <ReactDatePicker
                    selected={values.dob ? new Date(values.dob) : null}
                    onChange={(date) => setFieldValue('dob', date.toISOString().split('T')[0])}
                    placeholderText="Select Date of Birth"
                    customInput={<TextInput style={styles.datePickerInput} />}
                  />
                </View>
              ) : (
                <TouchableOpacity onPress={showDatePicker}>
                  <TextInput
                    style={styles.input}
                    value={values.dob}
                    placeholder="Select Date of Birth"
                    placeholderTextColor="gray"
                    editable={false}
                  />
                  <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={(date) => handleConfirm(date, setFieldValue)}
                    onCancel={hideDatePicker}
                  />
                </TouchableOpacity>
              )}
              {touched.dob && errors.dob && <Text style={styles.error}>{errors.dob}</Text>}

              <Text style={styles.label}>Phone</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChange('phone')}
                onBlur={handleBlur('phone')}
                value={values.phone}
                keyboardType="phone-pad"
              />

              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                keyboardType="email-address"
              />

              <Text style={styles.label}>Mother Tongue</Text>
              <View style={{ borderWidth: 1, borderColor: "gray", borderRadius: 5}}>
                <RNPickerSelect
                  onValueChange={(value) => setFieldValue('motherTongue', value)}
                  items={[
                    { label: 'English', value: 'english' },
                    { label: 'Telugu', value: 'telugu' },
                    { label: 'Hindi', value: 'hindi' },
                    { label: 'Other', value: 'other' },
                  ]}
                  placeholder={{ label: 'Select Mother Tongue', value: null }}
                  style={pickerSelectStyles}
                />
              </View>
              {touched.motherTongue && errors.motherTongue && <Text style={styles.error}>{errors.motherTongue}</Text>}

              <Text style={styles.label}>Medium of Instruction </Text>
              <View style={{ borderWidth: 1, borderColor: "gray", borderRadius: 5}}>
                <RNPickerSelect
                  onValueChange={(value) => setFieldValue('mediumOfInstruction', value)}
                  items={[
                    { label: 'English', value: 'english' },
                    { label: 'Telugu', value: 'telugu' },
                    { label: 'Hindi', value: 'hindi' },
                    { label: 'Other', value: 'other' },
                  ]}
                  placeholder={{ label: 'Select Medium of Instruction', value: null }}
                  style={pickerSelectStyles}
                />
              </View>
              {touched.mediumOfInstruction && errors.mediumOfInstruction && (
                <Text style={styles.error}>{errors.mediumOfInstruction}</Text>
              )}

              <Text style={styles.label}>Relation with Child</Text>
              <View style={{ borderWidth: 1, borderColor: "gray", borderRadius: 5}}>
                <RNPickerSelect
                  onValueChange={(value) => setFieldValue('relationWithChild', value)}
                  items={[
                    { label: 'Parent', value: 'parent' },
                    { label: 'Teacher', value: 'teacher' },
                    { label: 'Special Educator', value: 'specialEducator' },
                    { label: 'Research Scholar', value: 'researchScholar' },
                  ]}
                  placeholder={{ label: 'Select Relation with Child', value: null }}
                  style={pickerSelectStyles}
                />
              </View>
              {touched.relationWithChild && errors.relationWithChild && (
                <Text style={styles.error}>{errors.relationWithChild}</Text>
              )}

              <Text style={styles.label}>Father</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChange('father')}
                onBlur={handleBlur('father')}
                value={values.father}
              />
              {touched.father && errors.father && <Text style={styles.error}>{errors.father}</Text>}

              <Text style={styles.label}>Mother</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChange('mother')}
                onBlur={handleBlur('mother')}
                value={values.mother}
              />
              {touched.mother && errors.mother && <Text style={styles.error}>{errors.mother}</Text>}

              <Text style={styles.label}>Siblings</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChange('siblings')}
                onBlur={handleBlur('siblings')}
                value={values.siblings}
              />
              {touched.siblings && errors.siblings && <Text style={styles.error}>{errors.siblings}</Text>}

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
              >
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>

            </View>
          </ScrollView>
        </SafeAreaView>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: '#f7f7f7',
    // backgroundColor: '#201E43',
  },
  scrollViewContainer: {
    padding: 20,
    flexGrow: 1,
  },
  formWrapper: {
    flex: 1,
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 16,
    marginVertical: 5,
    color:"gray",
    // fontWeight: 'bold',
    marginTop:20,
  },
  input: {
    borderWidth: 1,
    borderColor:"gray",
    // backgroundColor:"#134B70",
    padding: 15,
    borderRadius: 5,
    // marginBottom: 25,
    // color:"#fff"
  },
  datePickerWrapper: {
    marginBottom: 10,
    color:"#fff",
  },
  datePickerInput: {
    borderWidth: 1,
    borderColor:"gray",
    color:"#fff",
    padding: 10,
    borderRadius: 5,
  },
  error: {
    color: 'red',
    fontSize: 12,
  },
  submitButton: {
    backgroundColor: '#28A745', 
    paddingVertical: 15,      
    paddingHorizontal: 20,   
    borderRadius: 5,          
    alignItems: 'center',      
    marginTop: 20,             
  },
  submitButtonText: {
    color: '#fff',           
    fontSize: 16,             
    fontWeight: 'bold',        
  },  
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor:"gray",
    borderRadius: 5,
    color: 'black',
    marginBottom: 10,
  },
  inputAndroid: {
    fontSize: 16,
    // paddingVertical: 2,
    paddingHorizontal: 10,
    // backgroundColor:"#508C9B",
    borderWidth: 1,
    borderColor:"gray",
    borderRadius: 5,
    // color:"#fff",
    // color: 'black',
    // marginBottom: 25,
  },
});

export default UserForm;
