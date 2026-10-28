import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth';
import { auth, firebaseConfigured, getDb } from '../firebase/config';

function services() {
  if (!firebaseConfigured || !auth) {
    throw new Error('Configure o arquivo .env com os dados do seu projeto Firebase.');
  }
  return { auth };
}

export async function login(email: string, password: string) {
  const { auth: firebaseAuth } = services();
  return signInWithEmailAndPassword(firebaseAuth, email.trim(), password);
}

export async function register(name: string, email: string, password: string) {
  const { auth: firebaseAuth } = services();
  const credential = await createUserWithEmailAndPassword(firebaseAuth, email.trim(), password);
  await updateProfile(credential.user, { displayName: name.trim() });
  const [{ doc, serverTimestamp, setDoc }, firestore] = await Promise.all([
    import('firebase/firestore'), getDb(),
  ]);
  await setDoc(doc(firestore, 'users', credential.user.uid), {
    uid: credential.user.uid,
    name: name.trim(),
    email: credential.user.email,
    birthDate: '',
    nickname: '',
    photoURL: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return credential.user;
}

export async function sendResetEmail(email: string) {
  const { auth: firebaseAuth } = services();
  return sendPasswordResetEmail(firebaseAuth, email.trim());
}

export async function logout() {
  const { auth: firebaseAuth } = services();
  return signOut(firebaseAuth);
}

export function friendlyAuthError(error: unknown): string {
  const code = (error as { code?: string })?.code;
  const messages: Record<string, string> = {
    'auth/invalid-email': 'Confira o formato do e-mail.',
    'auth/user-not-found': 'Não encontramos uma conta com esse e-mail.',
    'auth/wrong-password': 'E-mail ou senha incorretos.',
    'auth/invalid-credential': 'E-mail ou senha incorretos. Confira seus dados.',
    'auth/email-already-in-use': 'Este e-mail já está cadastrado. Tente entrar.',
    'auth/weak-password': 'A senha precisa ter pelo menos 6 caracteres.',
    'auth/too-many-requests': 'Muitas tentativas. Aguarde um pouco e tente novamente.',
    'auth/network-request-failed': 'Falha de conexão. Confira sua internet.',
    'permission-denied': 'Acesso negado. Confira as regras do Firebase.',
  };
  if (error instanceof Error && error.message.startsWith('Configure o arquivo .env')) return error.message;
  return messages[code ?? ''] ?? 'Não foi possível concluir. Tente novamente.';
}

export type AuthUser = User;
