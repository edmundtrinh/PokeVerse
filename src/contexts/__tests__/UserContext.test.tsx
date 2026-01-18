// src/contexts/__tests__/UserContext.test.tsx
import React from 'react';
import { render, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProvider, useUser, SavedBinder } from '../UserContext';
import { Text, TouchableOpacity } from 'react-native';

// Test component that uses the context
const TestComponent = () => {
  const {
    user,
    isAuthenticated,
    login,
    logout,
    saveBinder,
    deleteBinder,
    toggleFavorite,
    isPokemonFavorite,
    isPokemonCaught,
  } = useUser();

  return (
    <>
      <Text testID="auth-status">{isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</Text>
      <Text testID="user-name">{user?.displayName || 'No User'}</Text>
      <Text testID="favorites-count">{user?.favorites.length || 0}</Text>
      <Text testID="binders-count">{user?.savedBinders.length || 0}</Text>
      <TouchableOpacity
        testID="login-button"
        onPress={() =>
          login('guest', {
            displayName: 'Test Trainer',
            email: 'test@example.com',
          })
        }
      >
        <Text>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity testID="logout-button" onPress={logout}>
        <Text>Logout</Text>
      </TouchableOpacity>
      <TouchableOpacity
        testID="toggle-favorite"
        onPress={() => toggleFavorite('pikachu')}
      >
        <Text>Toggle Pikachu Favorite</Text>
      </TouchableOpacity>
      <Text testID="pikachu-favorite">{isPokemonFavorite('pikachu') ? 'Yes' : 'No'}</Text>
      <Text testID="pikachu-caught">{isPokemonCaught('pikachu') ? 'Yes' : 'No'}</Text>
    </>
  );
};

describe('UserContext', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  describe('Authentication', () => {
    it('should start unauthenticated', () => {
      const { getByTestId } = render(
        <UserProvider>
          <TestComponent />
        </UserProvider>
      );

      expect(getByTestId('auth-status').children[0]).toBe('Not Authenticated');
      expect(getByTestId('user-name').children[0]).toBe('No User');
    });

    it('should login user successfully', async () => {
      const { getByTestId } = render(
        <UserProvider>
          <TestComponent />
        </UserProvider>
      );

      await act(async () => {
        getByTestId('login-button').props.onPress();
      });

      expect(getByTestId('auth-status').children[0]).toBe('Authenticated');
      expect(getByTestId('user-name').children[0]).toBe('Test Trainer');
    });

    it('should logout user successfully', async () => {
      const { getByTestId } = render(
        <UserProvider>
          <TestComponent />
        </UserProvider>
      );

      // Login first
      await act(async () => {
        getByTestId('login-button').props.onPress();
      });

      // Then logout
      await act(async () => {
        getByTestId('logout-button').props.onPress();
      });

      expect(getByTestId('auth-status').children[0]).toBe('Not Authenticated');
      expect(getByTestId('user-name').children[0]).toBe('No User');
    });

    it('should persist user data across sessions', async () => {
      // First render and login
      const { getByTestId, unmount } = render(
        <UserProvider>
          <TestComponent />
        </UserProvider>
      );

      await act(async () => {
        getByTestId('login-button').props.onPress();
      });

      unmount();

      // Second render should restore user
      const { getByTestId: getByTestId2 } = render(
        <UserProvider>
          <TestComponent />
        </UserProvider>
      );

      // Wait for data to load
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      expect(getByTestId2('auth-status').children[0]).toBe('Authenticated');
      expect(getByTestId2('user-name').children[0]).toBe('Test Trainer');
    });
  });

  describe('Favorites Management', () => {
    it('should toggle Pokemon favorites', async () => {
      const { getByTestId } = render(
        <UserProvider>
          <TestComponent />
        </UserProvider>
      );

      // Login first
      await act(async () => {
        getByTestId('login-button').props.onPress();
      });

      // Initially not favorite
      expect(getByTestId('pikachu-favorite').children[0]).toBe('No');

      // Toggle favorite
      await act(async () => {
        getByTestId('toggle-favorite').props.onPress();
      });

      expect(getByTestId('pikachu-favorite').children[0]).toBe('Yes');
      expect(getByTestId('favorites-count').children[0]).toBe('1');

      // Toggle again to remove
      await act(async () => {
        getByTestId('toggle-favorite').props.onPress();
      });

      expect(getByTestId('pikachu-favorite').children[0]).toBe('No');
      expect(getByTestId('favorites-count').children[0]).toBe('0');
    });
  });

  describe('Binder Management', () => {
    it('should save binder successfully', async () => {
      const TestBinderComponent = () => {
        const { user, saveBinder, login } = useUser();

        const testBinder: SavedBinder = {
          id: 'test-binder-1',
          name: 'Test Binder',
          color: 'red',
          tags: ['test'],
          gridSize: '3x3',
          cards: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        return (
          <>
            <Text testID="binders-count">{user?.savedBinders.length || 0}</Text>
            <TouchableOpacity
              testID="login-button"
              onPress={() => login('guest', { displayName: 'Test User' })}
            >
              <Text>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              testID="save-binder"
              onPress={() => saveBinder(testBinder)}
            >
              <Text>Save Binder</Text>
            </TouchableOpacity>
          </>
        );
      };

      const { getByTestId } = render(
        <UserProvider>
          <TestBinderComponent />
        </UserProvider>
      );

      // Login first
      await act(async () => {
        getByTestId('login-button').props.onPress();
      });

      // Save binder
      await act(async () => {
        getByTestId('save-binder').props.onPress();
      });

      expect(getByTestId('binders-count').children[0]).toBe('1');
    });

    it('should delete binder successfully', async () => {
      const TestBinderDeleteComponent = () => {
        const { user, saveBinder, deleteBinder, login } = useUser();

        const testBinder: SavedBinder = {
          id: 'test-binder-delete',
          name: 'Delete Test Binder',
          color: 'blue',
          tags: [],
          gridSize: '3x3',
          cards: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        return (
          <>
            <Text testID="binders-count">{user?.savedBinders.length || 0}</Text>
            <TouchableOpacity
              testID="login-button"
              onPress={() => login('guest', { displayName: 'Test User' })}
            >
              <Text>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              testID="save-binder"
              onPress={() => saveBinder(testBinder)}
            >
              <Text>Save Binder</Text>
            </TouchableOpacity>
            <TouchableOpacity
              testID="delete-binder"
              onPress={() => deleteBinder('test-binder-delete')}
            >
              <Text>Delete Binder</Text>
            </TouchableOpacity>
          </>
        );
      };

      const { getByTestId } = render(
        <UserProvider>
          <TestBinderDeleteComponent />
        </UserProvider>
      );

      // Login, save, then delete
      await act(async () => {
        getByTestId('login-button').props.onPress();
      });

      await act(async () => {
        getByTestId('save-binder').props.onPress();
      });

      expect(getByTestId('binders-count').children[0]).toBe('1');

      await act(async () => {
        getByTestId('delete-binder').props.onPress();
      });

      expect(getByTestId('binders-count').children[0]).toBe('0');
    });
  });

  describe('Error Handling', () => {
    it('should handle AsyncStorage errors gracefully', async () => {
      // Mock AsyncStorage to throw an error
      (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(
        new Error('Storage error')
      );

      // Should not crash when storage fails
      expect(() => {
        render(
          <UserProvider>
            <TestComponent />
          </UserProvider>
        );
      }).not.toThrow();
    });

    it('should handle save errors gracefully', async () => {
      // Mock AsyncStorage to throw an error on save
      (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(
        new Error('Save error')
      );

      const { getByTestId } = render(
        <UserProvider>
          <TestComponent />
        </UserProvider>
      );

      // Should not crash when save fails
      await act(async () => {
        expect(() => {
          getByTestId('login-button').props.onPress();
        }).not.toThrow();
      });
    });
  });

  describe('Context Error', () => {
    it('should throw error when used outside provider', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<TestComponent />);
      }).toThrow('useUser must be used within a UserProvider');

      consoleSpy.mockRestore();
    });
  });
});