import { colors } from "@/lib/colors";
import Profile from "../../../Profile/Profile";
import "@/components/styles/wormhole-loading-animation.css";

const Loading = () => {
  return (
    <div className="flex items-center justify-center fixed left-1/2 top-4/6 -translate-x-1/2 -translate-y-1/2 z-5 font-family">
      <div className={`w-[460px] h-[460px] bg-[#1E1E1E] rounded-xl relative flex items-center justify-center`}>
        <div className="absolute left-1/2 top-2/3 -translate-x-1/4 -translate-y-1/2 bg-[#1E1E1E] text-white rounded-l-xl z-10 wormhole-in">
          <Profile Selection={false} />
        </div>

        <div className="flex flex-col items-center gap-8">
          <span className={`text-[${colors.text.green}] text-lg font-medium animate-pulse`}>
            Still getting swallowed...
          </span>
          <img
            src="WormholeLogo.svg"
            alt="Wormhole Logo"
            className="size-80"
          />
        </div>
      </div>
    </div>
  );
};

export default Loading; 