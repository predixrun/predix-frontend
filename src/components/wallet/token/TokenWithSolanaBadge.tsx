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
    <div className="relative inline-block size-5">
      <img
        src={tokenSrc}
        alt={altToken}
        className="w-full h-full rounded-full object-contain"
      />
      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-black p-0.5 shadow-lg">
        <img
          src={solanaSrc}
          alt={altSolana}
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
};

export default TokenWithSolanaBadge;
