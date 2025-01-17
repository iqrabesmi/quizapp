import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const TotalDisplay = ({ route }) => {
  const { total } = route.params;

  // Function to render list items dynamically based on the key suffix
  const renderList = (keySuffix) => {
    return Object.keys(total).filter((key) => key.endsWith(keySuffix)).map((key) => {
      const label = key.replace(keySuffix, '');
      return {
        key,
        label: `${label}`,
        value: `${total[key].toFixed(2)}`
      };
    });
  };

  // Data for FlatList
  const sections = [
    { title: 'Category Totals', data: renderList('Total') },
    { title: 'Category Means', data: renderList('Mean') },
    { title: 'Category Medians', data: renderList('Median') },
    { title: 'Category Standard Deviations', data: renderList('SD') },
    { title: 'Category Cutoffs', data: renderList('Cutoff') },
  ];

  return (
    <View style={{ backgroundColor: '#eeeeee' , paddingVertical: 30 }} >
      <FlatList
        data={sections}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.section}>
            <Text style={styles.subHeading}>{item.title}</Text>
            <View style={{  backgroundColor: '#fff' , borderRadius:10 , elevation: 5 }} >
              <FlatList
                data={item.data}
                renderItem={({ item }) =>
                  <View style={styles.cells} >
                     <Text style={[ styles.item , { paddingLeft: 10 } ]}>{item.label.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, (str) => str.toUpperCase())}</Text>
                     <Text style={[styles.item , { textAlign:"right" , paddingRight: 20 } ]}>{item.value}</Text>
                  </View>
                    }
                keyExtractor={(item) => item.key}
              />
            </View>
          </View>
        )}
        // ListHeaderComponent={<Text style={styles.heading}>Total Data Overview</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  heading: {
    textAlign: 'center',
    // color: '#',
    fontSize: 25,
    marginVertical: 20,
  },
  section: {
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  subHeading: {
    fontSize: 22,
    color:'#003C99',
    textAlign:'right',
    marginBottom: 10,
    marginRight: 5,
    fontWeight: 'bold',
  },
  item: {
    padding: 8,
    width:"50%",
    borderRadius: 5,
    fontSize: 16,
    color: '#333',
  },
  cells:{
    display:"flex",
    flexDirection:"row",
  }
});

export default TotalDisplay;
