import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';

const Stats = () => {
  const [freeStorage, setFreeStorage] = useState(null);
  const [totalStorage, setTotalStorage] = useState(null);
  const [usedStorage, setUsedStorage] = useState(null);

  useEffect(() => {
    const fetchStorageStats = async () => {
      try {
        const free = await FileSystem.getFreeDiskStorageAsync();
        const total = await FileSystem.getTotalDiskCapacityAsync();
        
        setFreeStorage(free);
        setTotalStorage(total);
        setUsedStorage(total - free);  // Використаний об'єм пам'яті
      } catch (err) {
        Alert.alert('Помилка', 'Не вдалося отримати статистику пам’яті');
      }
    };

    fetchStorageStats();
  }, []);

  return (
    <View style={styles.container}>
        <Text style={styles.title}>Статистика пам'яті</Text>

        <Text style={styles.text}>Загальний об'єм: {totalStorage ? (totalStorage / 1024 / 1024 / 1024).toFixed(2) : 'Завантаження...'} GB</Text>
        <Text style={styles.text}>Вільний об'єм: {freeStorage ? (freeStorage / 1024 / 1024 / 1024).toFixed(2) : 'Завантаження...'} GB</Text>
        <Text style={styles.text}>Використано: {usedStorage ? (usedStorage / 1024 / 1024 / 1024).toFixed(2) : 'Завантаження...'} GB</Text>
        
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default Stats;
