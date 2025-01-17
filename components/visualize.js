import React , {useState} from 'react';
import { View, Text, Dimensions, ScrollView, StyleSheet  } from 'react-native';
import {Picker} from '@react-native-picker/picker'; 
import { PieChart, BarChart } from 'react-native-chart-kit';

// Helper function to group data
const groupBy = (array, key) =>
  array.reduce((result, currentValue) => {
    const group = currentValue[key];
    result[group] = (result[group] || 0) + 1;
    return result;
  }, {});


//  Helper function to calculate percentage
const calculatePercentages = (data) => {
    const total = Object.values(data).reduce((sum, value) => sum + value, 0);
    const percentages = Object.keys(data).map((key) => ({
        name: key,
        count: data[key],
        percentage: ((data[key] / total) * 100).toFixed(1),
    }));

    return percentages;
};
  

// Function to render a Pie Chart
const renderPieChart = (heading, pieChartData) => (
  <View style={{ marginBottom: 40 }}>
    <Text style={{ textAlign: 'center', fontSize: 25, marginVertical: 10 }}>
      {heading}
    </Text>
    <View style={styles.graph} >
      <PieChart
        data={pieChartData}
        width={Dimensions.get('window').width - 40}
        height={220}
        chartConfig={{
          backgroundColor: '#1E2923',
          backgroundGradientFrom: '#08130D',
          backgroundGradientTo: '#08130D',
          color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
    </View>
  </View>
);

// Function to render a Bar Chart
const renderBarChart = (heading, labels, values) => (
    <View style={{ marginBottom: 40 }}>
      <Text style={{ textAlign: 'center', fontSize: 25, marginVertical: 10 }}>
        {heading}
      </Text>
      <BarChart
        data={{
          labels: labels,
          datasets: [
            {
              data: values,
            },
          ],
        }}
        width={Dimensions.get('window').width - 40}
        height={300}
        yAxisLabel=""
        chartConfig={{
            backgroundGradientFrom:'#f4f4f4',
            backgroundGradientTo:'#f4f4f4',
            fillShadowGradientOpacity: 1,
            color: (opacity = 1) => `rgba(34, 139, 230, 1)`, 
            labelColor: (opacity = 1) => `rgb(0, 0, 0)`, 
        }}
        verticalLabelRotation={30}
      />
    </View>
);  

const pieCharts = ( data , name ) =>{
    let pieData = groupBy(data, name);
    let pieChartData = Object.keys(pieData).map((key, index) => ({
      name: key,
      population: pieData[key],
      color: ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#8E44AD'][index % 5],
      legendFontColor: '#333',
      legendFontSize: 15,
    }));

    return(
        <>
            {renderPieChart(`${name.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, (str) => str.toUpperCase())} Distribution`, pieChartData)}
        </>
    );
}

const barCharts = ( data , name ) => {

  let classData = groupBy(data, name);
  let barChartLabels = Object.keys(classData);
  let barChartValues = Object.values(classData);

  return(
    <>
        {renderBarChart(`${name.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, (str) => str.toUpperCase())} per Class`, barChartLabels, barChartValues)}
    </>
  );
}

const Visualize = ({ route }) => {
  const { data } = route.params;
  const [selectedCategory, setSelectedCategory] = useState('language');
  
  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>

            <View style={styles.pickerContainer}>
                <Picker
                selectedValue={selectedCategory}
                style={styles.picker}
                onValueChange={(itemValue) => setSelectedCategory(itemValue)}
                >
                <Picker.Item style={styles.item} label="Language" value="language" />
                <Picker.Item style={styles.item} label="Standard" value="standard" />
                <Picker.Item style={styles.item} label="Gender" value="gender" />
                <Picker.Item style={styles.item} label="Mother Tongue" value="motherTongue" />
                <Picker.Item style={styles.item} label="Relation" value="relation" />
                </Picker>
            </View>

            {/* Dynamically render Pie and Bar Charts based on selection */}
            
              {pieCharts(data, selectedCategory)}
              {barCharts(data, selectedCategory)}

    </ScrollView>
  );
};

const styles = StyleSheet.create({
    heading: {
      textAlign: 'center',
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      // color: '#fff',
    },
    pickerContainer: {
      marginBottom: 20,
      padding:5,
      backgroundColor: '#66A3FF',
      borderRadius: 10,
      overflow: 'hidden',
      elevation: 2,
    },
    picker: {
      padding:5,
      width: '100%',
      color:'#eeeeee'
    },
      graph:{
        backgroundColor:'#eeeeee',
        borderRadius:5,
        marginVertical:10,
      }
  });

export default Visualize;
