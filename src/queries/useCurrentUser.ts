import {auth} from '@/lib/firebase';
import {User} from 'firebase/auth';
import {useEffect, useState} from 'react';

export const useCurrentUser = () => {
  const [user, setUser] = useState<User | null>(auth.currentUser);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return unsubscribe;
  }, []);

  return user;
};
