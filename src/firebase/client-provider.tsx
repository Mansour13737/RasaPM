'use client';
import { initializeFirebase } from './index';
import { FirebaseProvider } from './provider';
import { useMemo } from 'react';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { app, auth, firestore } = useMemo(() => initializeFirebase(), []);
  return (
    <FirebaseProvider app={app} auth={auth} firestore={firestore}>
      <FirebaseErrorListener />
      {children}
    </FirebaseProvider>
  );
}
