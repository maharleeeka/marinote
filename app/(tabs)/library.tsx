import { useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, FlatList, StyleSheet } from 'react-native';

import { AddLibraryItemModal } from '@/components/add-library-item-modal';
import { Header } from '@/components/header';
import { LibraryItemComponent } from '@/components/library-item';
import { LibraryItemActionsModal } from '@/components/library-item-actions-modal';
import { ThemedSafeAreaView } from '@/components/themed-safe-area-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { LibraryItem, useLibrary } from '@/hooks/use-library';

export default function TabThreeScreen() {
  const { items, loading, addItem, updateItem, deleteItem } = useLibrary();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [actionsModalVisible, setActionsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null);

  const screenWidth = Dimensions.get('window').width;
  const itemWidth = 110;
  const itemMargin = 8;
  const containerPadding = 16;
  const numColumns = Math.floor((screenWidth - containerPadding) / (itemWidth + itemMargin));

  const handleAddPress = () => {
    setSelectedItem(null);
    setEditModalVisible(true);
  };

  const handleItemPress = (item: LibraryItem) => {
    setSelectedItem(item);
    setActionsModalVisible(true);
  };

  const handleSave = async (title: string, description: string, readLink?: string, storyImageUrl?: string) => {
    if (selectedItem) {
      await updateItem(selectedItem.id, title, description, readLink, storyImageUrl);
    } else {
      await addItem(title, description, readLink, storyImageUrl);
    }
    setSelectedItem(null);
  };

  const handleDelete = () => {
    if (!selectedItem) return;

    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteItem(selectedItem.id);
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete item');
            }
          },
        },
      ]
    );
  };

  const handleDetails = () => {
    setActionsModalVisible(false);
    setEditModalVisible(true);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedSafeAreaView edges={['top']} style={styles.safeArea}>
        <Header title="Library" onAddPress={handleAddPress} />
      </ThemedSafeAreaView>
      {loading ? (
        <ThemedView style={styles.centerContainer}>
          <ActivityIndicator size="large" />
        </ThemedView>
      ) : items.length === 0 ? (
        <ThemedView style={styles.centerContainer}>
          <ThemedText style={styles.emptyText}>No items in your library yet</ThemedText>
          <ThemedText style={styles.emptySubtext}>Tap the + button to add your first item</ThemedText>
        </ThemedView>
      ) : (
        <FlatList
          data={items}
          renderItem={({item}) =>
            <LibraryItemComponent
              item={item}
              onPress={() => handleItemPress(item)}
            />
          }
          keyExtractor={item => item.id}
          numColumns={numColumns}
          contentContainerStyle={styles.scrollContent}
          columnWrapperStyle={numColumns > 1 ? styles.row : undefined}
          initialNumToRender={10}
          showsVerticalScrollIndicator={false}
          style={styles.list}
        />
      )}
      <LibraryItemActionsModal
        visible={actionsModalVisible}
        item={selectedItem}
        onClose={() => {
          setActionsModalVisible(false);
        }}
        onDelete={handleDelete}
        onDetails={handleDetails}
      />
      <AddLibraryItemModal
        visible={editModalVisible}
        onClose={() => {
          setEditModalVisible(false);
          setSelectedItem(null);
        }}
        onSave={handleSave}
        item={selectedItem}
      />
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
  list: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    flexGrow: 1,
  },
  row: {
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
  },
});
