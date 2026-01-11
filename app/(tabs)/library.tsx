import { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet } from 'react-native';

import { AddLibraryItemModal } from '@/components/add-library-item-modal';
import { Header } from '@/components/header';
import { LibraryItemComponent } from '@/components/library-item';
import { LibraryItemActionsModal } from '@/components/library-item-actions-modal';
import { ThemedSafeAreaView } from '@/components/themed-safe-area-view';
import { ThemedScrollView } from '@/components/themed-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { LibraryItem, useLibrary } from '@/hooks/use-library';

export default function TabThreeScreen() {
  const { items, loading, addItem, updateItem, deleteItem } = useLibrary();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [actionsModalVisible, setActionsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null);

  const handleAddPress = () => {
    setSelectedItem(null);
    setEditModalVisible(true);
  };

  const handleItemPress = (item: LibraryItem) => {
    setSelectedItem(item);
    setActionsModalVisible(true);
  };

  const handleSave = async (title: string, description: string, readLink?: string) => {
    if (selectedItem) {
      await updateItem(selectedItem.id, title, description, readLink);
    } else {
      await addItem(title, description, readLink);
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
      <ThemedScrollView contentContainerStyle={styles.scrollContent}>
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
          <ThemedView style={styles.gridItemsContainer}>
              {items.map((item) => (
                <LibraryItemComponent
                  key={item.id}
                  item={item}
                  onPress={() => handleItemPress(item)}
                />
              ))}
            </ThemedView>
        )}
      </ThemedScrollView>
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
  scrollContent: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  gridItemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    padding: 8,
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
