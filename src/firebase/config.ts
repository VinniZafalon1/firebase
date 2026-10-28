import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const firebaseConfigured = Object.values(config).every(
  (value) => Boolean(value) && !value.startsWith('SUBSTITUA_') && !value.includes('ficticio'),
);

const firebaseApp = firebaseConfigured ? initializeApp(config) : null;
export const auth = firebaseApp ? getAuth(firebaseApp) : null;

export async function getDb(): Promise<Firestore> {
  if (!firebaseApp) throw new Error('Configure o Firebase no arquivo .env antes de acessar o perfil.');
  const { getFirestore } = await import('firebase/firestore');
  return getFirestore(firebaseApp);
}

