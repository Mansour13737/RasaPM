'use client';

import { getFirestore, collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where, writeBatch } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import type { User, Site, WeeklyPM, ChangeRequest, Task, UserRole } from './types';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export async function getUsers(): Promise<User[]> {
  const db = getFirestore();
  const usersCol = collection(db, 'users');
  try {
    const userSnapshot = await getDocs(usersCol);
    return userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
  } catch (serverError: any) {
    const permissionError = new FirestorePermissionError({
      path: usersCol.path,
      operation: 'list',
    });
    errorEmitter.emit('permission-error', permissionError);
    throw permissionError;
  }
}

export async function getUser(id: string): Promise<User | null> {
    const db = getFirestore();
    const userRef = doc(db, 'users', id);
    try {
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            return { id: userSnap.id, ...userSnap.data() } as User;
        }
        return null;
    } catch (serverError: any) {
        const permissionError = new FirestorePermissionError({
            path: userRef.path,
            operation: 'get',
        });
        errorEmitter.emit('permission-error', permissionError);
        throw permissionError;
    }
}

export function addUser(userData: Omit<User, 'id' | 'avatarUrl'> & { password?: string }) {
  const functions = getFunctions();
  const createUser = httpsCallable(functions, 'createUser');
  
  createUser(userData).catch(async (serverError) => {
    console.error("Cloud function 'createUser' failed:", serverError);
    const permissionError = new FirestorePermissionError({
      path: 'users',
      operation: 'create',
      requestResourceData: userData,
      // You might need a more specific error message or handling here
      // as this is a function call, not a direct Firestore write.
    });
    errorEmitter.emit('permission-error', permissionError);
  });
}

export function updateUser(id: string, data: Partial<Omit<User, 'id' | 'email'>>) {
  const db = getFirestore();
  const userRef = doc(db, 'users', id);
  
  updateDoc(userRef, data).catch(async (serverError) => {
    const permissionError = new FirestorePermissionError({
      path: userRef.path,
      operation: 'update',
      requestResourceData: data,
    });
    errorEmitter.emit('permission-error', permissionError);
  });
}


export function deleteUser(id: string) {
  const functions = getFunctions();
  const deleteUserFunc = httpsCallable(functions, 'deleteUser');
  deleteUserFunc({ uid: id }).catch(async (serverError) => {
    console.error("Cloud function 'deleteUser' failed:", serverError);
    const permissionError = new FirestorePermissionError({
        path: `users/${id}`,
        operation: 'delete',
    });
    errorEmitter.emit('permission-error', permissionError);
  });
}

export async function getSites(): Promise<Site[]> {
  const db = getFirestore();
  const sitesCol = collection(db, 'sites');
  try {
    const siteSnapshot = await getDocs(sitesCol);
    return siteSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Site));
  } catch (serverError: any) {
    const permissionError = new FirestorePermissionError({
        path: sitesCol.path,
        operation: 'list',
    });
    errorEmitter.emit('permission-error', permissionError);
    throw permissionError;
  }
}

export async function getSite(id: string): Promise<Site | null> {
    const db = getFirestore();
    const siteRef = doc(db, 'sites', id);
    try {
        const siteSnap = await getDoc(siteRef);
        return siteSnap.exists() ? { id: siteSnap.id, ...siteSnap.data() } as Site : null;
    } catch (serverError: any) {
        const permissionError = new FirestorePermissionError({ path: siteRef.path, operation: 'get' });
        errorEmitter.emit('permission-error', permissionError);
        throw permissionError;
    }
}

export async function getWeeklyPMs(): Promise<WeeklyPM[]> {
    const db = getFirestore();
    const pmsCol = collection(db, 'pms');
    try {
      const pmSnapshot = await getDocs(pmsCol);
      return pmSnapshot.docs.map(d => ({ id: d.id, ...d.data() } as WeeklyPM));
    } catch (serverError: any) {
        const permissionError = new FirestorePermissionError({
            path: pmsCol.path,
            operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
        throw permissionError;
    }
}

export async function getPM(id: string): Promise<WeeklyPM | null> {
    const db = getFirestore();
    const pmRef = doc(db, 'pms', id);
    try {
        const pmSnap = await getDoc(pmRef);
        return pmSnap.exists() ? { id: pmSnap.id, ...pmSnap.data() } as WeeklyPM : null;
    } catch(serverError) {
        const permissionError = new FirestorePermissionError({ path: pmRef.path, operation: 'get' });
        errorEmitter.emit('permission-error', permissionError);
        throw permissionError;
    }
}

export async function getTechnicians(): Promise<User[]> {
    const db = getFirestore();
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("role", "==", "Technician"));
    try {
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
    } catch(serverError) {
        // This will fail if the user doesn't have list access even with a query.
        // The rules need to allow querying based on role.
        // For now, let's try a full list and filter client-side as a fallback,
        // which will trigger the 'list' permission error if rules are strict.
        try {
            const allUsers = await getUsers();
            return allUsers.filter(u => u.role === 'Technician');
        } catch (listError) {
             const permissionError = new FirestorePermissionError({ path: usersRef.path, operation: 'list' });
             errorEmitter.emit('permission-error', permissionError);
             throw permissionError;
        }
    }
}

export async function getPMsForSite(siteId: string): Promise<WeeklyPM[]> {
    const db = getFirestore();
    const pmsRef = collection(db, "pms");
    const q = query(pmsRef, where("siteId", "==", siteId));
    try {
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WeeklyPM));
    } catch(e) {
        const permissionError = new FirestorePermissionError({ path: pmsRef.path, operation: 'list' });
        errorEmitter.emit('permission-error', permissionError);
        throw permissionError;
    }
}

export async function getCRsForSite(siteId: string): Promise<ChangeRequest[]> {
     const db = getFirestore();
    const crsRef = collection(db, "changeRequests");
    const q = query(crsRef, where("siteId", "==", siteId));
    try {
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChangeRequest));
    } catch (e) {
        const permissionError = new FirestorePermissionError({ path: crsRef.path, operation: 'list' });
        errorEmitter.emit('permission-error', permissionError);
        throw permissionError;
    }
}

export async function getPMsForTechnician(technicianId: string): Promise<WeeklyPM[]> {
    const db = getFirestore();
    const pmsRef = collection(db, "pms");
    const q = query(pmsRef, where("assignedTechnicianId", "==", technicianId));
    try {
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WeeklyPM));
    } catch(e) {
         const permissionError = new FirestorePermissionError({ path: pmsRef.path, operation: 'list' });
        errorEmitter.emit('permission-error', permissionError);
        throw permissionError;
    }
}


export async function getSitesForTechnician(technicianId: string): Promise<Site[]> {
    const db = getFirestore();
    const sitesRef = collection(db, "sites");
    const q = query(sitesRef, where("technicianId", "==", technicianId));
    try {
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Site));
    } catch(e) {
        const permissionError = new FirestorePermissionError({ path: sitesRef.path, operation: 'list' });
        errorEmitter.emit('permission-error', permissionError);
        throw permissionError;
    }
}


export async function getTask(id: string): Promise<Task | null> {
    const db = getFirestore();
    const taskRef = doc(db, 'tasks', id);
    try {
        const taskSnap = await getDoc(taskRef);
        return taskSnap.exists() ? { id: taskSnap.id, ...taskSnap.data() } as Task : null;
    } catch(e) {
        const permissionError = new FirestorePermissionError({ path: taskRef.path, operation: 'get' });
        errorEmitter.emit('permission-error', permissionError);
        throw permissionError;
    }
}

export async function updatePM(id: string, data: Partial<WeeklyPM>) {
    const db = getFirestore();
    const pmRef = doc(db, 'pms', id);
    return updateDoc(pmRef, data).catch(e => {
        const permissionError = new FirestorePermissionError({ path: pmRef.path, operation: 'update', requestResourceData: data });
        errorEmitter.emit('permission-error', permissionError);
        throw permissionError;
    });
}
