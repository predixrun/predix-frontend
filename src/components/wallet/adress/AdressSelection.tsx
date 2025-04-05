import CopyQRSolana from "./CopyQRSolana";
import CopyQREthereum from "./CopyQREthereum";
import AdressType from "./adressType";

interface AdressSelectionProps {
  section: boolean;
  onSelect?: () => void;
}

const AdressSelection: React.FC<AdressSelectionProps> = ({ section, onSelect }) => {
  const handleClick = (e: React.MouseEvent, _component: 'solana' | 'ethereum') => {
    if ((e.target as HTMLElement).closest('.copy-button')) {
      return;
    }
    
    e.stopPropagation();
    if (onSelect) {
      onSelect();
    }
  };

  return (
    <div className="flex gap-1">
      {section ? (
        <div className="flex items-center gap-2 " onClick={(e) => handleClick(e, 'solana')}>
          <AdressType type="SVM" bgColor="#3CB371" textColor="#7FED58" />
          <div className="copy-button">
            <CopyQRSolana />
          </div>
        </div>
      ) : (
        <div onClick={(e) => handleClick(e, 'solana')}>
          <AdressType type="SVM" bgColor="#3CB371" textColor="#7FED58" />
        </div>
      )}
      
      {section ? (
        <div onClick={(e) => handleClick(e, 'ethereum')}>
          <AdressType type="EVM" bgColor="#3CB371" textColor="#7FED58" />
        </div>
      ) : (
        <div className="flex items-center gap-2" onClick={(e) => handleClick(e, 'ethereum')}>
          <AdressType type="EVM" bgColor="#3CB371" textColor="#7FED58" />
          <div className="copy-button">
            <CopyQREthereum />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdressSelection; 