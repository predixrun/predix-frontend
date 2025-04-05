import { colors } from "@/lib/colors";
import "@/components/styles/wormhole-loading-animation.css";

interface SpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  color?: string;
  children?: React.ReactNode;
}

const sizeClasses = {
  sm: "w-20 h-20",
  md: "w-40 h-40",
  lg: "w-60 h-60",
};

const Spinner: React.FC<SpinnerProps> = ({
  className = "",
  size = "md",
  color = colors.text.white,
  children,
}) => {
  return (
    <div className={`flex items-center justify-center h-screen bg-[${colors.black}] ${className}`}>
      {children ? (
        <div className={`wormhole-in ${sizeClasses[size]}`} style={{ color }}>
          {children}
        </div>
      ) : (
        <div className="text-white text-2xl font-bold">Loading...</div>
      )}
    </div>
  );
};

export default Spinner;
