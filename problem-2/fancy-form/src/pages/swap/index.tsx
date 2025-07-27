import { useEffect, useMemo, useState } from "react";
import { IconButton } from "../../component/icon";
import { FaArrowsAltV } from "react-icons/fa";
import SwapInput from "../../component/swapInput";
import { useApi } from "../../hooks/callApi";
import { exChangeTokenApi, fetchTokenData } from "../../api/token";
import type { ITokenData } from "../../typings/swap";
import Loading from "../../component/loading";
import type { IUserBalance } from "../../typings/user";
import { fetchUserBalance } from "../../api/userBalance";
import { calcRate, formatNumber } from "../../utils/calcRate";
import AnimationButton from "../../component/button";
import "./index.scss";
import { toast } from "react-toastify";

const SwapPage = () => {
  

  const [fromAmount, setFromAmount] = useState(0);
  const [toAmount, setToAmount] = useState(0);

  const [userBalance, setUserBalance] = useState<IUserBalance[]>([]);
  const { data: tokens, loading: tokenLoading } = useApi(fetchTokenData, []);
  const { data: dataUserBalances, loading: userBalanceLoading } = useApi(
    () => fetchUserBalance(),
    []
  );
  const [exchangeLoading, setExchangeLoading] = useState(false);

  const [fromToken, setFromToken] = useState<ITokenData | undefined>();
  const [toToken, setToToken] = useState<ITokenData | undefined>();
  const [errorSwap, setErrorSwap] = useState<string | null>(null);

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
  };

  useEffect(() => {
    if (fromToken && toToken) {
      const rate = calcRate(fromToken.price, toToken.price);
      setToAmount(formatNumber(fromAmount * rate));
    }
  }, [fromAmount, fromToken, toToken]);

  useEffect(() => {
    if (fromToken && fromAmount > 0) {
      const balance = userBalance.find(
        (item) => item.symbol === fromToken.currency
      );
      if (!balance) {
        setErrorSwap("Insufficient balance");
        return;
      }
      if (balance && balance.balance < fromAmount) {
        setErrorSwap("Insufficient balance");
      } else {
        setErrorSwap(null);
      }
    }
  }, [fromToken, fromAmount, userBalance]);

  useEffect(() => {
    setErrorSwap(null);
  }, [fromToken]);

  async function handleSwap() {
    try {
      setExchangeLoading(true);
      if (fromToken && toToken) {
        const response = await exChangeTokenApi(fromToken, toToken, fromAmount);
        toast.success(response);
        setFromAmount(0);
        setToAmount(0);
      }
    } catch (error) {
      console.error("Error swapping tokens:", error);
    } finally {
      setExchangeLoading(false);
    }
  }

  return (
    <div
      className={`min-h-screen bg-gray-900 flex items-center justify-center p-4`}
    >
      <img
        src="/public/99Tech.png"
        alt="99Tech Logo"
        className="absolute top-4 left-4 w-24 h-auto"
      />
      {(tokenLoading || userBalanceLoading) && (
        <Loading text="Loading tokens..." />
      )}
      {exchangeLoading && <Loading text="Exchanging tokens..." />}
      <div className="bg-gray-800 rounded-xl w-full max-w-md p-6 swap-page-container">
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
          onTokenChange={(token) => setFromToken(token)}
          isTargetExchange={false}
          error={errorSwap}
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
          onTokenChange={(token) => setToToken(token)}
          isTargetExchange={true}
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
        <AnimationButton
          onClick={handleSwap}
          disabled={
            !fromToken || !toToken || fromAmount <= 0 || errorSwap !== null
          }
        >
          Swap Tokens
        </AnimationButton>
      </div>
    </div>
  );
};

export default SwapPage;
