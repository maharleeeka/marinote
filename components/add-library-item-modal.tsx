import { LibraryItem } from '@/hooks/use-library';
import { useThemeColor } from '@/hooks/use-theme-color';
import { openBrowserAsync, WebBrowserPresentationStyle } from 'expo-web-browser';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Modal, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

interface AddLibraryItemModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (title: string, description: string, readLink?: string) => Promise<void>;
  item?: LibraryItem | null;
}

export function AddLibraryItemModal({ visible, onClose, onSave, item }: AddLibraryItemModalProps) {
  const [title, setTitle] = useState(item?.title || '');
  const [description, setDescription] = useState(item?.description || '');
  const [readLink, setReadLink] = useState(item?.readLink || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      setTitle(item?.title || '');
      setDescription(item?.description || '');
      setReadLink(item?.readLink || '');
    }
  }, [item, visible]);

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const cardBackground = useThemeColor({}, 'cardBackground') || backgroundColor;

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Title is required');
      return;
    }

    setLoading(true);
    try {
      await onSave(title.trim(), description.trim(), readLink.trim() || undefined);
      setTitle('');
      setDescription('');
      setReadLink('');
      onClose();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save item');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setDescription(item?.description || '');
      setReadLink(item?.readLink || '');
      setTitle(item?.title || '');
      onClose();
    }
  };

  const handleOpenLink = async () => {
    const link = readLink.trim() || item?.readLink;
    if (!link) {
      Alert.alert('Error', 'No read link available');
      return;
    }

    try {
      await openBrowserAsync(link, {
        presentationStyle: WebBrowserPresentationStyle.AUTOMATIC,
      });
    } catch (error) {
      console.error('Error opening URL:', error);
      Alert.alert('Error', 'Failed to open link');
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <ThemedView style={[styles.overlay, { backgroundColor: backgroundColor + 'E6' }]}>
        <ThemedView style={[styles.modal, { backgroundColor: cardBackground || backgroundColor }]}>
          <ThemedText type="title" style={styles.title}>
            {item ? 'Edit Item' : 'Add Item'}
          </ThemedText>

          <ThemedText style={[styles.label, { color: textColor }]}>Title *</ThemedText>
          <TextInput
            style={[styles.input, { color: textColor, borderColor: textColor + '40', backgroundColor: backgroundColor }]}
            placeholder="Enter title"
            placeholderTextColor={textColor + '80'}
            value={title}
            onChangeText={setTitle}
            editable={!loading}
          />

          <ThemedText style={[styles.label, { color: textColor }]}>Description</ThemedText>
          <TextInput
            style={[
              styles.input,
              styles.textArea,
              { color: textColor, borderColor: textColor + '40', backgroundColor: backgroundColor }
            ]}
            placeholder="Enter description"
            placeholderTextColor={textColor + '80'}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            editable={!loading}
          />

          <ThemedView style={styles.labelRow}>
            <ThemedText style={[styles.label, { color: textColor }]}>Read Link</ThemedText>
            {(readLink.trim() || item?.readLink) && (
              <TouchableOpacity onPress={handleOpenLink} disabled={loading}>
                <ThemedText style={[styles.linkButton, { color: tintColor }]}>Read Now</ThemedText>
              </TouchableOpacity>
            )}
          </ThemedView>
          <TextInput
            style={[styles.input, { color: textColor, borderColor: textColor + '40', backgroundColor: backgroundColor }]}
            placeholder="https://example.com"
            placeholderTextColor={textColor + '80'}
            value={readLink}
            onChangeText={setReadLink}
            keyboardType="url"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
          />

          <ThemedView style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton, { borderColor: textColor + '40' }]}
              onPress={handleClose}
              disabled={loading}
            >
              <ThemedText style={[styles.buttonText, { color: textColor }]}>Cancel</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.saveButton, { backgroundColor: tintColor }]}
              onPress={handleSave}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <ThemedText style={styles.saveButtonText}>Save</ThemedText>
              )}
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    marginBottom: 24,
    textAlign: 'center',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 16,
    backgroundColor: 'transparent'
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  linkButton: {
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 44,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  button: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1,
  },
  saveButton: {
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

