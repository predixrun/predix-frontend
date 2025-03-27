export interface Selection {
  name: string;
  type: string;
  description: string;
}

export interface Chatting {
  externalId?: string | null;
  conversationExternalId?: string;
  sender?: string | null;
  content: string;
  messageType: string;
  data?: any | null;
}

export interface ChatMessageProps {
  message: Chatting;
  handleButtonClick: (buttonText: string) => void;
}

export interface ChatInputProps {
  sendMessage: () => void;
  inputText: string;
  setInputText: (text: string) => void;
  loading: boolean;
}

export interface Conversation {
  createdAt: string;
  externalId: string;
  id: number;
  title: string;
  updatedAt: string;
  userId: number;
}

export interface ChatListResponse {
  data: {
    conversations: Conversation[];
  };
}
