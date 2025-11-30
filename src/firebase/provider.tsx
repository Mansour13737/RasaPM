'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import type { FirebaseApp } from 'firebase/app';
import type { Auth, User } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

interface FirebaseContextValue {
  app: FirebaseApp | null;
  auth: Auth | null;
  firestore: Firestore | null;
  user: (User & { customClaims?: { [key: string]: any } }) | null;
  loading: boolean;
}

const FirebaseContext = createContext<FirebaseContextValue>({
  app: null,
  auth: null,
  firestore: null,
  user: null,
  loading: true,
});

export const useFirebaseApp = () => useContext(FirebaseContext).app;
export const useAuth = () => useContext(FirebaseContext).auth;
export const useFirestore = () => useContext(FirebaseContext).firestore;
export const useUser = () => {
    const { user, loading, auth } = useContext(FirebaseContext);
    return { user, loading, auth };
};

export function FirebaseProvider({
  firebase,
  children,
}: {
  firebase: { app: FirebaseApp; auth: Auth; firestore: Firestore } | null;
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<(User & { customClaims?: { [key: string]: any } }) | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (firebase?.auth) {
      const unsubscribe = onAuthStateChanged(firebase.auth, async (authUser) => {
        if (authUser) {
          const tokenResult = await authUser.getIdTokenResult();
          setUser({ ...authUser, customClaims: tokenResult.claims });
        } else {
          setUser(null);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, [firebase]);

  const value = {
    app: firebase?.app || null,
    auth: firebase?.auth || null,
    firestore: firebase?.firestore || null,
    user,
    loading,
  };

  return (
    <FirebaseContext.Provider value={value}>
      <FirebaseErrorListener />
      {children}
    </FirebaseContext.Provider>
  );
}
