import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, ScrollView , Image } from "react-native";

const ScreeningMarks = ({ route }) => {
  const { users, marksData } = route.params;

  const [searchText, setSearchText] = useState('');
  const [filteredMarksData, setFilteredMarksData] = useState(marksData);

  // Update filtered data based on search input
  useEffect(() => {
    const lowercasedText = searchText.toLowerCase();
    setFilteredMarksData(
      marksData.filter((item) => {
        const user = users.find((user) => user._id === item.user);
        return user && user.name.toLowerCase().includes(lowercasedText);
      })
    );
  }, [searchText, marksData, users]);

  // Table Header
  const TableHeader = () => (
    <View style={styles.tableHeader}>
      <Text style={styles.tableHeaderText}>User Name</Text>
      <Text style={styles.tableHeaderText}>Behaviour</Text>
      <Text style={styles.tableHeaderText}>Communication</Text>
      <Text style={styles.tableHeaderText}>Motor Coordination</Text>
      <Text style={styles.tableHeaderText}>Number Concepts</Text>
      <Text style={styles.tableHeaderText}>Reading And Writing</Text>
      <Text style={styles.tableHeaderText}>Sound Awareness</Text>
    </View>
  );

  // Render each row of marks data
  const renderRow = (item, idx) => {
    const user = users.find((user) => user._id === item.user);
  
    // Calculate the total score for the row
    const totalScore = item.behaviour + item.communication + item.motorCoordination + item.numberConcepts + item.readingAndWriting + item.soundAwareness;
    
    // Set row background color to red if total score is >= 12
    const rowStyle = totalScore >= 12 ? { backgroundColor: '#FFCCCC' } : { backgroundColor: '#EBF4F6' };
  
    return (
      <View key={item._id || idx} style={[styles.tableRow, rowStyle]}>
        <Text style={[styles.tableCell]}>{user ? user.name : "Unknown"}</Text>
        <Text style={[styles.tableCell, { color: item.behaviour > 0 ? "red" : "black" }]}>{item.behaviour}</Text>
        <Text style={[styles.tableCell, { color: item.communication > 0 ? "red" : "black" }]}>{item.communication}</Text>
        <Text style={[styles.tableCell, { color: item.motorCoordination > 0 ? "red" : "black" }]}>{item.motorCoordination}</Text>
        <Text style={[styles.tableCell, { color: item.numberConcepts > 0 ? "red" : "black" }]}>{item.numberConcepts}</Text>
        <Text style={[styles.tableCell, { color: item.readingAndWriting > 0 ? "red" : "black" }]}>{item.readingAndWriting}</Text>
        <Text style={[styles.tableCell, { color: item.soundAwareness > 0 ? "red" : "black" }]}>{item.soundAwareness}</Text>
      </View>
    );
  };
  

  return (
    <View style={{ flex: 1 , backgroundColor: "lightgray" }}>
      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Image
          source={require('../assets/icons_clr/search_black.png')} 
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name..."
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
        />
      </View>

      {/* Table */}
      <ScrollView horizontal={true} style={styles.container}>
        <View style={styles.tableWrapper}>
          <TableHeader />
          <ScrollView>
            {filteredMarksData.map((item, index) => renderRow(item, index))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#201E43",
    paddingHorizontal: 5,
    paddingVertical: 20,
  },
  tableWrapper: {
    flexDirection: "column",
    marginRight: 10,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#0056D2",
    paddingVertical: 10,
    paddingHorizontal: 5,
    justifyContent: "space-between",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginBottom: 5,
  },
  tableHeaderText: {
    color: "#ecf0f1",
    fontWeight: "bold",
    textAlign: "center",
    width: 120, // Fixed column width
  },
  tableRow: {
    flexDirection: "row",
    backgroundColor: "#EBF4F6",
    paddingVertical: 12,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    justifyContent: "space-between",
  },
  tableCell: {
    textAlign: "center",
    fontSize: 16,
    width: 120, // Ensure the same width as the header
    paddingHorizontal: 5,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    margin:15,
    minHeight:45,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: '#999',
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
});

export default ScreeningMarks;
