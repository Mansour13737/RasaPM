'use client';
import { useState, useEffect } from 'react';
import {
  doc,
  onSnapshot,
  type DocumentReference,
  type DocumentData,
  type FirestoreError,
} from 'firebase/firestore';
import { useFirestore } from '../provider';

export type DocData<T> = {
  data: T | null;
  loading: boolean;
  error: FirestoreError | null;
};

export function useDoc<T>(
  ref: DocumentReference<DocumentData> | null
): DocData<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  useEffect(() => {
    if (!ref) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = onSnapshot(
      ref,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = { ...snapshot.data(), id: snapshot.id } as T;
          setData(data);
        } else {
          setData(null);
        }
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching document:', err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [ref ? ref.path : '']);

  return { data, loading, error };
}
