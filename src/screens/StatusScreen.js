import React, { useState, useEffect } from 'react';
import { ActivityIndicator,View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const StatusScreen = () => {
  const [statusData, setStatusData] = useState({
    inWork: [],
    readyForDelivery: [],
    history: [],
  });
  const [activeTab, setActiveTab] = useState('inWork');
  const [refreshing, setRefreshing] = useState(false);
  const [loading,setLoading]=useState(true);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://laundary-bharath-backend-o750iks6l.vercel.app/status');
      setStatusData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching status:', error);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStatus();
    setRefreshing(false);
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemId}>ID: {item.id}</Text>
      </View>
      <Text style={styles.itemPhone}>{item.phone}</Text>
    </View>
  );

  const renderTabContent = () => {
    let data;
    switch (activeTab) {
      case 'inWork':
        data = statusData.inWork;
        break;
      case 'readyForDelivery':
        data = statusData.readyForDelivery;
        break;
      case 'history':
        data = statusData.history;
        break;
      default:
        data = [];
    }

    return (
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyListText}>No items to display</Text>
        }
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.screenTitle}>Order Status</Text>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'inWork' && styles.activeTab]}
          onPress={() => setActiveTab('inWork')}
        >
          <Ionicons name="construct-outline" size={24} color={activeTab === 'inWork' ? '#4CAF50' : '#757575'} />
          <Text style={[styles.tabText, activeTab === 'inWork' && styles.activeTabText]}>In Work</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'readyForDelivery' && styles.activeTab]}
          onPress={() => setActiveTab('readyForDelivery')}
        >
          <Ionicons name="checkmark-circle-outline" size={24} color={activeTab === 'readyForDelivery' ? '#4CAF50' : '#757575'} />
          <Text style={[styles.tabText, activeTab === 'readyForDelivery' && styles.activeTabText]}>Ready</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'history' && styles.activeTab]}
          onPress={() => setActiveTab('history')}
        >
          <Ionicons name="time-outline" size={24} color={activeTab === 'history' ? '#4CAF50' : '#757575'} />
          <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>History</Text>
        </TouchableOpacity>
      </View>
      {!loading&&renderTabContent()}
      {loading&&<ActivityIndicator size="large" color="#00ff00" />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginVertical: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tab: {
    alignItems: 'center',
    padding: 10,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#4CAF50',
  },
  tabText: {
    marginTop: 5,
    fontSize: 14,
    color: '#757575',
  },
  activeTabText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  itemContainer: {
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  itemId: {
    fontSize: 14,
    color: '#757575',
  },
  itemPhone: {
    fontSize: 16,
    color: '#555',
  },
  emptyListText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#757575',
    marginTop: 20,
  },
});

export default StatusScreen;