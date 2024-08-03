import React, { useState, useEffect } from 'react';
import { View, Text, Button,ActivityIndicator, FlatList, TouchableOpacity, StyleSheet, Alert, Linking, Platform } from 'react-native';
import axios from 'axios';
import * as IntentLauncher from 'expo-intent-launcher';

const WorkFinishedScreen = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [loading,setLoading]=useState(true)
  // Fetch contacts whose status is 'inWork'
  const fetchContacts = async () => {
    try {
      const response = await axios.get('https://laundary-bharath-backend-o750iks6l.vercel.app/contacts/inWork');
      if (response.data.success) {
        setContacts(response.data.inWork);
      } else {
        alert('Failed to fetch contacts.');
      }
      setLoading(false)
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while fetching contacts.');
    }
  };

  // Call this function on component mount
  useEffect(() => {
    fetchContacts();
  }, []);

  const sendSMS = (phone, message) => {
    const smsUrl = `sms:${phone}?body=${encodeURIComponent(message)}`;
    if (Platform.OS === 'android') {
      IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
        data: smsUrl
      }).catch(err => console.error('Failed to open SMS app', err));
    } else {
      Linking.openURL(smsUrl).catch(err => console.error('Failed to open SMS app', err));
    }
  };

  const markWorkFinished = async () => {
    if (!selectedContact) {
      alert('Please select a contact.');
      return;
    }

    try {
      const response = await axios.post('https://laundary-bharath-backend-o750iks6l.vercel.app/markReady', {
        id: selectedContact.id,
        name: selectedContact.name,
        phone: selectedContact.phone
      });

      if (response.data.success) {
        sendSMS(selectedContact.phone, 'Your clothes are ready for delivery.');
        // alert('Marked as ready for delivery successfully!');
        // Refresh the contact list after successful operation
        fetchContacts();
        setSelectedContact(null); // Deselect contact after operation
      } else {
        alert('Failed to mark as ready.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ready for Delivery</Text>
      <Text style={styles.subtitle}>Select a Contact:</Text>
      {loading&&<ActivityIndicator size="large" color="#00ff00" />}
      {!loading &&
      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.contactItem,
              selectedContact?.id === item.id && styles.selectedContact
            ]}
            onPress={() => setSelectedContact(item)}
          >
            <Text style={styles.contactName}>{item.name}</Text>
            <Text style={styles.contactPhone}>{item.phone}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyListText}>No contacts in work status.</Text>
        }
      />}
      <TouchableOpacity 
        style={[styles.button, !selectedContact && styles.disabledButton]} 
        onPress={markWorkFinished}
        disabled={!selectedContact}
      >
        <Text style={styles.buttonText}>Mark as Ready for Delivery</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 15,
    color: '#555',
  },
  contactItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  selectedContact: {
    backgroundColor: '#e6f3ff',
    borderWidth: 2,
    borderColor: '#4a90e2',
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
  button: {
    backgroundColor: '#4a90e2',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#a0a0a0',
  },
  emptyListText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
});

export default WorkFinishedScreen;