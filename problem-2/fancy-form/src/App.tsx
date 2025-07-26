import { useEffect, useMemo, useState } from "react";
import { IconButton } from "./component/icon";
import { FaArrowsAltV } from "react-icons/fa";
import SwapInput from "./component/swapInput";
import { useApi } from "./hooks/callApi";
import { fetchTokenData } from "./api/token";
import type { ITokenData } from "./typings/swap";
import Loading from "./component/loading";
import type { IUserBalance } from "./typings/user";
import { fetchUserBalance } from "./api/userBalance";
import { calcRate } from "./utils/calcRate";

const App = () => {
  const [fromAmount, setFromAmount] = useState(0);
  const [toAmount, setToAmount] = useState(0);

  const [userBalance, setUserBalance] = useState<IUserBalance[]>([]);

  const { data: tokens, loading: tokenLoading } = useApi(fetchTokenData, []);

  const { data: dataUserBalances, loading: userBalanceLoading } = useApi(
    () => fetchUserBalance(),
    []
  );

  const [fromToken, setFromToken] = useState<ITokenData | undefined>();
  const [toToken, setToToken] = useState<ITokenData | undefined>();

  useEffect(() => {
    if (tokens && tokens.length > 0) {
      setFromToken(tokens[0]);
      setToToken(tokens[1]);
    }
  }, [tokens]);

  const fromBalance = useMemo(() => {
    if (fromToken) {
      const currency = userBalance.find(
        (item) => item.symbol === fromToken.currency
      );
      if (currency) {
        return currency.balance;
      }
    }
    return 0;
  }, [fromToken, userBalance]);

  const toBalance = useMemo(() => {
    if (toToken) {
      const currency = userBalance.find(
        (item) => item.symbol === toToken.currency
      );
      if (currency) {
        return currency.balance;
      }
    }
    return 0;
  }, [toToken, userBalance]);

  useEffect(() => {
    if (dataUserBalances && dataUserBalances.length > 0) {
      setUserBalance(dataUserBalances);
    }
  }, [dataUserBalances]);

  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      {(tokenLoading || userBalanceLoading) && (
        <Loading text="Loading tokens..." />
      )}
      <div className="bg-gray-800 rounded-xl shadow-lg w-full max-w-md p-6">
        <div className="mb-6">
          <h1 className="text-white text-xl font-bold">Swap</h1>
          <p className="text-gray-400 text-sm">Trade tokens in an instant</p>
        </div>

        <SwapInput
          inputValue={fromAmount}
          onInputChange={setFromAmount}
          balance={fromBalance || 0}
          tokenSymbol={fromToken?.currency || ""}
          listToken={tokens || []}
          useBalance={userBalance || []}
          label="From"
          onTokenChange={(token) => setFromToken(token)}
        />

        <IconButton
          icon={<FaArrowsAltV className="text-white text-xl" />}
          onClick={handleSwapTokens}
          className="w-10 h-10"
        />
        <SwapInput
          inputValue={toAmount}
          onInputChange={setToAmount}
          balance={toBalance || 0}
          tokenSymbol={toToken?.currency || ""}
          listToken={tokens || []}
          useBalance={userBalance || []}
          label="To"
          onTokenChange={(token) => setToToken(token)}
        />

        {fromToken && toToken && (
          <div className="bg-gray-700 bg-opacity-50 rounded-lg p-3 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-400">Rate</span>
              <span className="text-white">
                1 {fromToken?.currency} ={" "}
                {calcRate(fromToken.price, toToken?.price)} {toToken?.currency}
              </span>
            </div>
          </div>
        )}

        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl w-full">
          Swap Tokens
        </button>
      </div>
    </div>
  );
};

export default App;
