import type { User } from 'firebase/auth';
import { getDb } from '../firebase/config';

export interface UserProfile {
  uid: string;
  name: string;
  birthDate: string;
  nickname: string;
  photoURL: string | null;
  email: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export async function getUserProfile(user: User): Promise<UserProfile> {
  const [database, { doc, getDoc, serverTimestamp, setDoc }] = await Promise.all([
    getDb(), import('firebase/firestore'),
  ]);
  const profileRef = doc(database, 'users', user.uid);
  const snapshot = await getDoc(profileRef);
  if (snapshot.exists()) {
    return {
      uid: user.uid,
      name: user.displayName ?? '',
      birthDate: '',
      nickname: '',
      photoURL: user.photoURL,
      email: user.email ?? '',
      ...snapshot.data(),
    } as UserProfile;
  }

  const initial: UserProfile = {
    uid: user.uid,
    name: user.displayName ?? '',
    birthDate: '',
    nickname: '',
    photoURL: user.photoURL,
    email: user.email ?? '',
  };
  await setDoc(profileRef, { ...initial, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
  return initial;
}

export async function saveUserProfile(user: User, profile: Pick<UserProfile, 'name' | 'birthDate' | 'nickname' | 'photoURL'>) {
  const [database, { doc, getDoc, serverTimestamp, setDoc }] = await Promise.all([
    getDb(), import('firebase/firestore'),
  ]);
  const profileRef = doc(database, 'users', user.uid);
  const snapshot = await getDoc(profileRef);
  await setDoc(profileRef, {
    uid: user.uid,
    name: profile.name.trim(),
    birthDate: profile.birthDate,
    nickname: profile.nickname.trim().replace(/^@/, ''),
    photoURL: profile.photoURL,
    email: user.email ?? '',
    ...(!snapshot.exists() ? { createdAt: serverTimestamp() } : {}),
    updatedAt: serverTimestamp(),
  }, { merge: true });
}
