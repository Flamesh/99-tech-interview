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
  onTokenChange: (token: ITokenData) => void;
  isTargetExchange: boolean;
  error?: string | null;
}

function SwapInput({
  inputValue,
  onInputChange,
  balance,
  tokenSymbol,
  listToken,
  useBalance,
  onTokenChange,
  isTargetExchange,
  error = "",
}: SwapInputProps) {
  const handleTokenChange = (token: ITokenData) => {
    onTokenChange(token);
  };

  return (
    <div className="bg-gray-700 rounded-xl p-4 mb-1">
      <div className="flex justify-between mb-2">
        <label className="text-gray-400 text-sm">
          {isTargetExchange ? "To" : "From"}
        </label>
        <span className="text-gray-400 text-sm">
          Balance: {balance} {tokenSymbol}
        </span>
      </div>
      <div className="flex items-start justify-between md:flex-row flex-col gap-4">
        <div className="flex flex-col relative">
          <input
            id="swap-input"
            type="text"
            value={inputValue}
            onChange={(e) => onInputChange(Number(e.target.value))}
            className={`md:w-1/2 lg:w-3/4 bg-transparent text-white text-2xl outline-none border-b border-gray-600 focus:border-blue-500 mr-2 ${
              error ? "border-red-500" : ""
            }`}
            placeholder="0.0"
            disabled={isTargetExchange}
          />
          {!isTargetExchange && (
            <div className="flex justify-between items-center mt-2">
              <button
                onClick={() => onInputChange(balance)}
                className="cursor-pointer text-gray-400 text-[12px] text-left"
              >
                Max
              </button>
              {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            </div>
          )}
        </div>

        <div className="relative">
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
