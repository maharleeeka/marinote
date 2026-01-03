import { Alert, StyleSheet } from 'react-native';

import { Header } from '@/components/header';
import { HelloWave } from '@/components/hello-wave';
import { ThemedSafeAreaView } from '@/components/themed-safe-area-view';
import { ThemedScrollView } from '@/components/themed-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function HomeScreen() {
 

  const handleAddPress = () => {
    // TODO: Implement add functionality
    Alert.alert('Add', 'Add button pressed');
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedSafeAreaView edges={['top']} style={styles.safeArea}>
        <Header onAddPress={handleAddPress} />
      </ThemedSafeAreaView>
      <ThemedScrollView contentPadding={16}>
        <ThemedView style={styles.headerContainer}>
          <ThemedView style={styles.titleContainer}>
            <ThemedText type="title">Welcome!</ThemedText>
            <HelloWave />
          </ThemedView>
        </ThemedView>
      </ThemedScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    zIndex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
});
