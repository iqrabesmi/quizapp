import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, Image } from "react-native";

const DisplayUsers = ({ route }) => {
  const { users } = route.params;

  const [searchText, setSearchText] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(users);

  useEffect(() => {
    const lowercasedText = searchText.toLowerCase();
    setFilteredUsers(
      users.filter((user) =>
        user.name.toLowerCase().includes(lowercasedText)
      )
    );
  }, [searchText, users]);

  // Table Header
  const TableHeader = () => (
    <View style={styles.tableHeader}>
      <Text style={styles.tableHeaderText}>User Name</Text>
      <Text style={styles.tableHeaderText}>School</Text>
      <Text style={styles.tableHeaderText}>Gender</Text>
      <Text style={styles.tableHeaderText}>Standard</Text>
      <Text style={styles.tableHeaderText}>DOB</Text>
      <Text style={styles.tableHeaderText}>Phone</Text>
      <Text style={styles.tableHeaderText}>Email</Text>
      <Text style={styles.tableHeaderText}>Mother Tongue</Text>
      <Text style={styles.tableHeaderText}>Language</Text>
      <Text style={styles.tableHeaderText}>Relation</Text>
      <Text style={styles.tableHeaderText}>Father</Text>
      <Text style={styles.tableHeaderText}>Mother</Text>
      <Text style={styles.tableHeaderText}>Siblings</Text>
    </View>
  );

  // Render each row of user data
  const renderRow = (item, idx) => (
    <View key={item._id || idx} style={styles.tableRow}>
      <Text style={styles.tableCell}>{item.name}</Text>
      <Text style={styles.tableCell}>{item.school}</Text>
      <Text style={styles.tableCell}>{item.gender}</Text>
      <Text style={styles.tableCell}>{item.standard}</Text>
      <Text style={styles.tableCell}>{item.dob}</Text>
      <Text style={styles.tableCell}>{item.phone}</Text>
      <Text style={styles.tableCell}>{item.email}</Text>
      <Text style={styles.tableCell}>{item.motherTongue}</Text>
      <Text style={styles.tableCell}>{item.language}</Text>
      <Text style={styles.tableCell}>{item.relation}</Text>
      <Text style={styles.tableCell}>{item.father}</Text>
      <Text style={styles.tableCell}>{item.mother}</Text>
      <Text style={styles.tableCell}>{item.siblings}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1 , backgroundColor:"lightgray" }}>
      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Image
          source={require("../assets/icons_clr/search_black.png")}
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
                  {filteredUsers.map((item, index) => renderRow(item, index))}
            </ScrollView>
          </View>
        </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    paddingVertical: 20,
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
    width: 150,
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
    width: 150,
    paddingHorizontal: 5,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    minHeight:45,
    margin: 15,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: "#999",
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
});

export default DisplayUsers;
