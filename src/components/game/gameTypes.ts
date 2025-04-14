// types/gameTypes.ts

export type GameStatus = "ONGOING" | "EXPIRED" | "END";

export type CategoryProps = {
  onSelect: (categoryText: string) => void;
};

export interface GameDashboardProps {
  gameData: Game;
  onClose: () => void;
}

export interface GameInterfaceProps {
  changeParentsFunction: () => void;
  selectedCategory: string;
}

export interface GameRelation {
  key: string;
  content: string;
  thumbnail: string;
  count: number;
}

export interface Game {
  asset: string;
  gameId: number;
  gameTitle: string;
  gameContent: string;
  gameQuantity: string;
  gameStatus: string;
  gameExpiredAt: string;
  gameRelation: GameRelation[];
  joined: {
    choiceKey: string;
    quantity: string;
    choiceType: string;
    choiceResult?: string | null;
    rewardResult?: string | null;
  };
  user: {
    userId: number;
    name: string;
    profileImg: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface GameStrategy {
  getApiParams: (page: number, statusFilter: GameStatus) => any;
  filterGames: (
    games: Game[],
    currentUserId: number,
    statusFilter: GameStatus
  ) => Game[];
}
