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

export enum EEmotion {
  Anger = 'anger',
  Disgust = 'disgust',
  Fear = 'fear',
  Happiness = 'happiness',
  Sadness = 'sadness',
}

export interface Emotion {
  Emotion: string;
  Score: string;
}

export interface Insight {
  transcription: string;
  emotions: Emotion[];
}
