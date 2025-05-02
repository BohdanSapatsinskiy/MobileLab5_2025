import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';

const FileView = ({ route, navigation }) => {
  const { filePath, fileName } = route.params;
  const [content, setContent] = useState('');
  const [isEdited, setIsEdited] = useState(false);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const fileContent = await FileSystem.readAsStringAsync(filePath);
        setContent(fileContent);
      } catch (err) {
        Alert.alert('Помилка', 'Не вдалося прочитати файл.');
      }
    };

    loadContent();
  }, []);

  const saveFile = async () => {
    try {
      await FileSystem.writeAsStringAsync(filePath, content);
      Alert.alert('Успіх', 'Файл збережено.');
      setIsEdited(false);
    } catch (err) {
      Alert.alert('Помилка', 'Не вдалося зберегти файл.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Файл: {fileName}</Text>
      <TextInput
        style={styles.input}
        multiline
        value={content}
        onChangeText={(text) => {
          setContent(text);
          setIsEdited(true);
        }}
      />
      {isEdited && (
        <Button title="💾 Зберегти" onPress={saveFile} />
      )}
    </View>
  );
};

export default FileView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    flex: 1,
    textAlignVertical: 'top',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    backgroundColor: '#f9f9f9',
  },
});
