'use client';
import { useState, useEffect, useMemo } from 'react';
import {
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  startAt,
  endAt,
  type Query,
  type DocumentData,
  type FirestoreError,
} from 'firebase/firestore';

export type CollectionData<T> = {
  data: T[] | null;
  loading: boolean;
  error: FirestoreError | null;
};

export function useCollection<T>(
  q: Query<DocumentData> | null
): CollectionData<T> {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  useEffect(() => {
    if (!q) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map(
          (doc) => ({ ...doc.data(), id: doc.id } as T)
        );
        setData(data);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching collection:', err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [q ? q.path : '', q ? JSON.stringify(q.toJSON()) : '']);

  return { data, loading, error };
}

export function useMemoFirebase<T>(
  callback: () => T,
  deps: React.DependencyList
) {
  return useMemo(callback, deps);
}
