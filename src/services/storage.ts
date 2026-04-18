import { collection, doc, setDoc, getDocs, query, orderBy, onSnapshot, deleteDoc, updateDoc } from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';

export interface JournalEntry {
  id: string;
  userId?: string;
  date: string;
  prompt: string;
  reflection: string;
  moodId?: string;
}

export interface MoodAssessment {
  id: string;
  userId?: string;
  date: string;
  energyLevel: 'Low' | 'Medium' | 'High';
  stressLevel: 'Low' | 'Medium' | 'High';
  pleasantness: 'Unpleasant' | 'Neutral' | 'Pleasant';
  sleepQuality?: 'Poor' | 'Fair' | 'Good';
  focusLevel?: 'Scattered' | 'Normal' | 'Laser';
  moodId: string;
  ritualId: string;
}

export const storage = {
  getEntries: async (): Promise<JournalEntry[]> => {
    if (!auth.currentUser) {
      const data = localStorage.getItem('sanctuary_entries');
      return data ? JSON.parse(data) : [];
    }
    
    try {
      const path = `users/${auth.currentUser.uid}/journalEntries`;
      const q = query(collection(db, path), orderBy('date', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => doc.data() as JournalEntry);
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, `users/${auth.currentUser?.uid}/journalEntries`);
      return [];
    }
  },
  
  saveEntry: async (entry: JournalEntry) => {
    if (!auth.currentUser) {
      const data = localStorage.getItem('sanctuary_entries');
      const entries = data ? JSON.parse(data) : [];
      entries.unshift(entry);
      localStorage.setItem('sanctuary_entries', JSON.stringify(entries));
      return;
    }

    try {
      const path = `users/${auth.currentUser.uid}/journalEntries`;
      entry.userId = auth.currentUser.uid;
      await setDoc(doc(db, path, entry.id), entry);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `users/${auth.currentUser?.uid}/journalEntries/${entry.id}`);
    }
  },

  updateEntry: async (id: string, updates: Partial<JournalEntry>) => {
    if (!auth.currentUser) {
      const data = localStorage.getItem('sanctuary_entries');
      let entries = data ? JSON.parse(data) : [];
      entries = entries.map((e: JournalEntry) => e.id === id ? { ...e, ...updates } : e);
      localStorage.setItem('sanctuary_entries', JSON.stringify(entries));
      return;
    }

    try {
      const path = `users/${auth.currentUser.uid}/journalEntries`;
      await updateDoc(doc(db, path, id), updates);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${auth.currentUser?.uid}/journalEntries/${id}`);
    }
  },

  getMoodHistory: async (): Promise<MoodAssessment[]> => {
    if (!auth.currentUser) {
      const data = localStorage.getItem('sanctuary_moods');
      return data ? JSON.parse(data) : [];
    }

    try {
      const path = `users/${auth.currentUser.uid}/moodAssessments`;
      const q = query(collection(db, path), orderBy('date', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => doc.data() as MoodAssessment);
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, `users/${auth.currentUser?.uid}/moodAssessments`);
      return [];
    }
  },

  saveMoodAssessment: async (assessment: MoodAssessment) => {
    if (!auth.currentUser) {
      const data = localStorage.getItem('sanctuary_moods');
      const moods = data ? JSON.parse(data) : [];
      moods.unshift(assessment);
      localStorage.setItem('sanctuary_moods', JSON.stringify(moods));
      return;
    }

    try {
      const path = `users/${auth.currentUser.uid}/moodAssessments`;
      assessment.userId = auth.currentUser.uid;
      await setDoc(doc(db, path, assessment.id), assessment);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `users/${auth.currentUser?.uid}/moodAssessments/${assessment.id}`);
    }
  }
};
