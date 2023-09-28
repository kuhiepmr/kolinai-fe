import {toast, toastJSON} from '@/components/ui/use-toast';
import axios from '@/lib/axios';
import {Conversation, Insight} from '@/lib/models';
import {getStoragePath} from '@/lib/utils';
import {User} from 'firebase/auth';
import {updateConversation} from './updateConversation';

export const generateInsight = async (
  conversation: Conversation,
  currentUser?: User | null,
) => {
  const fileName = getStoragePath(currentUser, conversation);

  try {
    toast({title: 'Generating insight'});
    await updateConversation(
      {...conversation, status: 'insight-generating'},
      currentUser,
    );
    const insight = await axios.post<Insight>('/transcribe_and_summarize', {
      fileName,
      type: conversation.type,
      context: conversation.context,
    });

    await updateConversation(
      {id: conversation.id, insight, status: 'insight-generated'},
      currentUser,
    );
    return;
  } catch (error) {
    toastJSON('Error while generating insight', {
      message: (error as Error).message,
    });
    await updateConversation(
      {id: conversation.id, status: 'insight-failed'},
      currentUser,
    );
  }
};
