import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import axios from 'axios';
import * as Contacts from 'expo-contacts';

const AddContactScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [contacts, setContacts] = useState([]);
    const [filteredContacts, setFilteredContacts] = useState([]);
    const [search, setSearch] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    const handleAddContact = async () => {
        const prefixedPhone = phone.startsWith('+91') ? phone : `+91${phone}`;
        try {
            const response = await axios.post('https://laundary-bharath-backend-o750iks6l.vercel.app/addContact', { name, phone: prefixedPhone });
            if (response.data.success) {
                alert('Contact added successfully');
                navigation.goBack(); // Navigate back to the home screen
            } else {
                alert('Error adding contact: ' + response.data.error);
            }
        } catch (error) {
            alert('Error: ' + error.message);
        }
    };

    const handleFetchContacts = async () => {
        // alert('hello')
        const { status } = await Contacts.requestPermissionsAsync();
        if (status === 'granted') {
            const { data } = await Contacts.getContactsAsync({
                fields: [Contacts.Fields.PhoneNumbers]
            });

            if (data.length > 0) {
                setContacts(data);
                setFilteredContacts(data);
                setModalVisible(true);
            }
        }
    };

    const handleSearch = (text) => {
        setSearch(text);
        const filtered = contacts.filter(contact =>
            contact.name.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredContacts(filtered);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Add Contact</Text>
            <TextInput 
                style={styles.input} 
                placeholder="Name" 
                value={name} 
                onChangeText={setName} 
            />
            <TextInput 
                style={styles.input} 
                placeholder="Phone" 
                value={phone} 
                onChangeText={setPhone} 
                keyboardType="phone-pad"
            />
            <TouchableOpacity style={styles.button} onPress={handleAddContact}>
                <Text style={styles.buttonText}>Add Contact</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={handleFetchContacts}>
                <Text style={styles.secondaryButtonText}>Fetch Contacts</Text>
            </TouchableOpacity>

            <Modal visible={modalVisible} animationType="slide">
                <View style={styles.modalContainer}>
                    <TextInput
                        style={styles.searchBar}
                        placeholder="Search Contacts"
                        value={search}
                        onChangeText={handleSearch}
                    />
                    <FlatList
                        data={filteredContacts}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity 
                                style={styles.contactItem}
                                onPress={() => {
                                    setName(item.name);
                                    if (item.phoneNumbers && item.phoneNumbers.length > 0) {
                                        setPhone(item.phoneNumbers[0].number);
                                    } else {
                                        setPhone('');
                                    }
                                    setModalVisible(false);
                                }}
                            >
                                <Text style={styles.contactName}>{item.name}</Text>
                                <Text style={styles.contactPhone}>
                                    {item.phoneNumbers && item.phoneNumbers.length > 0 ? item.phoneNumbers[0].number : 'No phone number'}
                                </Text>
                            </TouchableOpacity>
                        )}
                    />
                    <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 40, // Fixed value for top padding
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    input: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderRadius: 10,
        marginBottom: 15,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#4a90e2',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 15,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
    secondaryButton: {
        backgroundColor: '#f0f0f0',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    secondaryButtonText: {
        color: '#333',
        fontSize: 18,
        fontWeight: '600',
    },
    modalContainer: {
        flex: 1,
        padding: 20,
        paddingTop: 40, // Fixed value for top padding
        backgroundColor: 'white',
    },
    searchBar: {
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderRadius: 10,
        marginBottom: 20,
        fontSize: 16,
    },
    contactItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    contactName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    contactPhone: {
        fontSize: 16,
        color: '#666',
        marginTop: 5,
    },
    closeButton: {
        backgroundColor: '#e74c3c',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    closeButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
});

export default AddContactScreen;