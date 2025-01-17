import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, Image } from "react-native";

const DisplayMarks = ({ route }) => {
  const { users, marksData , total } = route.params;

  const [searchText, setSearchText] = useState('');
  const [filteredMarksData, setFilteredMarksData] = useState(marksData);

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
      <Text style={styles.tableHeaderText}>Fluency</Text>
      <Text style={styles.tableHeaderText}>Letter Reading</Text>
      <Text style={styles.tableHeaderText}>Letter Writing</Text>
      <Text style={styles.tableHeaderText}>Word Reading</Text>
      <Text style={styles.tableHeaderText}>Word Writing</Text>
      <Text style={styles.tableHeaderText}>Listening</Text>
      <Text style={styles.tableHeaderText}>Phoneme Replacement</Text>
      <Text style={styles.tableHeaderText}>Rhyme Test</Text>
      <Text style={styles.tableHeaderText}>Picture Naming</Text>
    </View>
  );

  // Render each row of marks data
  const renderRow = (item, idx) => {
    const user = users.find((user) => user._id === item.user);
    // Count failed tests for the user
    const failedTests = [
      item.Fluency < total.FluencyCutoff,
      item.letterReading < total.letterReadingCutoff,
      item.letterWriting < total.letterWritingCutoff,
      item.wordReading < total.wordReadingCutoff,
      item.wordWriting < total.wordWritingCutoff,
      item.Listening < total.ListeningCutoff,
      item.phonemeReplacement < total.phonemeReplacementCutoff,
      item.rhymeTest < total.rhymeTestCutoff,
      item.pictureNaming < total.pictureNamingCutoff,
    ].filter((failed) => failed).length;
  
    // Determine row color based on the number of failed tests
    const rowColor = failedTests > 3 ? "#FFCCCC" : "#EBF4F6"; // Light red if failed more than 3 tests
  
    return (
      <View key={item._id || idx} style={[styles.tableRow, { backgroundColor: rowColor }]}>
        <Text style={[styles.tableCell]}>
          {user ? user.name : "Unknown"}
        </Text>
        <Text style={[styles.tableCell, { color: total.FluencyCutoff <= item.Fluency ? "black" : "red" }]}>
          {item.Fluency}
        </Text>
        <Text style={[styles.tableCell, { color: total.letterReadingCutoff <= item.letterReading ? "black" : "red" }]}>
          {item.letterReading}
        </Text>
        <Text style={[styles.tableCell, { color: total.letterWritingCutoff <= item.letterWriting ? "black" : "red" }]}>
          {item.letterWriting}
        </Text>
        <Text style={[styles.tableCell, { color: total.wordReadingCutoff <= item.wordReading ? "black" : "red" }]}>
          {item.wordReading}
        </Text>
        <Text style={[styles.tableCell, { color: total.wordWritingCutoff <= item.wordWriting ? "black" : "red" }]}>
          {item.wordWriting}
        </Text>
        <Text style={[styles.tableCell, { color: total.ListeningCutoff <= item.Listening ? "black" : "red" }]}>
          {item.Listening}
        </Text>
        <Text style={[styles.tableCell, { color: total.phonemeReplacementCutoff <= item.phonemeReplacement ? "black" : "red" }]}>
          {item.phonemeReplacement}
        </Text>
        <Text style={[styles.tableCell, { color: total.rhymeTestCutoff <= item.rhymeTest ? "black" : "red" }]}>
          {item.rhymeTest}
        </Text>
        <Text style={[styles.tableCell, { color: total.pictureNamingCutoff <= item.pictureNaming ? "black" : "red" }]}>
          {item.pictureNaming}
        </Text>
      </View>
    );
  };
  

  return (
    <View style={{ flex: 1 , backgroundColor:'lightgray' }}>
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
    marginRight:10,
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
    width: 120,
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
    width: 120,
    paddingHorizontal: 5,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    minHeight:45,
    margin:15,
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

export default DisplayMarks;
