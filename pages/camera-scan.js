import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function CameraScan( { navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Camera</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
  },
});

export default CameraScan;