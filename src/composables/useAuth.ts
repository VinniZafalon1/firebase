import { onAuthStateChanged, type User } from 'firebase/auth';
import { ref, shallowReadonly } from 'vue';
import { auth, firebaseConfigured } from '../firebase/config';

const user = ref<User | null>(null);
const ready = ref(false);
let started = false;
let resolveReady: () => void = () => undefined;
const readyPromise = new Promise<void>((resolve) => { resolveReady = resolve; });

function startObserver() {
  if (started) return;
  started = true;
  if (!firebaseConfigured || !auth) {
    ready.value = true;
    resolveReady();
    return;
  }
  onAuthStateChanged(auth, (nextUser) => {
    user.value = nextUser;
    ready.value = true;
    resolveReady();
  }, () => {
    user.value = null;
    ready.value = true;
    resolveReady();
  });
}

export function useAuth() {
  startObserver();
  return { user: shallowReadonly(user), ready: shallowReadonly(ready), waitUntilReady: () => readyPromise };
}
