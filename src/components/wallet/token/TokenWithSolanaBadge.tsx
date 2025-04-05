

const TokenWithSolanaBadge: React.FC<{
  tokenSrc: string; 
  solanaSrc: string; 
  altToken?: string;
  altSolana?: string;
}> = ({
  tokenSrc,
  solanaSrc, 
  altToken = "Token",
  altSolana = "Solana logo",
}) => {
  return (
    <div className="relative inline-block">
      <img
        src={solanaSrc}
        alt={altSolana}
        className="absolute bottom-0 right-0 w-1/4 h-auto object-contain"
      />
      <img
        src={tokenSrc}
        alt={altToken}
        className="w-1/4 h-auto object-contain"
      />
    </div>
  );
};

export default TokenWithSolanaBadge;
