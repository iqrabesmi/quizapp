import React from "react";
import { View, Text, StyleSheet, ScrollView, Linking, TouchableOpacity, Image } from "react-native";

const About = () => {

    const handleLinkPress = () => {
        Linking.openURL('https://msreeharsha.vercel.app/');
    };

    return(
        <ScrollView style={styles.container}>

            <View style={styles.heading}>
                <Text style={styles.title} > D-SMART </Text>
                <Text style={styles.sub} >Dyslexia Screening for Multilingual Assessment and Response Tools </Text>
            </View>

            <View style={styles.matter} >
                <Text style={styles.txt} >
                    D-Smart is a specialized tool designed to identify early signs of dyslexia in individuals, 
                    primarily children. This device employs a series of interactive assessments that evaluate 
                    key areas related to dyslexia, such as phonological awareness, memory, processing speed, 
                    and reading fluency. By utilizing advanced series of test- assessments and data analysis, 
                    the device can provide a comprehensive profile of an individual's reading abilities and 
                    potential difficulties. Early detection through this screening allows for timely 
                    intervention and support, helping to mitigate the challenges associated with dyslexia 
                    and promoting better educational outcomes.
                </Text>
            </View>

            <View style={styles.heading}>
                <Text style={styles.title} > Developer </Text>
                <Text style={styles.sub} > {"M. Sree Harsha\nComputer Science Graduate"} </Text>
                <TouchableOpacity onPress={handleLinkPress}>
                    <View style={styles.linkContainer}>
                        <Text style={[styles.link , { fontStyle:"italic" } ]}>
                            Know more
                        </Text>
                        <Image
                            style={styles.image}
                            source={require("../assets/open_in_new.png")} 
                        />
                    </View>
                </TouchableOpacity>
            </View>

            <View style={styles.heading}>
                <Text style={styles.title} > Copyright </Text>
                <Text style={styles.sub} > {"Shafiulla (Syed) S\nResearch Scholar\nAuthor/Assistant Professor"} </Text>
            </View>
        </ScrollView>      
    );
};

const styles = StyleSheet.create({
    container:{
        flex: 1,
        // backgroundColor:"#201E43",
        padding:10,
        // marginVertical: 20,
        // margin: 10,
    },
    heading:{
        backgroundColor:'#66A3FF',
        paddingVertical: 20,
        paddingHorizontal: 10,
        elevation: 3,
        borderRadius: 10,
        marginVertical: 20,
    },
    title:{
        fontSize: 35,
        color: '#EEEEEE',
        marginBottom: 10,
        borderBottomWidth: 2,
        borderBottomColor: 'lightgray',
        fontWeight:'bold',
    },
    sub:{
        fontSize: 20 ,
        color: 'ghostwhite',
        textAlign: "left",
        fontStyle: "italic",
    },
    txt:{
        fontSize: 19,
        fontStyle: "italic",
        lineHeight: 28, 
        // color: '#eeeeee',
    },
    matter:{
        padding: 6,
        
    },
    linkContainer: {
        width:"42%",
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        borderColor:'lightblue',
        borderWidth: 3,
        borderRadius: 5,
        padding:5,
    },
    link: {
        fontSize: 18,
        marginLeft:5,
        marginRight: 5, 
        color:"ghostwhite",
    }, 
    image:{
        height: 20,
        width: 20,
    }
});

export default About;
