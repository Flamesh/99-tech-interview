

interface SymbolImageProps { 
    symbol: string;
    height?: number;
    width?: number;
}

export default function SymbolImage({ symbol, height = 6, width = 6 }: SymbolImageProps) {
    return (
        <img
            src={`/tokens/${symbol}.svg`}
            alt={symbol}
            className={`w-${width} h-${height}`}
            width={`${width}rem`}
            height={`${height}rem`}
        />
    );
}