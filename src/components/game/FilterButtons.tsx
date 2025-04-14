import { GameStatus } from "./gameTypes";

interface FilterButtonsProps {
  selectedCategory: string;
  statusFilter: GameStatus;
  setStatusFilter: (status: GameStatus) => void;
  setCurrentPage: (page: number) => void;
  changeParentsFunction: () => void;
}

export default function FilterButtons({
  selectedCategory,
  statusFilter,
  setStatusFilter,
  setCurrentPage,
  changeParentsFunction,
}: FilterButtonsProps) {
  return (
    <div className="mb-6 mt-6 w-[900px] flex justify-start text-white gap-2 transition-all duration-300">
      <div>
        {(selectedCategory === "Trending Game" || selectedCategory === "Recent Game") && (
          <>
            <button
              className={`bg-custom-dark border-2 border-[#2C2C2C] text-[#B3B3B3] w-[87px] h-[32px] text-[14px] rounded-full mr-2 transition-all duration-300 ease-in-out hover:bg-transparent hover:border-[#D74713] hover:text-white ${
                statusFilter === "ONGOING" ? "border-[#D74713] text-white" : ""
              }`}
              onClick={() => {
                setStatusFilter("ONGOING");
                setCurrentPage(0);
              }}
            >
              Ongoing
            </button>
            <button
              className={`bg-custom-dark border-2 border-[#2C2C2C] text-[#B3B3B3] w-[56px] h-[32px] text-[14px] rounded-full mr-2 transition-all duration-300 ease-in-out hover:bg-transparent hover:border-[#D74713] hover:text-white ${
                statusFilter === "END" ? "border-[#D74713] text-white" : ""
              }`}
              onClick={() => {
                setStatusFilter("END");
                setCurrentPage(0);
              }}
            >
              End
            </button>
          </>
        )}
        {(selectedCategory === "History" || selectedCategory === "Created Game") && (
          <>
            <button
              className={`bg-custom-dark border-2 border-[#2C2C2C] text-[#B3B3B3] w-[87px] h-[32px] text-[14px] rounded-full mr-2 transition-all duration-300 ease-in-out hover:bg-transparent hover:border-[#D74713] hover:text-white ${
                statusFilter === "ONGOING" ? "border-[#D74713] text-white" : ""
              }`}
              onClick={() => {
                setStatusFilter("ONGOING");
                setCurrentPage(0);
              }}
            >
              Ongoing
            </button>
            <button
              className={`bg-custom-dark border-2 border-[#2C2C2C] text-[#B3B3B3] w-[56px] h-[32px] text-[14px] rounded-full mr-2 transition-all duration-300 ease-in-out hover:bg-transparent hover:border-[#D74713] hover:text-white ${
                statusFilter === "END" ? "border-[#D74713] text-white" : ""
              }`}
              onClick={() => {

                setStatusFilter("END");
                setCurrentPage(0);
              }}
            >
              End
            </button>
          </>
        )}
        <button
          className="bg-custom-dark border-2 border-[#2C2C2C] text-[#B3B3B3] w-[56px] h-[32px] text-[14px] rounded-full mr-2 transition-all duration-300 ease-in-out hover:bg-transparent hover:border-[#D74713] hover:text-white"
          onClick={changeParentsFunction}
        >
          close
        </button>
      </div>
    </div>
  );
} 