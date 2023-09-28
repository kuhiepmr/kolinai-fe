import {database} from '@/lib/firebase';
import {Conversation} from '@/lib/models';
import {User} from 'firebase/auth';
import {ref, update} from 'firebase/database';

export const updateConversation = async (
  conversation: Partial<Conversation>,
  currentUser?: User | null,
) => {
  const conversationPath = `conversations/${currentUser?.uid ?? 'public'}/${
    conversation.id
  }`;
  const conversationRef = ref(database, conversationPath);

  return update(conversationRef, conversation);
};
