export default function AdressType({ type, bgColor, textColor }: { type: "SVM" | "EVM", bgColor: string, textColor: string }) {
    return (
        <div className={`relative min-w-[36px] h-[24px] not-even:rounded-xl flex items-center justify-center cursor-pointer`}  
            style={{ backgroundColor: bgColor }}>
            <span
                className={`text-[${textColor}] text-[14px]`}
            >
                {type}
            </span>

        </div>
    )
}