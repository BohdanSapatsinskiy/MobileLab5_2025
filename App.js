import { useEffect } from 'react';
import { Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as FileSystem from 'expo-file-system';

import Home from './screens/Home';
import FileView from './screens/FileView';
import InfoElement from './screens/InfoElement';
import Stats from './screens/Stats';

const Tab = createBottomTabNavigator();
const APP_FOLDER = FileSystem.documentDirectory + 'AppData/';

export default function App() {
  useEffect(() => {
    const checkOrCreateAppData = async () => {
      const dirInfo = await FileSystem.getInfoAsync(APP_FOLDER);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(APP_FOLDER, { intermediates: true });
      }
    };
    checkOrCreateAppData();
  }, []);

  const getTabIcon = (routeName, focused) => {
    let iconPath;
    switch (routeName) {
      case 'Home':
        iconPath = require('./img/Home.png');
        break;
      // case 'FileView': // Не потрібно додавати цей варіант
      case 'Stats':
        iconPath = require('./img/Stats.png');
        break;
    }
    return <Image source={iconPath} style={{ width: 24, height: 24, tintColor: focused ? '#007aff' : 'gray' }} />;
  };

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused }) => getTabIcon(route.name, focused),
        })}
      >
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen
          name="FileView"
          component={FileView}
          options={{
            tabBarButton: () => null,
            tabBarVisible: false,
          }}
        />
        <Tab.Screen 
          name="InfoElement"
          component={InfoElement}
          options={{
            tabBarButton: () => null,
            tabBarVisible: false,
          }}
        />
        <Tab.Screen name="Stats" component={Stats} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

