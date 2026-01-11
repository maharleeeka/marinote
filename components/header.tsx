import { Image } from 'expo-image';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';

interface HeaderProps {
  onAddPress?: () => void;
  title?: string;
}

export function Header({ onAddPress, title }: HeaderProps) {
  const tintColor = useThemeColor({}, 'tint');

  return (
    <ThemedView style={styles.container}>
      {title ? (
        <ThemedText type="title" style={styles.title}>
          {title}
        </ThemedText>
      ) : (
        <Image
          source={require('@/assets/images/marinote-logo.png')}
          style={styles.logo}
          contentFit="contain"
        />
      )}
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  center: {
    flex: 1,
  },
  addButton: {
    padding: 4,
  },
});



