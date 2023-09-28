import {toast, toastJSON} from '@/components/ui/use-toast';
import {database} from '@/lib/firebase';
import {Conversation} from '@/lib/models';
import {User} from 'firebase/auth';
import {ref, remove} from 'firebase/database';

export const deleteConversation = async (
  conversation: Conversation,
  currentUser?: User | null,
) => {
  const conversationPath = `conversations/${currentUser?.uid ?? 'public'}/${
    conversation.id
  }`;
  const conversationRef = ref(database, conversationPath);
  remove(conversationRef)
    .then(() =>
      toast({title: `You deleted the conversation: ${conversation.name}`}),
    )
    .catch(error => {
      toastJSON('Error deleting conversation', error);
    });
};
