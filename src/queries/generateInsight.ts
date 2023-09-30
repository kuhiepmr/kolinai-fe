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

  const tempURL = localStorage.getItem('baseURL');
  if (tempURL) {
    axios.defaults.baseURL = tempURL;
  }

  try {
    toast({title: 'Generating insight'});
    await updateConversation(
      {...conversation, status: 'insight-generating'},
      currentUser,
    );
    const res = await axios.post<Insight>('/transcribe_and_summarize', {
      fileName,
      type: conversation.type,
      context: conversation.context,
    });

    await updateConversation(
      {...conversation, insight: res.data, status: 'insight-generated'},
      currentUser,
    );
    return;
  } catch (error) {
    toastJSON('Error while generating insight', {
      message: (error as Error).message,
    });
    await updateConversation(
      {...conversation, status: 'insight-failed'},
      currentUser,
    );
  }
};
