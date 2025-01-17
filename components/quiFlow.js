import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import Screening from "./Screening";
import Quiz from "./Quiz";

const Flow = ({
    navigation,
    standard,
    language,
    setIsQuizActive,
    setUser,
    name,
    school,
    gender,
    dob,
    phone,
    email,
    motherTongue,
    relation,
    father,
    mother,
    siblings,
    setMsg,
    setLanguage,
}) => {
    const [screeningDone, setScreeningDone] = useState(false);
    const [screeningScores, setScreeningScores] = useState({});
    const [quizDone, setQuizDone] = useState(false);
    const [quizScores, setQuizScores] = useState({});
    const [submissionInProgress, setSubmissionInProgress] = useState(false);

    const userData = {
        name,
        standard,
        language,
        school,
        gender,
        dob,
        phone,
        email,
        motherTongue,
        relation,
        father,
        mother,
        siblings,
    };

    useEffect(() => {
        setIsQuizActive(true);
        return () => setIsQuizActive(false);
    }, [setIsQuizActive]);

    const sendDataToServer = async () => {
        try {
            console.log("User Data:", userData);
            console.log("Screening Scores:", screeningScores);
            console.log("Quiz Scores:", quizScores);

            const response = await fetch('https://quizserver-11qu.onrender.com/user/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });

            if (!response.ok) throw new Error("User data submission failed.");

            const responseData = await response.json();
            const userID = responseData.User._id;

            const postData = {
                userID,
                ...screeningScores,
                ...quizScores,
            };

            console.log( " Post data " , postData);

            const responsePost = await fetch('https://quizserver-11qu.onrender.com/JST/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(postData) , 
            });

            const responsePostData = await responsePost.json();
            console.log("Server Response for Scores:", responsePostData);

            if (!responsePost.ok) throw new Error("Quiz data submission failed.");

            Alert.alert("Success", "Your quiz data has been successfully submitted.");
            // Clear state and navigate
            setSubmissionInProgress(false);
            setScreeningDone(false);
            setScreeningScores({});     
            setQuizDone(false);
            setQuizScores({});
            setUser(null);
            setLanguage(null);
            navigation.navigate("D-SMART");
        } catch (error) {
            setSubmissionInProgress(false);
            Alert.alert("Error", error.message || "Unable to connect to the server.");
        }
    };

    useEffect(() => {
        if (screeningDone && quizDone && !submissionInProgress) {
            setSubmissionInProgress(true);
            sendDataToServer();
        }
    }, [screeningDone, quizDone, submissionInProgress]);

    if (submissionInProgress) {
        return (
            <View style={styles.container}>
                <Text style={styles.titleText}>Submitting your data...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {screeningDone ? (
                <Quiz
                    setQuizDone={setQuizDone}
                    setQuizScores={setQuizScores}
                    language={language}
                    standard={standard}
                />
            ) : (
                <Screening
                    standard={standard}
                    language={language}
                    setScreeningScores={setScreeningScores}
                    setScreeningDone={setScreeningDone}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 16,
        backgroundColor: "#FFFFFF",
    },
    titleText: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
        color: "#333",
        textAlign: "center",
    },
});

export default Flow;
