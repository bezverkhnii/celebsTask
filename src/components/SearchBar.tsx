import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';

const SearchBar = ({celebrities}) => {
  const handleSearch = text => {
    const filtered = celebrities.filter(celeb =>
      celeb.name.toLowerCase().includes(text.toLowerCase()),
    );

    console.log(filtered);
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Seacrh..." onChangeText={handleSearch} />
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
