import { Image } from 'expo-image';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';

interface HeaderProps {
  onAddPress?: () => void;
}

export function Header({ onAddPress }: HeaderProps) {
  const tintColor = useThemeColor({}, 'tint');

  return (
    <ThemedView style={styles.container}>
      <Image
        source={require('@/assets/images/marinote-logo.png')}
        style={styles.logo}
        contentFit="contain"
      />
      <ThemedView style={styles.center} />
      <TouchableOpacity
        style={styles.addButton}
        onPress={onAddPress}
        activeOpacity={0.7}
      >
        <IconSymbol name="plus.circle.fill" size={28} color={tintColor} />
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    height: 56,
  },
  logo: {
    width: 50,
    height: 50,
  },
  center: {
    flex: 1,
  },
  addButton: {
    padding: 4,
  },
});



