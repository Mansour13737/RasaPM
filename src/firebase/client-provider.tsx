'use client';
import { initializeFirebase } from './index';
import { FirebaseProvider } from './provider';
import { useEffect, useState } from 'react';

export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [firebase, setFirebase] = useState<any>(null);

  useEffect(() => {
    const app = initializeFirebase();
    setFirebase(app);
  }, []);

  return <FirebaseProvider firebase={firebase}>{children}</FirebaseProvider>;
}
