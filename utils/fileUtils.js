import * as FileSystem from 'expo-file-system';

export const APP_FOLDER = FileSystem.documentDirectory + 'AppData/';

export const ensureAppFolderExists = async () => {
  const dirInfo = await FileSystem.getInfoAsync(APP_FOLDER);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(APP_FOLDER, { intermediates: true });
  }
};
