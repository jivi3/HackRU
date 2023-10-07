import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

const NewBill = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.greeting}>
                    Good evening
                </Text>
                <Text style={styles.directions}>
                    Start a New Bill
                </Text>
            </View>
            <View style={styles.iconContainer}>
                <View style={styles.verticalPart} />
                <View style={styles.horizontalPart} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F4FF',
        alignItems: 'center', // to keep the icon in the center
        marginBottom: 100
    },
    header: {
        flex: 1,
        width: '100%', // this will take up the full width of the container
        paddingTop: 20, // padding from the top of the screen
        paddingLeft: 20, // padding from the left of the screen
        justifyContent: 'flex-start',
    },
    iconContainer: {
        width: 230,
        height: 230,
        borderRadius: 150,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#D9D9D9',
        marginBottom: 200,
    },
    verticalPart: {
        position: 'absolute',
        width: 25, 
        height: 100,
        borderRadius: 10,
        backgroundColor: '#747474',
    },
    horizontalPart: {
        position: 'absolute',
        width: 100,
        height: 25,
        borderRadius: 10,
        backgroundColor: '#747474',
    },
    greeting: {
        fontSize: 32, 
        fontWeight: "bold",
        marginBottom: 10, // spacing between the greeting and the directions
    },
    directions: {
        fontSize: 24,
        fontWeight: "bold",
    }
});

export default NewBill;