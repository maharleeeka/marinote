import { app } from '@/config/firebaseConfig';
import { useAuth } from '@/contexts/AuthContext';
import { addDoc, collection, deleteDoc, doc, getFirestore, onSnapshot, orderBy, query, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';

const db = getFirestore(app);

export interface LibraryItem {
  id: string;
  title: string;
  description: string;
  readLink?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export function useLibrary() {
  const { user } = useAuth();
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const libraryRef = collection(db, 'users', user.uid, 'library');
    const q = query(libraryRef, orderBy('title', 'asc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const libraryItems: LibraryItem[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          const createdAt = data.createdAt as Timestamp | undefined;
          const updatedAt = data.updatedAt as Timestamp | undefined;

          libraryItems.push({
            id: doc.id,
            title: data.title || '',
            description: data.description || '',
            readLink: data.readLink || '',
            createdAt: createdAt?.toDate(),
            updatedAt: updatedAt?.toDate(),
          });
        });
        setItems(libraryItems);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching library items:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const addItem = async (title: string, description: string, readLink?: string) => {
    if (!user) {
      throw new Error('User must be logged in');
    }

    try {
      const libraryRef = collection(db, 'users', user.uid, 'library');
      const now = serverTimestamp();
      await addDoc(libraryRef, {
        title,
        description,
        readLink: readLink || '',
        createdAt: now,
        updatedAt: now,
      });
    } catch (err: any) {
      console.error('Error adding library item:', err);
      throw new Error(err.message || 'Failed to add library item');
    }
  };

  const updateItem = async (id: string, title: string, description: string, readLink?: string) => {
    if (!user) {
      throw new Error('User must be logged in');
    }

    try {
      const itemRef = doc(db, 'users', user.uid, 'library', id);
      await updateDoc(itemRef, {
        title,
        description,
        readLink: readLink || '',
        updatedAt: serverTimestamp(),
      });
    } catch (err: any) {
      console.error('Error updating library item:', err);
      throw new Error(err.message || 'Failed to update library item');
    }
  };

  const deleteItem = async (id: string) => {
    if (!user) {
      throw new Error('User must be logged in');
    }

    try {
      const itemRef = doc(db, 'users', user.uid, 'library', id);
      await deleteDoc(itemRef);
    } catch (err: any) {
      console.error('Error deleting library item:', err);
      throw new Error(err.message || 'Failed to delete library item');
    }
  };

  return {
    items,
    loading,
    error,
    addItem,
    updateItem,
    deleteItem,
  };
}

