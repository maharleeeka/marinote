import { storage } from '@/config/firebaseConfig';
import * as FileSystem from 'expo-file-system';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

/**
 * Uploads an image to Firebase Storage and returns the download URL
 * @param uri - Local file URI of the image
 * @param userId - User ID to organize storage by user
 * @param fileName - Optional custom file name, defaults to timestamp-based name
 * @returns Promise<string> - Download URL of the uploaded image
 */

export async function uploadImageToFirebase(
  uri: string,
  userId: string,
  fileName?: string
): Promise<string> {
  try {
    let blob: Blob;
    
    try {
      const response = await fetch(uri);
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.status}`);
      }
      blob = await response.blob();
    } catch (fetchError) {
      console.log('Using FileSystem to read file');
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: 'base64' as any,
      });
      
      const binaryString = (() => {
        if (typeof atob !== 'undefined') {
          return atob(base64);
        }
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        let output = '';
        let i = 0;
        const cleanBase64 = base64.replace(/[^A-Za-z0-9\+\/]/g, '');
        while (i < cleanBase64.length) {
          const encoded1 = chars.indexOf(cleanBase64.charAt(i++));
          const encoded2 = chars.indexOf(cleanBase64.charAt(i++));
          const encoded3 = chars.indexOf(cleanBase64.charAt(i++));
          const encoded4 = chars.indexOf(cleanBase64.charAt(i++));
          const bitmap = (encoded1 << 18) | (encoded2 << 12) | (encoded3 << 6) | encoded4;
          output += String.fromCharCode((bitmap >> 16) & 255);
          if (encoded3 !== 64) output += String.fromCharCode((bitmap >> 8) & 255);
          if (encoded4 !== 64) output += String.fromCharCode(bitmap & 255);
        }
        return output;
      })();
      
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      const extension = uri.split('.').pop()?.toLowerCase() || 'jpg';
      const contentTypeMap: { [key: string]: string } = {
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'png': 'image/png',
        'gif': 'image/gif',
        'webp': 'image/webp',
      };
      const contentType = contentTypeMap[extension] || 'image/jpeg';
      
      blob = new Blob([bytes], { type: contentType });
      
      if (!blob || blob.size === 0) {
        throw new Error('Failed to create blob from image file. The file may be corrupted or inaccessible.');
      }
    }

    if (!blob || blob.size === 0) {
      throw new Error('Invalid blob: size is 0. The image file may be empty or corrupted.');
    }
    
    if (blob.size > 5 * 1024 * 1024) {
      throw new Error('Image file is too large. Maximum size is 5MB.');
    }

    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = uri.split('.').pop() || 'jpg';
    const finalFileName = fileName || `library_${timestamp}_${randomString}.${fileExtension}`;
    const storageRef = ref(storage, `users/${userId}/library/${finalFileName}`);

    await uploadBytes(storageRef, blob);

    const downloadURL = await getDownloadURL(storageRef);

    return downloadURL;
  } catch (error: any) {
    
    throw new Error('Failed to upload image');
  }
}

