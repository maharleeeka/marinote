import { LibraryItem } from '@/hooks/use-library';
import { useThemeColor } from '@/hooks/use-theme-color';
import { openBrowserAsync, WebBrowserPresentationStyle } from 'expo-web-browser';
import { Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { IconSymbol } from './ui/icon-symbol';

interface LibraryItemActionsModalProps {
  visible: boolean;
  item: LibraryItem | null;
  onClose: () => void;
  onDelete: () => void;
  onDetails: () => void;
}

export function LibraryItemActionsModal({
  visible,
  item,
  onClose,
  onDelete,
  onDetails,
}: LibraryItemActionsModalProps) {
  const backgroundColor = useThemeColor({}, 'background');
  const cardBackground = useThemeColor({}, 'cardBackground');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');

  const handleRead = async () => {
    if (item?.readLink) {
      try {
        await openBrowserAsync(item.readLink, {
          presentationStyle: WebBrowserPresentationStyle.AUTOMATIC,
        });
        onClose();
      } catch (error) {
        console.error('Error opening URL:', error);
      }
    }
  };

  const handleDelete = () => {
    onDelete();
    onClose();
  };

  const handleDetails = () => {
    onDetails();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <ThemedView
          style={[styles.modal, { backgroundColor: cardBackground || backgroundColor }]}
          onStartShouldSetResponder={() => true}
        >
          <ThemedView style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.deleteButton]}
              onPress={handleDelete}
            >
              <IconSymbol name="trash.fill" size={24} color={textColor} />
              <ThemedText style={[styles.buttonText, { color: textColor }]}>Delete</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.detailsButton]}
              onPress={handleDetails}
            >
              <ThemedText style={[styles.buttonText, { color: textColor }]}>Details</ThemedText>
            </TouchableOpacity>

            {item?.readLink && (
              <TouchableOpacity
                style={[styles.button, styles.readButton, { backgroundColor: tintColor }]}
                onPress={handleRead}
              >
                <ThemedText style={[styles.buttonText, styles.readButtonText]}>Read</ThemedText>
              </TouchableOpacity>
            )}
          </ThemedView>
        </ThemedView>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modal: {
    width: '100%',
    maxWidth: 300,
    borderRadius: 16,
    padding: 24,
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  deleteButton: {
    borderColor: 'rgba(255, 59, 48, 0.3)',
  },
  detailsButton: {
    borderColor: 'rgba(128, 128, 128, 0.3)',
  },
  readButton: {
    borderWidth: 0,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  readButtonText: {
    color: '#fff',
  },
});

