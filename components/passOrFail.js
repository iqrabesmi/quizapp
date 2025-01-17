import React, { useEffect, useState } from "react";
import { ScrollView, View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import RNPickerSelect from "react-native-picker-select";

const screenWidth = Dimensions.get("window").width;

const chartConfig = {
    backgroundGradientFrom:'#f4f4f4',
    backgroundGradientTo:'#f4f4f4',
    fillShadowGradientOpacity: 1,
    color: (opacity = 1) => `rgba(34, 139, 230, 1)`, 
    labelColor: (opacity = 1) => `rgb(0, 0, 0)`, 
  barPercentage: 0.5,
};

const PassOrFail = ({ route }) => {
  const { users, examScores, totalScores } = route.params;
  const [graphData, setGraphData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const processScores = () => {
      if (!examScores || !totalScores) {
        console.error("Missing data!");
        setLoading(false);
        return;
      }

      try {
        const cutoffs = {
          Fluency: totalScores.FluencyCutoff,
          letterWriting: totalScores.letterWritingCutoff,
          Listening: totalScores.ListeningCutoff,
          phonemeReplacement: totalScores.phonemeReplacementCutoff,
          rhymeTest: totalScores.rhymeTestCutoff,
          wordReading: totalScores.wordReadingCutoff,
          wordWriting: totalScores.wordWritingCutoff,
          letterReading: totalScores.letterReadingCutoff,
          pictureNaming: totalScores.pictureNamingCutoff,
        };

        const categories = Object.keys(cutoffs);
        const passFailCounts = categories.reduce((acc, category) => {
          acc[category] = { passed: 0, failed: 0 };
          return acc;
        }, {});

        // Initialize an object to track failures in each test per person for "Overall"
        const overallFailures = {};

        examScores.forEach((examScore) => {
          categories.forEach((category) => {
            if (examScore[category] >= cutoffs[category]) {
              passFailCounts[category].passed += 1;
            } else {
              passFailCounts[category].failed += 1;

              // Track failures for the "Overall" category
              if (!overallFailures[examScore.user]) {
                overallFailures[examScore.user] = 0;
              }
              overallFailures[examScore.user] += 1;
            }
          });
        });

        // Add "Overall" category based on more than 3 failures
        const overallCategory = {
          label: "Overall",
          passed: 0,
          failed: 0,
        };

        examScores.forEach((examScore) => {
          const totalFailures = overallFailures[examScore.user] || 0;
          if (totalFailures > 3) {
            overallCategory.failed += 1;
          } else {
            overallCategory.passed += 1;
          }
        });

        // Add the "Overall" category to the passFailCounts object
        passFailCounts["Overall"] = {
          passed: overallCategory.passed,
          failed: overallCategory.failed,
        };

        const formattedData = categories.map((category) => ({
          label: category,
          passed: passFailCounts[category].passed,
          failed: passFailCounts[category].failed,
        }));

        // Add "Overall" data to the formattedData array
        formattedData.push({
          label: "Overall",
          passed: overallCategory.passed,
          failed: overallCategory.failed,
        });

        setGraphData(formattedData);
        setSelectedCategory(formattedData[0]?.label || null); // Set default category
      } catch (error) {
        console.error("Error processing data:", error);
      } finally {
        setLoading(false);
      }
    };

    processScores();
  }, [examScores, totalScores]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#34a8eb" />
        <Text>Loading data...</Text>
      </View>
    );
  }

  const selectedData = graphData.find((data) => data.label === selectedCategory);

  const calculatePercentages = (data) => {
    const total = data.passed + data.failed;
    const passedPercentage = ((data.passed / total) * 100).toFixed(2);
    const failedPercentage = ((data.failed / total) * 100).toFixed(2);
    return { passedPercentage, failedPercentage };
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.pickerContainer}>
        <RNPickerSelect
          onValueChange={(value) => setSelectedCategory(value)}
          items={graphData.map((data) => ({
            label: data.label.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, (str) => str.toUpperCase()),
            value: data.label,
          }))}
          placeholder={{ label: "Select a Category", value: null }}
          value={selectedCategory}
          style={pickerSelectStyles}
        />
      </View>

      {selectedCategory && selectedData ? (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>{`${selectedData.label.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, (str) => str.toUpperCase())}`}</Text>
          <BarChart
            data={{
              labels: ["Passed", "Failed"],
              datasets: [
                {
                  data: [selectedData.passed, selectedData.failed],
                },
              ],
            }}
            width={screenWidth - 20}
            height={220}
            chartConfig={chartConfig}
            fromZero
            showValuesOnTopOfBars
            style={styles.barChart}
          />
          <View style={styles.percentageContainer}>
            <Text style={[styles.percentageText,{ color:"#28A745" }]}>
              Pass: {calculatePercentages(selectedData).passedPercentage}%
            </Text>
            <Text style={[styles.percentageText,{ color:"#DC3545" }]}>
              Fail: {calculatePercentages(selectedData).failedPercentage}%
            </Text>
          </View>
        </View>
      ) : (
        <Text style={styles.noDataText}>Select a category to view data</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container:{
    paddingVertical: 40,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  pickerContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor:"#66A3FF",
    borderRadius:10,
  },
  chartContainer: {
    marginBottom: 20,
  },
  chartTitle: {
    textAlign: "center",
    marginVertical:40,
    fontSize: 18,
  },
  barChart: {
    marginHorizontal: 10,
    borderRadius: 8,
  },
  percentageContainer: {
    marginTop: 40,
    width:"40%",
    marginHorizontal:20,
    padding:10,
    // marginLeft:20,
    alignItems: "flex-start",
    gap:10,
  },
  percentageText: {
    fontSize: 16,
    fontWeight:"bold",
    color: "#444",
  },
  noDataText: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
  },
});

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "black",
    paddingRight: 30,
    backgroundColor: "#f4f4f4",
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: "gray",
    borderRadius: 10,
    color: "ghostwhite",
    paddingRight: 30, 
  },
};

export default PassOrFail;
