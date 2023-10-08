import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    Image,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import waves from '../assets/waves.png';
import RegisterCard from '../components/register-card/register-card';

import { getFirestore, collection, addDoc } from "firebase/firestore";



const SignUp = ({ navigation }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSignUp = async () => {
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
    
        // TODO: Handle the signup logic here. (e.g., with Firebase Authentication)
    
        // After successfully signing up, save user data to Firestore
        const db = getFirestore();  // Initialize Firestore
    
        try {
            const docRef = await addDoc(collection(db, "users"), {
                firstName: firstName,
                lastName: lastName,
                email: email,
                // Do NOT save passwords directly in Firestore for security reasons.
                // Passwords should be managed through Firebase Authentication or another secure method.
            });
            console.log("User added with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding user: ", e);
        }
    
        console.log('User Signed Up:', email);
    };
    

        return (
            <SafeAreaView style={styles.container}>
                <Image source={waves} style={styles.waveBackground} />
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                    <View style={styles.signUpView}>
                        <View style={styles.header}>
                            <Text style={styles.headerText}>Register</Text>
                        </View>
                        <View style={styles.inputContainer}>
                            <RegisterCard 
                                setFirstName={setFirstName}
                                setLastName={setLastName}
                                setEmail={setEmail}
                                setPassword={setPassword}
                                setConfirmPassword={setConfirmPassword}
                            />
                            <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                                <Text style={styles.buttonText}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </SafeAreaView>
        );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#E8E8E8", 
        alignItems: "center",
    },
    signUpView: {
        padding: 20,
        flexDirection: "column",
        justifyContent: "space-around",
    },
    header: {
        paddingVertical: 22,
        paddingHorizontal: 10,
        borderRadius: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
    },
    headerText: {
        fontSize: 50,
        fontWeight: '700',
        color: "#000",
        textAlign: 'center',
    },
    // inputContainer: {
    //     backgroundColor: '#f4f4ff',
    //     borderRadius: 10,
    //     padding: 20,
    //     shadowColor: '#000',
    //     shadowOffset: { width: 0, height: 2 },
    //     shadowOpacity: 0.2,
    //     shadowRadius: 5,
    // },
    formContainer: {
        gap: 20,
        flexDirection: 'column',
        alignItems: 'center',
        
    },
    input: {
        width: '100%',
        padding: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#B1B1B1',  
        borderRadius: 10,
        backgroundColor: '#FFF', 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
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

export default SignUp;