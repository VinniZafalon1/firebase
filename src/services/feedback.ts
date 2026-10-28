import { reactive } from 'vue';

export const feedback = reactive({ message: '', color: 'primary', open: false });

export function showToast(message: string, color: 'success' | 'danger' | 'primary' = 'primary') {
  feedback.message = message;
  feedback.color = color;
  feedback.open = true;
}
