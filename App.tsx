import 'react-native-gesture-handler'; // This must be the first import
import React, { useState } from 'react';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import 'react-native-gesture-handler';
// import { useReactNavigationDevTools } from '@dev-plugins/react-navigation';
import { SafeAreaView, StyleSheet, StatusBar, Text, View, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import PokedexView from './src/components/pokedex/PokedexView';
import TCGView from './src/components/tcg/TCGView';
import { UserProvider, useUser } from './src/contexts/UserContext';
import HomeScreen from './src/components/auth/HomeScreen';

// Create placeholder screens for new features
const PokedexScreen = ({ navigation }: any) => {
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => setSettingsModalVisible(true)}
          accessibilityRole="button"
          accessibilityLabel="Settings"
          accessibilityHint="Opens Pokedex settings to change sprite styles"
        >
          <MaterialIcons name="album" size={24} color="white" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <SafeAreaView style={[styles.container, { flex: 1 }]}>
      <PokedexView
        settingsModalVisible={settingsModalVisible}
        setSettingsModalVisible={setSettingsModalVisible}
      />
    </SafeAreaView>
  );
};
const TradingCardsScreen = () => (
  <SafeAreaView style={[styles.container, { flex: 1 }]}>
    <TCGView />
  </SafeAreaView>
);

const TeamBuilderScreen = () => (
  <View style={styles.screenContainer}>
    <Text>Showdown Team Builder Coming Soon!</Text>
  </View>
);

const Drawer = createDrawerNavigator();

// Custom drawer content with logout button
const CustomDrawerContent = (props: any) => {
  const { logout, user } = useUser();

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await logout();
            // The app will automatically show the HomeScreen when user is logged out
          },
        },
      ]
    );
  };

  return (
    <View style={styles.drawerContainer}>
      <DrawerContentScrollView {...props} style={styles.drawerContent} contentContainerStyle={styles.drawerContentContainer}>
        {/* User info section */}
        {user && (
          <View style={styles.userInfoSection}>
            <View style={styles.userAvatar}>
              <MaterialIcons name="person" size={40} color="#f44336" />
            </View>
            <Text style={styles.userName}>{user.displayName || 'Trainer'}</Text>
            {user.email && <Text style={styles.userEmail}>{user.email}</Text>}
          </View>
        )}

        {/* Regular drawer items */}
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      {/* Logout button - fixed at bottom */}
      <View style={styles.logoutSection}>
        <DrawerItem
          label="Sign Out"
          onPress={handleLogout}
          icon={({ color, size }) => (
            <MaterialIcons name="logout" size={size} color="#f44336" />
          )}
          labelStyle={styles.logoutLabel}
        />
      </View>
    </View>
  );
};

const AppContent = () => {
  const { isAuthenticated, user } = useUser();
  const [showHome, setShowHome] = useState(!isAuthenticated);
  const navigationRef = useNavigationContainerRef();
  // useReactNavigationDevTools(navigationRef);

  const handleLogin = () => {
    setShowHome(false);
  };

  // Watch for authentication changes
  React.useEffect(() => {
    if (!isAuthenticated) {
      setShowHome(true);
    }
  }, [isAuthenticated]);

  if (showHome) {
    return <HomeScreen onLogin={handleLogin} />;
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <StatusBar
        barStyle='light-content'
        backgroundColor='#f44336'
      />
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerStyle: {
            backgroundColor: '#f44336',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          drawerActiveTintColor: '#f44336',
          drawerInactiveTintColor: '#666',
        }}
      >
        <Drawer.Screen
          name='Pokédex'
          component={PokedexScreen}
          options={{
            title: 'PokéVerse - Pokédex',
          }}
        />
        <Drawer.Screen
          name='Trading Cards'
          component={TradingCardsScreen}
          options={{
            title: 'PokéVerse - Trading Cards',
          }}
        />
        <Drawer.Screen
          name='Team Builder'
          component={TeamBuilderScreen}
          options={{
            title: 'PokéVerse - Team Builder',
          }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsButton: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  header: {
    backgroundColor: '#f44336',
    padding: 15,
  },
  headerText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  drawerContainer: {
    flex: 1,
  },
  drawerContent: {
    flex: 1,
  },
  drawerContentContainer: {
    flexGrow: 1,
  },
  userInfoSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#f8f9fa',
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  logoutSection: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingBottom: 20,
  },
  logoutLabel: {
    color: '#f44336',
    fontWeight: '600',
  },
});
