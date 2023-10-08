import React from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    Image,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import waves from '../assets/waves.png';
import { 
    getFirestore, 
    getDocs, 
    query, 
    collection, 
    where, 
    doc, 
    updateDoc, 
    arrayUnion,
    orderBy,
    limit
} from 'firebase/firestore';

import { FIREBASE_AUTH } from "../firebaseConfig";

const AddFriends = ({ navigation }) => {

    //this input key is being used to clear the input box
    const emailInputRef = React.useRef(null);  // 1. Create a reference for the TextInput.

    const [friendEmail, setFriendEmail] = React.useState('');
    const [addedFriends, setAddedFriends] = React.useState([]);

    const addFriend = async () => {
        const db = getFirestore();
        
        // Create a query against the users collection where email is the provided friendEmail
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where("email", "==", friendEmail));
    
        // Execute the query
        const querySnapshot = await getDocs(q);
    
        if (!querySnapshot.empty) {
            let friendUID, friendFirstName;
            querySnapshot.forEach((document) => {
                friendUID = document.id;
                friendFirstName = document.data().firstName;
            });
            console.log("Friend's UID:", friendUID);
            if (!addedFriends.includes(friendFirstName)) {
                setAddedFriends([...addedFriends, friendFirstName]);
    
                const currentUserUID = FIREBASE_AUTH.currentUser.uid;
    
                // Query to get all bills created by the current user
                const billsRef = collection(db, 'bills');
                const allBillsQuery = query(billsRef, where("users", "array-contains", currentUserUID));
                const allBillsSnapshot = await getDocs(allBillsQuery);
                const allBills = allBillsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
                
                // Sort all bills by timeCreated in descending order to get the most recent bill
                allBills.sort((a, b) => new Date(b.timeCreated) - new Date(a.timeCreated));
                const mostRecentBill = allBills[0];
    
                if (mostRecentBill) {
                    const billDocRef = doc(db, 'bills', mostRecentBill.id);
                    
                    // Update the most recent bill document by adding the friend's UID to the "users" array
                    await updateDoc(billDocRef, {
                        users: arrayUnion(friendUID)
                    });
                } else {
                    console.error("No bills found for the current user.");
                    return;
                }
    
                // Add the friend's UID to the current user's friends array in Firestore
                const currentUserDocRef = doc(db, 'users', currentUserUID);
                await updateDoc(currentUserDocRef, {
                    friends: arrayUnion(friendUID)
                });
    
                alert("Friend added to the bill and to your friends list!");
            } 
            else {
                alert(`${friendFirstName} is already added!`);
            }
        } else {
            alert("No user found with the given email!");
        }
    };
    
    
    

    return (
        <SafeAreaView style={styles.container}>
            <Image source={waves} style={styles.waveBackground} />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View style={styles.friendsView}>
                    <View style={styles.header}>
                        <Text style={styles.headerText}>Add Recipients</Text>
                    </View>
                    <View style={styles.inputContainer}>
                    <TextInput
                        ref={emailInputRef}  // Attach the reference to the TextInput.
                        style={styles.input}
                        placeholder="Friend's Email"
                        keyboardType="email-address"
                        value={friendEmail}
                        onChangeText={setFriendEmail}
                        autoCapitalize="none"
                    />
                        <TouchableOpacity style={styles.button} onPress={addFriend}>
                            <Text style={styles.buttonText}>Add</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
            <View style={styles.addedFriendsContainer}>
                <Text style={styles.addedFriendsHeader}>Added Friends to Bill:</Text>
                {addedFriends.map((friend, index) => (
                    <Text key={index} style={styles.friendName}>
                        {friend}
                    </Text>
                ))}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    addedFriendsContainer: {
        marginTop: 30,
        padding: 20,
        borderRadius: 10,
        backgroundColor: "#FFF",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        alignItems: "center"
    },
    addedFriendsHeader: {
        fontSize: 20,
        fontWeight: "600",
        marginBottom: 10
    },
    addedFriendEmail: {
        fontSize: 16,
        color: "#333",
        marginBottom: 5
    },
    container: {
        flex: 1,
        backgroundColor: "#E8E8E8",
        alignItems: "center",
    },
    friendsView: {
        padding: 20,
        flexDirection: "column",
        justifyContent: "center", 
    },
    header: {
        paddingVertical: 22,
        paddingHorizontal: 10,
        borderRadius: 20,
        marginBottom: 20,
        marginTop: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
    },
    headerText: {
        fontSize: 45,
        fontWeight: '700',
        color: "#000",
        textAlign: 'center',
    },
    inputContainer: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    input: {
        width: 250,
        marginTop: 20,
        padding: 10,
        borderWidth: 1,
        borderColor: '#B1B1B1',
        borderRadius: 10,
        backgroundColor: '#FFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        textAlign: 'center',
        fontSize: 18,
    },
    button: {
        marginTop: 30,
        marginHorizontal: 50,
        backgroundColor: "#23B26E",
        padding: 15,
        borderRadius: 10,
        width: 250,
        shadowColor: "#171717",
        shadowOffset: { width: -1, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 20,
        fontWeight: '600',
        color: '#fff',
    },
    waveBackground: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        resizeMode: "cover",
    }
});

export default AddFriends;