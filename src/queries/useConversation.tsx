import {auth, database} from '@/lib/firebase';
import {Conversation} from '@/lib/models';
import {get, onValue, ref} from 'firebase/database';
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';

interface UseConversationProps {
  conversationId: string;
}

export const useConversation = ({conversationId}: UseConversationProps) => {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const updateConversation = (conversation: Conversation | null) => {
      if (!conversation) {
        return;
      }
      setConversation({...conversation, id: conversationId});
    };

    const getConversation = async () => {
      await auth.authStateReady();
      const conversationPath = `conversations/${
        auth.currentUser?.uid ?? 'public'
      }/${conversationId}`;

      const conversationRef = ref(database, conversationPath);
      const snapshot = await get(conversationRef);
      const conversation = snapshot.val();

      if (!conversation) {
        navigate(`/notfound?resource=conversation&id=${conversationId}`);
      }

      updateConversation(conversation);

      onValue(conversationRef, snapshot => {
        updateConversation(snapshot.val());
      });
    };

    getConversation();
  }, [auth]);

  return conversation;
};
