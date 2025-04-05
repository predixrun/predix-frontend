import CopyQRSolana from "./CopyQRSolana";
import CopyQREthereum from "./CopyQREthereum";
import AdressType from "./adressType";

interface CopyQRClipboardProps {
  type?: "solana" | "ethereum" | "both";
}

const CopyQRClipboard: React.FC<CopyQRClipboardProps> = ({ type = "both" }) => {
  return (
    <div className="flex flex-col gap-2">
      {(type === "solana" || type === "both") && <div className="flex items-center gap-2"> <AdressType type="SVM" bgColor="#767676" textColor="black" /><CopyQRSolana /></div>}
      {(type === "ethereum" || type === "both") && <div className="flex items-center gap-2"> <AdressType type="EVM" bgColor="#767676" textColor="black" /><CopyQREthereum /></div>}
    </div>
  );
};

export default CopyQRClipboard; 