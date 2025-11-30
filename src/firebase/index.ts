import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

export function initializeFirebase() {
  const apps = getApps();
  if (apps.length) {
    const app = apps[0];
    return {
      app,
      auth: getAuth(app),
      firestore: getFirestore(app),
    };
  }

  const app = initializeApp(firebaseConfig);
  return {
    app,
    auth: getAuth(app),
    firestore: getFirestore(app),
  };
}

export { FirebaseProvider, useFirebaseApp, useAuth, useFirestore, useUser } from './provider';
