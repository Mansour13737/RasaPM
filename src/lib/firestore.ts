
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, DocumentData, QuerySnapshot } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import type { User, Site, WeeklyPM, ChangeRequest, Task } from './types';

// Note: This is a placeholder for the actual firestore instance.
// In a real component, you would get this from the Firebase context.
// This is just to make the functions type-check.
let db: any;
function getDb() {
  if (!db) {
    db = useFirestore();
  }
  return db;
}


// --- User Management ---

export async function getUsers(): Promise<User[]> {
  const firestore = getDb();
  const usersCol = collection(firestore, 'users');
  const userSnapshot = await getDocs(usersCol);
  return userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
}

export async function addUser(user: Omit<User, 'id'>): Promise<void> {
  const firestore = getDb();
  await addDoc(collection(firestore, 'users'), user);
}

export async function updateUser(userId: string, userData: Partial<User>): Promise<void> {
  const firestore = getDb();
  const userRef = doc(firestore, 'users', userId);
  await updateDoc(userRef, userData);
}

export async function deleteUser(userId: string): Promise<void> {
  const firestore = getDb();
  await deleteDoc(doc(firestore, 'users', userId));
}

// --- Site Management ---

export async function getSites(): Promise<Site[]> {
  const firestore = getDb();
  const sitesCol = collection(firestore, 'sites');
  const siteSnapshot = await getDocs(sitesCol);
  return siteSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Site));
}

// --- PM Management ---
export async function getWeeklyPMs(): Promise<WeeklyPM[]> {
    const firestore = getDb();
    const pmsCol = collection(firestore, 'pms');
    const pmSnapshot = await getDocs(pmsCol);
    return pmSnapshot.docs.map(d => ({ id: d.id, ...d.data() } as WeeklyPM));
}

export async function addWeeklyPM(pm: Omit<WeeklyPM, 'id'>): Promise<void> {
    const firestore = getDb();
    await addDoc(collection(firestore, 'pms'), pm);
}


// --- Technician specific data ---

export async function getTechnicians(): Promise<User[]> {
  const firestore = getDb();
  const usersCol = collection(firestore, 'users');
  const userSnapshot = await getDocs(usersCol);
  return userSnapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() } as User))
    .filter(u => u.role === 'Technician');
}


// --- Other data fetching (These can be expanded) ---

export async function getCRsForSite(siteId: string): Promise<ChangeRequest[]> {
  // This is a placeholder. In a real app, you'd query Firestore.
  return [];
}

export async function getPMById(id: string): Promise<WeeklyPM | null> {
    // This is a placeholder. In a real app, you'd fetch the doc by ID.
    const pms = await getWeeklyPMs();
    return pms.find(pm => pm.id === id) || null;
}

export async function getSiteById(id: string): Promise<Site | null> {
    const sites = await getSites();
    return sites.find(s => s.id === id) || null;
}

export async function getTasks(): Promise<Task[]> {
    // This is a placeholder. In a real app, you'd query Firestore.
    return [];
}
