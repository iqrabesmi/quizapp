import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput,Image } from 'react-native';
import { quizData } from './quizData';
import { quizData2 } from './quizData2';
import { hindiQuizData } from './quizDataHindi';
import { hindiQuizData2 } from './quizData2Hindi';
import { teluguQuizData } from './quizDataTelugu';
import { teluguQuizData2 } from './quizData2Telugu';

const Quiz = ({ setQuizDone, setQuizScores, language , standard }) => {
    const [currentLevel, setCurrentLevel] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [totalScore, setTotalScore] = useState(0);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [levelScores, setLevelScores] = useState({});
    const [completedLevels, setCompletedLevels] = useState([]);
    const [phase, setPhase] = useState(1); // For picture naming level: 1 = View, 2 = Jumbled
    const [jumbledImages, setJumbledImages] = useState([]); // Stores the jumbled images for Phase 2
    const [startTime, setStartTime] = useState(null); // Timer for phase 2
    const [timer, setTimer] = useState(60); // Timer for fluency level
    const [answerInput, setAnswerInput] = useState(''); // Input for user answer
    const [timeTaken,setTimeTaken] = useState(0);


    let currentData;
    if( language == "telugu" )
        currentData = standard <= 7 ? teluguQuizData : teluguQuizData2 ;
    else if ( language == "hindi" )
        currentData = standard <=7 ? hindiQuizData : hindiQuizData2 ;
    else
        currentData = standard <=7 ? quizData : quizData2 ;

    const startLevel = (level) => {
        if (!completedLevels.includes(level)) {
            setCurrentLevel(level);
            setPhase(1);
            setScore(0);
            setCurrentQuestion(0);
            setScore(0);
            setTimer(60); // Reset timer
        }
    };

    useEffect(() => {
        if (phase === 2 && currentLevel === 'pictureNaming') {
            // Generate jumbled images for Phase 2
            const images = [...currentData.pictureNaming.images];
            const jumbled = Array(20)
                .fill(null)
                .map(() => images[Math.floor(Math.random() * images.length)]);
            setJumbledImages(jumbled);
            setStartTime(Date.now()); // Start the timer for Phase 2
        }
    }, [phase]);
    

    useEffect(() => {
        if (currentLevel === 'pictureNaming' && timeTaken > 0) {
            setScore(timeTaken); // Update score based on time taken
            console.log(`Score for picture naming (Phase 2): ${timeTaken}`);
        }
    }, [timeTaken]); // React to changes in timeTaken
    
    useEffect( () => {
        if (currentLevel === 'pictureNaming' && score>0) {
            finishLevel(timeTaken);
        }
    },[score] );

    const handlePhase2Submit = () => {
        const time = Math.round((Date.now() - startTime) / 1000); // Calculate time in seconds
        setTimeTaken(time); // Trigger useEffect to handle score and level completion
        console.log(`Time taken for Phase 2: ${time} seconds`);
    };        

    const handleAnswer = (selectedOption) => {
        if (currentLevel === "Fluency") {
            // Simply record the input and proceed to the next question
            if (answerInput.trim() !== '') {
                setScore((prevScore) => parseInt(prevScore) + parseInt(selectedOption)); // Increment score for any valid input
            }
            setAnswerInput(''); // Clear input field
        } 
        else{
            // Check selected option for other levels
            if (selectedOption === currentData[currentLevel][currentQuestion]?.correctAnswer) {
                setScore((prevScore) => prevScore + 1);
            }
        }
    
        setCurrentQuestion((prevQuestion) => prevQuestion + 1);
    };
    

    useEffect(() => {
        if (currentLevel === 'Fluency') {
            // Start timer for fluency level
            const interval = setInterval(() => {
                setTimer((prevTimer) => {
                    if (prevTimer <= 1) {
                        clearInterval(interval);
                        setCurrentQuestion((prevQuestion) => prevQuestion + 1); // Move to next question when time runs out
                        return 0;
                    }
                    return prevTimer - 1;
                });
            }, 1000);

            return () => clearInterval(interval); // Clear interval on component unmount or level change
        }
    }, [currentLevel]);

    useEffect(() => {
        if (currentLevel && currentQuestion >= currentData[currentLevel].length) {
            finishLevel();
        }
    }, [currentQuestion, currentLevel]);

    const finishLevel = () => {
        const finalScore = score;

        setLevelScores((prevScores) => {
            const updatedScores = { ...prevScores, [currentLevel]: finalScore };
            setTotalScore((prevTotalScore) => prevTotalScore + finalScore);
            return updatedScores;
        });

        setCompletedLevels((prevCompletedLevels) => {
            const updatedLevels = [...prevCompletedLevels, currentLevel];
            return updatedLevels;
        });

        setCurrentLevel(null);
        setCurrentQuestion(0);
        setScore(0);
    };

    useEffect(() => {
        if (completedLevels.length === Object.keys(currentData).length) {
            setQuizCompleted(true);
            setQuizDone(true);
            setQuizScores(levelScores);
        }
    }, [completedLevels, levelScores, setQuizDone, setQuizScores]);

    const handleRetest = () => {
        setCurrentLevel(null);
        setCurrentQuestion(0);
        setScore(0);
        setTotalScore(0);
        setLevelScores({});
        setCompletedLevels([]);
        setQuizCompleted(false);
        setQuizDone(false);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {quizCompleted ? (
                <View style={styles.innerContainer}>
                    <Text style={styles.score}>Total Score: {totalScore}</Text>
                    {Object.entries(levelScores).map(([level, score], index) => (
                        <Text key={index} style={styles.levelScore}>
                            {level.charAt(0).toUpperCase() + level.slice(1)} Score: {score}
                        </Text>
                    ))}
                    <TouchableOpacity style={styles.retestButton} onPress={handleRetest}>
                        <Text style={styles.buttonText}>Retest</Text>
                    </TouchableOpacity>
                </View>
            ) : currentLevel ? (
                <View style={styles.innerContainer}>
                    <Text style={styles.questionIndicator}>
                        {currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1)} - Question {currentQuestion + 1} of {currentData[currentLevel].length}
                    </Text>
                    {currentLevel === 'Fluency' && (
                        <Text style={styles.timer}>Time Left: {timer}s</Text>
                    )}
                    <Text style={styles.question}>
                        {currentData[currentLevel][currentQuestion]?.question}
                    </Text>
                    {currentLevel === 'Fluency' ? (
                    <TextInput
                        style={styles.input}
                        value={answerInput}
                        onChangeText={(text) => {
                            // Allow only numbers
                            if (/^\d*$/.test(text)) {
                                setAnswerInput(text);
                            }
                        }}
                        placeholder="Enter a number"
                        keyboardType="numeric" // Ensures numeric keyboard on mobile devices
                    />
                ) :
                 currentLevel === 'pictureNaming' ? (
                    phase === 1 ? (
                        <View style={styles.innerContainer}>
                            {currentData.pictureNaming.images.map((item, index) => (
                                <View key={index} style={styles.imageContainer}>
                                    <Image source={item.image} style={styles.image} resizeMode="contain" />
                                    <Text style={styles.answerText}>{item.answer}</Text>
                                </View>
                            ))}
                            <TouchableOpacity style={styles.nextButton} onPress={() => setPhase(2)}>
                                <Text style={styles.buttonText}>Start Test</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.innerContainer}>
                            <ScrollView contentContainerStyle={styles.jumbledImagesContainer}>
                                {jumbledImages.map((item, index) => (
                                    <View key={index} style={styles.imageContainer}>
                                        <Image source={item.image} style={styles.image} resizeMode="contain" />
                                        {/* <TextInput
                                            style={styles.input}
                                            placeholder="Name the picture"
                                            onChangeText={(text) => {
                                                jumbledImages[index].userAnswer = text;
                                            }}
                                        /> */}
                                    </View>
                                ))}
                            </ScrollView>
                            <TouchableOpacity style={styles.submitButton} onPress={handlePhase2Submit}>
                                <Text style={styles.buttonText}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    )
                ) : (
                    currentData[currentLevel][currentQuestion]?.options.map((option, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.option}
                            onPress={() => handleAnswer(option)}
                        >
                            <Text style={styles.buttonText}>{option}</Text>
                        </TouchableOpacity>
                    ))
                )}
                {currentLevel === 'Fluency' && (
                    <TouchableOpacity style={styles.submitButton} onPress={() => handleAnswer(answerInput)}>
                        <Text style={styles.buttonText}>Submit</Text>
                    </TouchableOpacity>
                )}

                </View>
            ) : (
                // <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.innerContainer}>
                    <Text style={styles.selectLevelText}>Select a Level to Start</Text>
                    {Object.keys(currentData).map((level, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[styles.levelButton, completedLevels.includes(level) && styles.completedLevelButton]}
                            onPress={() => startLevel(level)}
                            disabled={completedLevels.includes(level)}
                        >
                            <Text style={styles.buttonText}>{level.charAt(0).toUpperCase() + level.slice(1)}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                // </ScrollView>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    // Add the `input` and `submitButton` styles
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
    },
    submitButton: {
        backgroundColor: '#007BFF',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    container: {
        flexGrow: 1,
        justifyContent: 'center',  // Vertically center content
        alignItems: 'center',      // Horizontally center content
        padding: 16,
    },
    innerContainer: {
        alignItems: 'center',
        width: '100%',  // Take up full width of the screen
        paddingHorizontal: 16,
    },
    questionIndicator: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'blue',
    },
    question: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    option: {
        backgroundColor: '#66A3FF',
        padding: 15,
        marginBottom: 10,
        width: '100%', // Take full width of the screen
        alignItems: 'center',
        borderRadius: 5,
    },
    buttonText: {
        fontSize: 16.5,
        color:"#fff",
        fontWeight: 'bold',
    },
    selectLevelText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    levelButton: {
        backgroundColor: '#66A3FF',  
        padding: 15 ,
        marginBottom: 15,
        width: '100%',  // Full width button
        alignItems: 'center',
        borderRadius: 5,
    },
    completedLevelButton: {
        backgroundColor: '#b2b2b2',  // Disabled color for completed levels
    },
    score: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    levelScore: {
        fontSize: 16,
        color: '#388E3C',
    },
    retestButton: {
        backgroundColor: '#4CAF50',  // Green color for retest button
        padding: 15,
        alignItems: 'center',
        borderRadius: 5,
        width: '100%',  // Full width button
        marginTop: 20,
    },
    imageContainer: {
        marginBottom: 20,
    },
    jumbledImagesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    image: {
        width: 100,
        height: 100,
        margin: 5,
    },
    nextButton: {
        backgroundColor: '#66A3FF',  // Green color for level buttons
        padding: 15,
        marginBottom: 10,
        width: '100%',  // Full width button
        alignItems: 'center',
        borderRadius: 5,
    },
    answerText: {
        textAlign: 'center',
        fontSize: 18,
    },
    timer: {
        fontSize: 20,
        marginVertical: 25,
        borderColor: "#e2e2e2",
        borderWidth: 1.5,
        paddingVertical:10,
        paddingHorizontal: 15,
        borderRadius: 8, 
    }
    // Existing styles remain unchanged
    // ...
});

export default Quiz;
