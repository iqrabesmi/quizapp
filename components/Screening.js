import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { JSTData } from './ScreeningJSTData'; 
import { MSTData } from './ScreeningMSTData';
import { JSTDataHindi } from './ScreeningJSTHindiData';
import { MSTDataHindi } from './ScreeningMSTHindiData';
import { JSTDataTelugu } from './ScreeningJSTTeluguData';
import { MSTDataTelugu } from './ScreeningMSTTeluguData';

const Screening = (props) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scores, setScores] = useState({});
  const [completed, setCompleted] = useState(false);

  // Flatten questions without shuffling
  let allQuestions;
  if( props.language == "telugu" ) 
    {
      allQuestions = props.standard <= 7 
        ? Object.entries(JSTDataTelugu).flatMap(([section, questions]) =>
            questions.map(question => ({ ...question, section })))
        : Object.entries(MSTDataTelugu).flatMap(([section, questions]) =>
            questions.map(question => ({ ...question, section })));
    }
  else if( props.language == "hindi" ) 
  {
    allQuestions = props.standard <= 7 
      ? Object.entries(JSTDataHindi).flatMap(([section, questions]) =>
          questions.map(question => ({ ...question, section })))
      : Object.entries(MSTDataHindi).flatMap(([section, questions]) =>
          questions.map(question => ({ ...question, section })));
  }
  else
  {
    allQuestions = props.standard <= 7 
      ? Object.entries(JSTData).flatMap(([section, questions]) =>
          questions.map(question => ({ ...question, section })))
      : Object.entries(MSTData).flatMap(([section, questions]) =>
          questions.map(question => ({ ...question, section })));  
  }

  
  const handleAnswer = (section, score) => {
    setScores(prevScores => ({
      ...prevScores,
      [section]: (prevScores[section] || 0) + score,
    }));

    if (currentQuestionIndex < allQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setCompleted(true);
    }
  };

  useEffect(() => {
    if (completed) {
      props.setScreeningDone(true);
      props.setScreeningScores(scores);
    }
  }, [completed, props, scores]);

  if (completed) {
    const totalScore = Object.values(scores).reduce((total, score) => total + score, 0);
    return (
      <View style={styles.resultContainer}>
        <Text style={styles.resultText}>Quiz Complete!</Text>
        <Text style={styles.resultText}>Section Scores:</Text>
        {Object.entries(scores).map(([section, score]) => (
          <Text key={section} style={styles.sectionScore}>{section}: {score}</Text>
        ))}
        <Text style={styles.totalScore}>Overall Score: {totalScore}</Text>
      </View>
    );
  }

  const { question, options, scores: optionScores, section } = allQuestions[currentQuestionIndex];
  const remainingQuestions = allQuestions.length - currentQuestionIndex - 1;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.remainingText}>Questions left: {remainingQuestions}</Text>
      <Text style={styles.questionText}>{question}</Text>
      <View style={styles.buttonContainer}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={`${currentQuestionIndex}-${index}`}
            style={styles.buttonWrapper}
            onPress={() => handleAnswer(section, optionScores[option])}
          >
            <Text style={styles.buttonText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 5,
    // backgroundColor: '#F5F5F5',
  },
  questionText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  remainingText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginBottom: 15,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  buttonWrapper: {
    width: '90%', 
    marginVertical: 8, 
    backgroundColor: '#66A3FF',
    paddingVertical: 15, 
    alignItems: 'center',
    borderRadius: 5, 
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: '#E8F5E9',
  },
  resultText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionScore: {
    fontSize: 18,
    color: '#388E3C',
    marginVertical: 5,
    textAlign: 'center',
  },
  totalScore: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    color: '#1B5E20',
    textAlign: 'center',
  },
});

export default Screening;
