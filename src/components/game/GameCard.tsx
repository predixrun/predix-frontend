import { Game } from "./gameTypes";

interface GameCardProps {
  game: Game;
  onCardClick: (gameId: number) => void;
  truncateMiddle: (text: string, maxLength: number) => string;
}

export default function GameCard({ game, onCardClick, truncateMiddle }: GameCardProps) {
  return (
    <div
      key={game.gameId}
      className="animated-card w-[450px]"
      onClick={() => onCardClick(game.gameId)}
    >
      <div className="animated-card-inner">
        <div className="title-line flex items-center rounded-full w-full h-[42px] justify-between bg-[#1B191E] px-3">
          <div className="title-text text-xs">{game.gameTitle}</div>
          <div className="mr-3 text-xs">
            {truncateMiddle(game.gameContent, 10)}
            {game.gameStatus === "EXPIRED" && (
              <span className="text-red-500 ml-2">Expired</span>
            )}
          </div>
        </div>
        <div className="game-info mt-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img
                src={game.user.profileImg}
                alt="Profile"
                className="w-6 h-6 rounded-full mr-2"
              />
              <span className="text-sm">{game.user.name}</span>
            </div>
            <div className="text-sm text-gray-400">
              {game.gameExpiredAt}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 