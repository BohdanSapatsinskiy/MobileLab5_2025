import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  Modal,
  Button,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import { useNavigation } from '@react-navigation/native';
import { APP_FOLDER, ensureAppFolderExists } from '../utils/fileUtils';

const Home = () => {
  const [currentPath, setCurrentPath] = useState(APP_FOLDER);
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [createType, setCreateType] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const initialize = async () => {
      await ensureAppFolderExists();
      loadDirectory(APP_FOLDER);
    };
    initialize();
  }, []);

  const loadDirectory = async (path) => {
    try {
      const dirItems = await FileSystem.readDirectoryAsync(path);
      const itemsWithInfo = await Promise.all(
        dirItems.map(async (name) => {
          const fullPath = path + name + '/';
          const info = await FileSystem.getInfoAsync(fullPath);
          return {
            name,
            isDirectory: info.isDirectory,
            fullPath: info.isDirectory ? fullPath : path + name,
          };
        })
      );
      setItems(itemsWithInfo);
      setCurrentPath(path);
    } catch (err) {
      console.error('Error reading directory:', err);
    }
  };

  const goBack = () => {
    if (currentPath !== APP_FOLDER) {
      const newPath = currentPath
        .split('/')
        .filter((part, idx, arr) => idx < arr.length - 2)
        .join('/') + '/';
      loadDirectory(newPath);
    }
  };

  const createItem = async () => {
    const name = newName.trim();
    if (!name) {
      Alert.alert('Помилка', 'Введіть назву');
      return;
    }

    const newPath = currentPath + name + (createType === 'folder' ? '/' : '.txt');

    try {
      if (createType === 'folder') {
        await FileSystem.makeDirectoryAsync(newPath, { intermediates: true });
      } else {
        await FileSystem.writeAsStringAsync(newPath, '');
      }
      setShowModal(false);
      setNewName('');
      setCreateType(null);
      loadDirectory(currentPath);
    } catch (err) {
      Alert.alert('Помилка', 'Не вдалося створити');
    }
  };

  const confirmDelete = (item) => {
    Alert.alert(
      'Підтвердити видалення',
      `Ви дійсно хочете видалити ${item.name}?`,
      [
        { text: 'Скасувати', style: 'cancel' },
        {
          text: 'Видалити',
          style: 'destructive',
          onPress: async () => {
            try {
              await FileSystem.deleteAsync(item.fullPath, { idempotent: true });
              loadDirectory(currentPath);
            } catch (err) {
              Alert.alert('Помилка', 'Не вдалося видалити файл або папку.');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.path}>
        Поточний шлях: {currentPath.replace(FileSystem.documentDirectory, '')}
      </Text>

      {currentPath !== APP_FOLDER && (
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Text style={styles.backText}>⬅ Назад</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={items}
        keyExtractor={(item) => item.fullPath}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => {
              if (item.isDirectory) {
                loadDirectory(item.fullPath);
              } else {
                navigation.navigate('InfoElement', { filePath: item.fullPath });
              }
            }}
            onLongPress={() => confirmDelete(item)}
          >
            <Text style={{ fontWeight: item.isDirectory ? 'bold' : 'normal' }}>
              {item.name} {item.isDirectory ? '/' : ''}
            </Text>
          </TouchableOpacity>
        )}
      />

      <View style={styles.buttonContainer}>
        <Button title="📁 Створити папку" onPress={() => { setCreateType('folder'); setShowModal(true); }} />
        <Button title="📝 Новий файл" onPress={() => { setCreateType('file'); setShowModal(true); }} />
      </View>

      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text>Назва {createType === 'folder' ? 'папки' : 'файлу'}:</Text>
            <TextInput
              style={styles.input}
              placeholder="Введіть назву"
              value={newName}
              onChangeText={setNewName}
            />
            <Button title="Створити" onPress={createItem} />
            <Button title="Скасувати" onPress={() => setShowModal(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  path: {
    fontSize: 12,
    marginBottom: 8,
    color: 'gray',
  },
  backButton: {
    marginBottom: 10,
  },
  backText: {
    color: '#007aff',
  },
  item: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    width: '80%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    marginVertical: 10,
  },
});
