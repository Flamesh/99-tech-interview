import { IconButton } from "../../component/icon";
import { FaArrowsAltV } from "react-icons/fa";
import SwapInput from "../../component/swapInput";
import Loading from "../../component/loading";
import { calcRate } from "../../utils/calcRate";
import AnimationButton from "../../component/button";
import "./index.scss";
import { SwapHook } from "./hook";

const SwapPage = () => {
  const {
    fromAmount,
    setFromAmount,
    toAmount,
    setToAmount,
    userBalance,
    tokens,
    tokenLoading,
    exchangeLoading,
    fromToken,
    setFromToken,
    toToken,
    setToToken,
    fromBalance,
    toBalance,
    errorSwap,
    handleSwapTokens,
    handleSwap,
    userBalanceLoading,
  } = SwapHook();

  return (
    <div
      className={`min-h-screen bg-gray-900 flex items-center justify-center p-4`}
    >
      <img
        src="/99Tech.png"
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
