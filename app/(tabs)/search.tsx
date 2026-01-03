import { StyleSheet } from 'react-native';

import { ThemedSafeAreaView } from '@/components/themed-safe-area-view';
import { ThemedScrollView } from '@/components/themed-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Fonts } from '@/constants/theme';

export default function TabTwoScreen() {
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
                    Search
                  </ThemedText>
                </ThemedView>
              </ThemedScrollView>
            </ThemedSafeAreaView>
          </ThemedView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },

  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
});
