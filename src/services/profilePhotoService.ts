import { getDb } from '../firebase/config';

const MAX_PHOTO_BYTES = 700 * 1024;

export interface ProfilePhoto {
  uid: string;
  dataUrl: string;
  contentType: string;
}

export function validateProfilePhoto(file: File): string | null {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    return 'Escolha uma imagem JPG, PNG ou WEBP.';
  }
  if (file.size > MAX_PHOTO_BYTES) {
    return 'A imagem precisa ter até 700 KB para caber com segurança no limite do Firestore.';
  }
  return null;
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      if (typeof reader.result === 'string') resolve(reader.result);
      else reject(new Error('Não foi possível ler a imagem selecionada.'));
    });
    reader.addEventListener('error', () => reject(new Error('Não foi possível ler a imagem selecionada.')));
    reader.readAsDataURL(file);
  });
}

export async function getProfilePhoto(uid: string): Promise<ProfilePhoto | null> {
  const [db, { doc, getDoc }] = await Promise.all([getDb(), import('firebase/firestore')]);
  const snapshot = await getDoc(doc(db, 'profilePhotos', uid));
  if (!snapshot.exists()) return null;
  return snapshot.data() as ProfilePhoto;
}

export async function saveProfilePhoto(uid: string, file: File): Promise<string> {
  const issue = validateProfilePhoto(file);
  if (issue) throw new Error(issue);
  const dataUrl = await fileToDataUrl(file);
  const [db, { doc, serverTimestamp, setDoc }] = await Promise.all([getDb(), import('firebase/firestore')]);
  await setDoc(doc(db, 'profilePhotos', uid), {
    uid,
    dataUrl,
    contentType: file.type,
    updatedAt: serverTimestamp(),
  });
  return dataUrl;
}
