import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';

const SearchBar = ({
  celebrities,
  setFilteredCelebrities,
  searchText,
  setSearchText,
}) => {
  const handleSearch = text => {
    setSearchText(text);
    const filtered = celebrities.filter(celeb =>
      celeb.name.toLowerCase().includes(text.toLowerCase()),
    );

    console.log(filtered); //logic works but state will be updated to many times which will block the fast updating logic,
    setFilteredCelebrities(filtered);
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Seacrh..."
        onChangeText={handleSearch}
        value={searchText}
      />
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 10,
    borderWidth: 1,
    backgroundColor: '#fff',
  },
});
