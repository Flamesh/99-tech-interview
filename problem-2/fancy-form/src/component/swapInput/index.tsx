import React from "react";
import type { ITokenData } from "../../typings/swap";
import TokenMenu from "../tokenMenu";
import type { IUserBalance } from "../../typings/user";

interface SwapInputProps {
  inputValue: number;
  onInputChange: (value: number) => void;
  balance: number;
  tokenSymbol: string;
  listToken: ITokenData[];
  useBalance: IUserBalance[];
  label: string;
  onTokenChange: (token: ITokenData) => void;
}

function SwapInput({
  inputValue,
  onInputChange,
  balance,
  tokenSymbol,
  listToken,
  useBalance,
  label,
  onTokenChange
}: SwapInputProps) {
  const handleTokenChange = (token: ITokenData) => {
    onTokenChange(token);
  };
  return (
    <div className="bg-gray-700 rounded-xl p-4 mb-1">
      <div className="flex justify-between mb-2">
        <label className="text-gray-400 text-sm">{label}</label>
        <span className="text-gray-400 text-sm">
          Balance: {balance} {tokenSymbol}
        </span>
      </div>
      <div className="flex items-start justify-between">
        <div className="flex flex-col ">
          <input
            id="swap-input"
            type="text"
            value={inputValue}
            onChange={(e) => onInputChange(Number(e.target.value))}
            className="bg-transparent text-white text-2xl outline-none border-b border-gray-600 focus:border-blue-500 mr-2"
            placeholder="0.0"
          />
          <button
            onClick={() => onInputChange(balance)}
            className="cursor-pointer text-gray-400 text-[12px] text-left"
          >
            Max
          </button>
        </div>

        <div className="relative w-1/4">
          <TokenMenu
            listToken={listToken}
            onTokenSelect={handleTokenChange}
            userBalance={useBalance}
            tokenSymbol={tokenSymbol}
          />
        </div>
      </div>
    </div>
  );
}

export default React.memo(SwapInput);
