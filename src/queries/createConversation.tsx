import {database} from '@/lib/firebase';
import {ref, set} from 'firebase/database';

export const createConversation = async (file: File, filePath: string) => {
  // Replace all ".", "#", "$", "[", or "]" with "_"
  const conversationPath = filePath.replace(/[\.\#\$\[\]]/g, '_');

  const conversationRef = ref(database, `conversations/${conversationPath}`);

  await set(conversationRef, {
    name: file.name,
    status: 'new',
    createdAt: new Date().toISOString(),
    fileName: file.name,
    fileSize: file.size,
  });

  return conversationRef.key;
};
