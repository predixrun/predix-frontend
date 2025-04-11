export interface Chatting {
  externalId?: string | null;
  conversationExternalId?: string;
  sender?: string | null;
  content: string;
  messageType: string;
  data?: any | null;
}

export interface GameRelation {
  key: string;
  content: string;
}

export interface GameData {
  gameTitle: string;
  gameContent: string;
  extras: string;
  gameStartAt: string;
  gameEndAt: string;
  gameExpriedAt: string;
  fixtureId: number;
  gameRelations: GameRelation[];
  quantity: string;
  key: string;
  asset: string;
  choiceType: string;
}

export interface MessageData {
  externalId: string | null;
  content: string;
  messageType: "CREATE_TR";
  data: GameData;
}

export interface ConversationResponse {
  status: string;
  data: {
    conversation: {
      externalId: string;
      messages: Chatting[];
    };
  };
}