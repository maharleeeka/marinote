import { Alert, StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedSafeAreaView } from '@/components/themed-safe-area-view';
import { ThemedScrollView } from '@/components/themed-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Fonts } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function TabFourScreen() {
  const { logout, user } = useAuth();

    const tintColor = useThemeColor({}, 'tint');
  
    const handleLogout = () => {
      Alert.alert(
        'Logout',
        'Are you sure you want to logout?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Logout',
            style: 'destructive',
            onPress: async () => {
              try {
                await logout();
              } catch (error: any) {
                Alert.alert('Error', error.message || 'Failed to logout');
              }
            },
          },
        ]
      );
    };
  return (
    <ThemedView style={styles.container}>
      <ThemedSafeAreaView edges={['top']} style={styles.safeArea}>
        <ThemedScrollView>
          <ThemedView style={styles.titleContainer}>
            <ThemedText
              type="title"
              style={{
                fontFamily: Fonts.rounded,
              }}>
              Profile
            </ThemedText>
          </ThemedView>
          <ThemedView>
            <ThemedText>{user?.email}</ThemedText>
            {user && (
                <TouchableOpacity
                  style={[styles.logoutButton, { backgroundColor: tintColor }]}
                  onPress={handleLogout}
                >
                  <ThemedText style={styles.logoutButtonText}>Logout</ThemedText>
                </TouchableOpacity>
              )}
          </ThemedView>
        </ThemedScrollView>
      </ThemedSafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  logoutButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
  },
});
