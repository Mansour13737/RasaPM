import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, DocumentData, QuerySnapshot, Firestore, getDoc } from 'firebase/firestore';
import type { User, Site, WeeklyPM, ChangeRequest, Task } from './types';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';


// --- User Management ---

export async function getUsers(db: Firestore): Promise<User[]> {
  const usersCol = collection(db, 'users');
  const userSnapshot = await getDocs(usersCol);
  return userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
}

export function addUser(db: Firestore, user: Omit<User, 'id'>): void {
  const usersRef = collection(db, 'users');
  addDoc(usersRef, user)
    .catch(async (serverError) => {
      const permissionError = new FirestorePermissionError({
        path: usersRef.path,
        operation: 'create',
        requestResourceData: user,
      });
      errorEmitter.emit('permission-error', permissionError);
    });
}

export function updateUser(db: Firestore, userId: string, userData: Partial<User>): void {
  const userRef = doc(db, 'users', userId);
  updateDoc(userRef, userData)
    .catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: userRef.path,
            operation: 'update',
            requestResourceData: userData,
        });
        errorEmitter.emit('permission-error', permissionError);
    });
}

export function deleteUser(db: Firestore, userId: string): void {
  const userRef = doc(db, 'users', userId);
  deleteDoc(userRef)
    .catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
            path: userRef.path,
            operation: 'delete',
        });
        errorEmitter.emit('permission-error', permissionError);
    });
}

// --- Site Management ---

export async function getSites(db: Firestore): Promise<Site[]> {
  const sitesCol = collection(db, 'sites');
  const siteSnapshot = await getDocs(sitesCol);
  return siteSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Site));
}

export async function getCities(db: Firestore): Promise<string[]> {
    const sites = await getSites(db);
    const cities = new Set(sites.map(s => s.location.split(', ')[1]).filter(Boolean));
    return Array.from(cities);
}


// --- PM Management ---
export async function getWeeklyPMs(db: Firestore): Promise<WeeklyPM[]> {
    const pmsCol = collection(db, 'pms');
    const pmSnapshot = await getDocs(pmsCol);
    return pmSnapshot.docs.map(d => ({ id: d.id, ...d.data() } as WeeklyPM));
}

export function addWeeklyPM(db: Firestore, pm: Omit<WeeklyPM, 'id'>): void {
    const pmsRef = collection(db, 'pms');
    addDoc(pmsRef, pm)
        .catch(async (serverError) => {
            const permissionError = new FirestorePermissionError({
                path: pmsRef.path,
                operation: 'create',
                requestResourceData: pm,
            });
            errorEmitter.emit('permission-error', permissionError);
        });
}


// --- Technician specific data ---

export async function getTechnicians(db: Firestore): Promise<User[]> {
  const users = await getUsers(db);
  return users.filter(u => u.role === 'Technician');
}


// --- Other data fetching (These can be expanded) ---

export async function getCRsForSite(db: Firestore, siteId: string): Promise<ChangeRequest[]> {
  // This is a placeholder. In a real app, you'd query Firestore.
  return [];
}

export async function getPMById(db: Firestore, id: string): Promise<WeeklyPM | null> {
    const pmRef = doc(db, 'pms', id);
    const pmSnap = await getDoc(pmRef);
    if (pmSnap.exists()) {
        return { id: pmSnap.id, ...pmSnap.data() } as WeeklyPM;
    }
    return null;
}

export async function getSiteById(db: Firestore, id: string): Promise<Site | null> {
    const siteRef = doc(db, 'sites', id);
    const siteSnap = await getDoc(siteRef);
    if (siteSnap.exists()) {
        return { id: siteSnap.id, ...siteSnap.data() } as Site;
    }
    return null;
}

export async function getTasks(db: Firestore): Promise<Task[]> {
    // This is a placeholder. In a real app, you'd query Firestore.
    return [];
}
