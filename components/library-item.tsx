import { LibraryItem } from '@/hooks/use-library';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Image } from 'expo-image';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

interface LibraryItemProps {
  item: LibraryItem;
  onPress?: () => void;
}

export function LibraryItemComponent({ item, onPress }: LibraryItemProps) {
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'text');

  return (
    <TouchableOpacity
      style={[styles.container, { borderColor: borderColor + '30' }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Image
        source={item.storyImageUrl ? { uri: item.storyImageUrl } : require('@/assets/images/default.png')}
        style={styles.thumbnail}
        contentFit="cover"
      />
      <ThemedView style={styles.content}>
        <ThemedText type="defaultSemiBold" style={[styles.title, { color: textColor }]} numberOfLines={2}>
          {item.title}
        </ThemedText>
      </ThemedView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    width: 110,
    aspectRatio: 0.5,
    margin: 4,
  },
  thumbnail: {
    width: '100%',
    aspectRatio: 0.7,
  },
  content: {
    padding: 12,
    justifyContent: 'center',
    minHeight: 50,
  },
  title: {
    fontSize: 14,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  deleteText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

