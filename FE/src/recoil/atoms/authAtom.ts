import { atom } from 'recoil';
import { AuthUser } from '../../types';

const getInitialAuth = (): AuthUser | null => {
  try {
    const saved = localStorage.getItem('auth_user');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

export const authAtom = atom<AuthUser | null>({
  key: 'authAtom',
  default: getInitialAuth(),
  effects: [
    ({ onSet }) => {
      onSet((user) => {
        if (user) {
          localStorage.setItem('auth_user', JSON.stringify(user));
        } else {
          localStorage.removeItem('auth_user');
        }
      });
    },
  ],
});
