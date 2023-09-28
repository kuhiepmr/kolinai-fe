import {auth, database} from '@/lib/firebase';
import {Conversation, DBConversation} from '@/lib/models';
import {get, onValue, ref} from 'firebase/database';
import {useEffect, useState} from 'react';

interface UseConversationsProps {
  searchText?: string;
  types?: string[];
  statuses?: string[];
}

export const useConversations = ({
  searchText,
  types,
  statuses,
}: UseConversationsProps = {}) => {
  const [conversations, setConversations] = useState<
    Conversation[] | undefined
  >();

  useEffect(() => {
    const updateConversations = (conversations: DBConversation[]) => {
      setConversations(
        Object.entries(conversations)
          .filter(([_, conversation]) => {
            if (searchText) {
              const searchFields = [conversation.name, conversation.context];

              if (
                !searchFields.some(field =>
                  field.toLowerCase().includes(searchText.toLowerCase()),
                )
              ) {
                return false;
              }
            }

            if (types && !types.includes(conversation.type)) {
              return false;
            }

            if (statuses && !statuses.includes(conversation.status)) {
              return false;
            }

            return true;
          })
          .sort(
            ([, a], [, b]) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )
          .map(([id, conversation]) => ({id, ...conversation})),
      );
    };

    const getConversations = async () => {
      await auth.authStateReady();
      const conversationPath = `conversations/${
        auth.currentUser?.uid ?? 'public'
      }`;
      const conversationRef = ref(database, conversationPath);
      const snapshot = await get(conversationRef);

      updateConversations(snapshot.val() ?? []);

      onValue(conversationRef, snapshot => {
        updateConversations(snapshot.val() ?? []);
      });
    };
    getConversations();
  }, [auth, searchText, types, statuses]);

  return conversations;
};
