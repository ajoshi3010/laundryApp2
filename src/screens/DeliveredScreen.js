import React, { useState, useEffect } from 'react';
import { View, Text,ActivityIndicator, FlatList, TouchableOpacity, StyleSheet,StatusBar, Button, Platform } from 'react-native';
import axios from 'axios';
import * as IntentLauncher from 'expo-intent-launcher'; // Add this import
import { Ionicons } from '@expo/vector-icons';

// Add this function to send SMS
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

const DeliveredScreen = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [loading,setLoading]=useState(true);
  // Fetch contacts ready for delivery
  const fetchContacts = async () => {
    try {
      setLoading(true)
      const response = await axios.get('https://laundary-bharath-backend-o750iks6l.vercel.app/contacts/readyForDelivery');
      if (response.data.success) {
        setContacts(response.data.readyForDelivery);
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

  const markDelivered = async () => {
    if (!selectedContact) {
      alert('Please select a contact.');
      return;
    }

    try {
      const response = await axios.post('https://laundary-bharath-backend-o750iks6l.vercel.app/markDelivered', {
        id: selectedContact.id,
        name: selectedContact.name,
        phone: selectedContact.phone
      });

      if (response.data.success) {
        sendSMS(selectedContact.phone, 'Your clothes have been delivered.');
        // alert('Marked as delivered successfully!');
        // Refresh the contact list after successful operation
        fetchContacts();
        setSelectedContact(null); // Deselect contact after operation
      } else {
        alert('Failed to mark as delivered.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred.');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      {loading&&<ActivityIndicator size="large" color="#00ff00" />}
      
      <Text style={styles.title}>Ready for Delivery</Text>
      {!loading&&<FlatList
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
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>{item.name}</Text>
              <Text style={styles.contactPhone}>{item.phone}</Text>
            </View>
            {selectedContact?.id === item.id && (
              <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            )}
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyListText}>No contacts ready for delivery</Text>
        }
      />}
      <TouchableOpacity
        style={[styles.button, !selectedContact && styles.disabledButton]}
        onPress={markDelivered}
        disabled={!selectedContact}
      >
        <Text style={styles.buttonText}>Mark as Delivered</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#333',
  },
  contactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  selectedContact: {
    backgroundColor: '#E8F5E9',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  contactPhone: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  emptyListText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 20,
  },
  disabledButton: {
    backgroundColor: '#A5D6A7',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default DeliveredScreen;