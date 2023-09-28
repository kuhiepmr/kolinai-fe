export interface DBConversation {
  fileName: string;
  name: string;
  type: string;
  context: string;
  status: string;
  createdAt: string;
  fileSize: number;
  insight?: Insight;
}

export interface Conversation extends DBConversation {
  id: string;
}

export interface Insight {}
