import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';

const InfoElement = ({ route, navigation }) => {
  const { filePath } = route.params;
  const [fileInfo, setFileInfo] = useState(null);

  useEffect(() => {
    const fetchFileInfo = async () => {
      try {
        const info = await FileSystem.getInfoAsync(filePath);

        if (info.exists) {
          const stats = {
            name: info.uri.split('/').pop(),  // Отримуємо назву файлу/папки
            created: new Date(info.modificationTime).toLocaleString(),  // Перетворюємо timestamp в читабельну дату
            size: (info.size / 1024).toFixed(2),  // Розмір в КБ
          };
          setFileInfo(stats);
        } else {
          Alert.alert('Помилка', 'Файл чи папка не існує.');
        }
      } catch (err) {
        Alert.alert('Помилка', 'Не вдалося отримати інформацію про файл.');
      }
    };

    fetchFileInfo();
  }, []);

  return (
    <View style={styles.container}>
      {fileInfo ? (
        <>
          <Text style={styles.title}>Інформація про елемент</Text>
          <Text style={styles.text}>Назва: {fileInfo.name}</Text>
          <Text style={styles.text}>Дата створення/зміни: {fileInfo.created}</Text>
          <Text style={styles.text}>Розмір: {fileInfo.size} KB</Text>
        </>
      ) : (
        <Text style={styles.text}>Завантаження інформації...</Text>
      )}
        <Button
            title="✏️ Редагувати"
            onPress={() =>
                navigation.navigate('FileView', {
                    filePath: filePath,
                    fileName: fileInfo.name,
                })
            }
        />

      <Button title="Назад" onPress={() => navigation.goBack()} />
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

export default InfoElement;
