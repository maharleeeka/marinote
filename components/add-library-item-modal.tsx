import { useAuth } from '@/contexts/AuthContext';
import { LibraryItem } from '@/hooks/use-library';
import { useThemeColor } from '@/hooks/use-theme-color';
import { uploadImageToFirebase } from '@/utils/imageUpload';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { openBrowserAsync, WebBrowserPresentationStyle } from 'expo-web-browser';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Modal, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

interface AddLibraryItemModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (title: string, description: string, readLink?: string, storyImageUrl?: string) => Promise<void>;
  item?: LibraryItem | null;
}

export function AddLibraryItemModal({ visible, onClose, onSave, item }: AddLibraryItemModalProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState(item?.title || '');
  const [description, setDescription] = useState(item?.description || '');
  const [readLink, setReadLink] = useState(item?.readLink || '');
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(item?.storyImageUrl || null);
  const [localImageUri, setLocalImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (visible) {
      setTitle(item?.title || '');
      setDescription(item?.description || '');
      setReadLink(item?.readLink || '');
      setSelectedImageUri(item?.storyImageUrl || null);
      setLocalImageUri(null);
    }
  }, [item, visible]);

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const cardBackground = useThemeColor({}, 'cardBackground') || backgroundColor;

  const handlePickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant permission to access your photos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setLocalImageUri(result.assets[0].uri);
        setSelectedImageUri(null); // Clear existing URL if picking new image
      }
    } catch (error: any) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleRemoveImage = () => {
    setLocalImageUri(null);
    setSelectedImageUri(null);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Title is required');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'User must be logged in');
      return;
    }

    setLoading(true);
    try {
      let imageUrl = selectedImageUri || undefined;

      if (localImageUri) {
        setUploadingImage(true);
        try {
          imageUrl = await uploadImageToFirebase(localImageUri, user.uid);
        } catch (error: any) {
          Alert.alert('Error', 'Failed to upload image. ' + (error.message || ''));
          setUploadingImage(false);
          setLoading(false);
          return;
        } finally {
          setUploadingImage(false);
        }
      }

      await onSave(title.trim(), description.trim(), readLink.trim() || undefined, imageUrl);
      setTitle('');
      setDescription('');
      setReadLink('');
      setSelectedImageUri(null);
      setLocalImageUri(null);
      onClose();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save item');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading && !uploadingImage) {
      setDescription(item?.description || '');
      setReadLink(item?.readLink || '');
      setTitle(item?.title || '');
      setSelectedImageUri(item?.storyImageUrl || null);
      setLocalImageUri(null);
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

          <ThemedText style={[styles.label, { color: textColor, marginTop: 16 }]}>Story Image</ThemedText>
          {(localImageUri || selectedImageUri) ? (
            <ThemedView style={styles.imageContainer}>
              <Image
                source={{ uri: localImageUri || selectedImageUri || '' }}
                style={styles.previewImage}
                contentFit="cover"
              />
              <TouchableOpacity
                style={[styles.removeImageButton, { backgroundColor: tintColor }]}
                onPress={handleRemoveImage}
                disabled={loading || uploadingImage}
              >
                <ThemedText style={styles.removeImageText}>Remove</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          ) : (
            <TouchableOpacity
              style={[styles.imagePickerButton, { borderColor: textColor + '40', backgroundColor: backgroundColor }]}
              onPress={handlePickImage}
              disabled={loading || uploadingImage}
            >
              <ThemedText style={[styles.imagePickerText, { color: textColor }]}>
                {uploadingImage ? 'Uploading...' : 'Pick Image'}
              </ThemedText>
            </TouchableOpacity>
          )}

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
              disabled={loading || uploadingImage}
            >
              {(loading || uploadingImage) ? (
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
  imagePickerButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  imagePickerText: {
    fontSize: 16,
    fontWeight: '600',
  },
  imageContainer: {
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  removeImageText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

