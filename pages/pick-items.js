import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ScrollView } from 'react-native';

const itemsData = [
    { id: '1', name: 'Veg Samosa', price: '$5.99' },
    { id: '2', name: 'Masala Fries', price: '$5.99' },
    { id: '3', name: 'Masala Fries', price: '$5.99' },
    { id: '4', name: 'Grilled Panini', price: '$12.99' },
    { id: '5', name: 'Caramel Frap...', price: '$6.99' }
];

const namesData = [
    { id: '1', name: 'Darshan Patil', amountPaid: 'Paid $23.45' },
    { id: '2', name: 'Jivitech Irivicheddy', amountPaid: 'Paid $51.34' },
    { id: '3', name: 'Indraneel Vaka', amountPaid: 'Paid $43.53'},
    { id: '4', name: 'Rishi Parmar', amountPaid: 'Paid 34.93'},
];

const PickItems = ({ navigation }) => {
    const [selectedItems, setSelectedItems] = useState([]);

    const toggleItemSelection = (itemId) => {
        setSelectedItems((prevItems) =>
            prevItems.includes(itemId)
                ? prevItems.filter((id) => id !== itemId)
                : [...prevItems, itemId]
        );
    };

    

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Mithaas</Text>
                <View style={styles.dateContainer}>
                    <Text style={styles.date}>9/30/23</Text>
                </View>
            </View>
            
            <ScrollView horizontal={true} style={styles.namesScroll} showsHorizontalScrollIndicator={false}>
            {namesData.map((person) => (
                <View key={person.id} style={styles.nameContainer}>
                    <View style={styles.profilePicture}>
                        <Text style={styles.profileInitial}>
                            {person.name.charAt(0)}
                        </Text>
                    </View>
                    <View>
                        <Text style={styles.nameText}>{person.name.split(" ")[0]}</Text>
                        <Text style={styles.amountText}>{person.amountPaid}</Text>
                    </View>
                </View>
            ))}
        </ScrollView>
            <View>
                <Text
                style={styles.selectTitle}
                >Select items</Text>
            </View>
            <FlatList
                data={itemsData}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity 
                        style={selectedItems.includes(item.id) ? styles.itemSelected : styles.item}
                        onPress={() => toggleItemSelection(item.id)}
                    >
                        <Text style={styles.itemTitle}>{item.name}</Text>
                        <Text style={styles.itemPrice}>{item.price}</Text>
                    </TouchableOpacity>
                )}
            />

            <TouchableOpacity style={styles.payButton}>
                <Text style={styles.payButtonText}>Pay $18.22</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 80,  // Lower the whole view slightly
        paddingBottom: 10,
        paddingHorizontal: 20,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    dateContainer: {
        backgroundColor: '#4CAF50',
        borderRadius: 5,
        paddingVertical: 5,
        paddingHorizontal: 10,
    },
    date: {
        fontSize: 16,
        color: '#FFFFFF',
    },
    namesScroll: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    nameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,
        paddingHorizontal: 8,
        height: 80, // This ensures the container has a fixed height
        width: 200,
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 3,
    },
    profilePicture: {
        width: 55,   // Reduced size for the profile picture
        height: 55,  // Reduced size for the profile picture
        borderRadius: 17.5, // Half of width/height
        backgroundColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    profileInitial: {
        fontSize: 20, // Slightly reduce font size
        fontWeight: 'bold',
    },
    nameText: {
        fontSize: 22,
    },
    amountText: {
        fontSize: 20,
        color: '#4CAF50',
        marginTop: 2,  // Reduced margin
    },


    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 5,
        marginBottom: 10,
    },
    itemSelected: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 5,
        marginBottom: 10,
        backgroundColor: '#E0E0E0'
    },
    itemTitle: {
        fontSize: 20,
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    payButton: {
        padding: 15,
        backgroundColor: '#4CAF50',
        alignItems: 'center',
        borderRadius: 5,
    },
    payButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    selectTitle: {
        fontSize: 24,
        marginBottom: 15,
    }
});

export default PickItems;