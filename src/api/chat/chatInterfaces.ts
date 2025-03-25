export interface GameRelation {
  key: string;
  content: string;
}

export interface GameData {
  gameTitle: string;
  gameContent: string;
  extras: string;
  gameStartAt: string;
  gameExpriedAt: string;
  fixtureId: number;
  gameRelations: GameRelation[];
  quantity: string;
  key: string;
  choiceType: string;
}

export interface ChatMessage {
  externalId?: string | null;
  conversationExternalId?: string;
  sender?: string | null;
  content: string;
  messageType: string;
  data?: GameData;
}
