import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";

const NewBill = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <MaterialIcons name="lens" size={300} color="#D9D9D9"/> 
                <MaterialIcons name="add" size={150} color="#747474" style={styles.innerPlus}/>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F4F4FF', // Updated background color for the whole page
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    iconContainer: {
        width: 300,   // The same size as the MaterialIcons size
        height: 300,  // The same size as the MaterialIcons size
        borderRadius: 150,  // Half of the width and height to make it a perfect circle
        justifyContent: 'center',  // Center the icons vertically
        alignItems: 'center',  // Center the icons horizontally
        marginBottom: 100
    },
    innerPlus: {
        position: 'absolute', // This will make sure the plus icon overlays on top of the circle icon
    }
});

export default NewBill;
