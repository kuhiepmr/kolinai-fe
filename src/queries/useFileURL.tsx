import {storage} from '@/lib/firebase';
import {Conversation} from '@/lib/models';
import {getStoragePath} from '@/lib/utils';
import {User} from 'firebase/auth';
import {getDownloadURL, ref} from 'firebase/storage';
import {useEffect, useState} from 'react';

interface UseFileURLProps {
  conversation?: Conversation | null;
  currentUser?: User | null;
}

export const useFileURL = ({conversation, currentUser}: UseFileURLProps) => {
  const [url, setUrl] = useState<string | undefined>();

  useEffect(() => {
    const getURL = async () => {
      const filePath = getStoragePath(currentUser, conversation);

      const fileRef = ref(storage, filePath);
      const fileURL = await getDownloadURL(fileRef);

      setUrl(fileURL);
    };

    if (conversation) {
      getURL();
    }
  }, [currentUser, conversation]);

  return url;
};
